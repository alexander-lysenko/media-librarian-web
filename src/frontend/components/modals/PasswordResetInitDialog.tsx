import { Turnstile } from '@marsidev/react-turnstile';
import { Alert, Box, Button, Collapse } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { emailValidationPattern } from '../../core';
import { enqueueSnack } from '../../core/actions';
import { usePasswordRecoveryRequest } from '../../requests/authRequests';
import { Send } from '../icons';
import { EmailInput } from '../inputs/EmailInput';
import { FormDialog } from '../ui/modals/FormDialog';

import type { FormValidationRules, RegisterCaptchaProps, UseFormService } from '../../core/types';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { SyntheticEvent } from 'react';
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

interface Props {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
}

interface FormType extends FieldValues {
  email: string;
}

/**
 * Password Reset Init (Recovery Request) Dialog
 */
export const PasswordResetInitDialog = ({ open, onClose }: Props) => {
  const { t, i18n } = useTranslation();

  const formService = useDialogForm({ onClose });
  const { registerField, registerCaptcha, isSubmitting, errors, dismissRootError } = formService;
  const { handleSubmit, handleClose } = formService;

  return (
    <FormDialog id='password-recover' open={open} fullWidth onSubmit={handleSubmit} onClose={handleClose}>
      <FormDialog.Title>{t('passwordRecovery.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('passwordRecovery.subtitle')}</FormDialog.Subtitle>
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant='filled' severity='error' onClose={dismissRootError} sx={{ my: 2 }}>
            {errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <EmailInput
          {...registerField('email')}
          label={t('loginPage.email')}
          errorMessage={errors.email?.message as string}
        />
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <Turnstile
            {...registerCaptcha?.()}
            siteKey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY}
            options={{ size: 'flexible', language: i18n.language }}
          />
        </Box>
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button variant='text' onClick={handleClose}>
          {t('common.cancel')}
        </Button>
        <Button type='submit' variant='contained' loading={isSubmitting} endIcon={<Send />}>
          {t('common.submit')}
        </Button>
      </FormDialog.Actions>
    </FormDialog>
  );
};

const useDialogForm = ({ onClose }: Pick<Props, 'onClose'>): UseFormService<FormType> => {
  const { t } = useTranslation();
  const captchaRef = useRef<TurnstileInstance>(null);

  const passwordRecoveryRequest = usePasswordRecoveryRequest();
  const isSubmitting = passwordRecoveryRequest.status === 'pending';

  const useHookForm = useForm<FormType>({ mode: 'onBlur', reValidateMode: 'onChange' });
  const { register, formState, reset, handleSubmit, setValue, setError, clearErrors } = useHookForm;
  const { errors } = formState;

  const registerField = useCallback(
    (fieldName: keyof FormType) => {
      const rules: Record<string, FormValidationRules<FormType>> = {
        email: {
          setValueAs: (value: string) => value.trim().toLowerCase(),
          required: t('formValidation.emailRequired'),
          pattern: {
            value: emailValidationPattern,
            message: t('formValidation.emailInvalid'),
          },
        },
      };

      return register(fieldName as never, rules[fieldName]);
    },
    [register, t],
  );

  const registerCaptcha = useCallback((): RegisterCaptchaProps => {
    return {
      ref: captchaRef,
      onWidgetLoad: () => registerField('cf-turnstile-response'),
      onSuccess: (token) => setValue('cf-turnstile-response', token),
      onExpire: () => captchaRef.current?.reset(),
    };
  }, [registerField, setValue]);

  const onValidSubmit: SubmitHandler<FormType> = (data, event) => {
    void passwordRecoveryRequest.mutateAsync(data, {
      onSuccess: () => {
        handleCloseWithReset(event as SyntheticEvent);
        enqueueSnack({ type: 'success', message: t('passwordRecovery.emailSent') });
      },
      onError: (reason) => {
        setError('root.serverError', { message: reason.message });
        captchaRef.current?.reset();
      },
    });
  };
  const onInvalidSubmit: SubmitErrorHandler<FormType> = () => {
    if (errors['cf-turnstile-response']) {
      setError('root.serverError', { message: errors['cf-turnstile-response']?.message as string });
    }
  };

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'backdropClick') {
      event.preventDefault();
      return false;
    }

    reset({ email: '' });
    onClose(event, reason);
  };

  return {
    registerField,
    registerCaptcha,
    handleSubmit: handleSubmit(onValidSubmit, onInvalidSubmit),
    isSubmitting,
    errors,
    dismissRootError: () => clearErrors('root'),
  };
};
