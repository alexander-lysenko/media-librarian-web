import { Alert, Box, Button, Collapse, debounce, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { usePasswordResetRequest } from '../../requests/authRequests';
import { AlternateEmailOutlined, LockReset } from '../icons';
import { PasswordInput } from '../inputs/PasswordInput';
import { TextInput } from '../inputs/TextInput';
import { FormDialog } from '../ui/modals/FormDialog';

import type { FormValidationRules, PasswordResetFormData } from '../../core/types';
import type { FormDialogProps } from '../ui/modals/FormDialog';
import type { SyntheticEvent } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

type FormType = PasswordResetFormData;

interface Props {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
}

/**
 * Password Reset Form Dialog
 */
export const PasswordResetDialog = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const queryParams = new URLSearchParams(location.search);
  const passwordResetRequest = usePasswordResetRequest();
  const isSubmitting = passwordResetRequest.status === 'pending';

  const useHookForm = useForm<PasswordResetFormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      token: queryParams.get('token') ?? undefined,
      email: queryParams.get('email') ?? undefined,
      newPassword: '',
      repeatPassword: '',
      root: '',
    },
  });

  const { register, formState, reset, handleSubmit, setError, clearErrors, getFieldState, trigger } = useHookForm;
  const { errors } = formState;

  const registerField = useCallback(
    (fieldName: keyof FormType, ruleName?: string) => {
      const rules: Record<string, FormValidationRules<FormType>> = {
        email: {
          required: true,
        },
        newPassword: {
          required: t('formValidation.passwordRequired'),
          minLength: { value: 8, message: t('formValidation.passwordMinLength', { n: 8 }) },
          validate: {
            matchesPasswords: () => {
              const prevField = 'repeatPassword';
              const { isDirty, invalid } = getFieldState(prevField);
              if (isDirty || invalid) {
                void trigger(prevField);
              }

              return true;
            },
          },
        },
        repeatPassword: {
          required: t('formValidation.passwordRepeatRequired'),
          validate: {
            matchesPasswords: (value: string, formValues: FieldValues) => {
              const message = t('formValidation.passwordRepeatNotMatch');
              const { newPassword } = formValues;

              return newPassword === value || message;
            },
          },
        },
      };

      const registerReturn = register(fieldName as never, rules[ruleName ?? fieldName]);

      if (fieldName === 'title') {
        return { ...registerReturn, onChange: debounce(registerReturn.onChange, 1000) };
      } else {
        return registerReturn;
      }
    },
    [getFieldState, register, t, trigger],
  );

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      event.preventDefault();
      return false;
    }

    reset();
    onClose(event, reason);
  };

  const onValidSubmit: SubmitHandler<PasswordResetFormData> = (data, event) => {
    void passwordResetRequest.mutateAsync(data, {
      onSuccess: () => {
        handleClose(event as SyntheticEvent);
      },
      onError: (reason) => {
        reset({ newPassword: '', repeatPassword: '' });
        setError('root.serverError', { message: reason.message });
      },
    });
  };

  const dialogProps: FormDialogProps = {
    id: 'password-reset',
    open: open,
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('passwordReset.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('passwordReset.subtitle')}</FormDialog.Subtitle>
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant='filled' severity='error' onClose={() => clearErrors('root')} sx={{ my: 2 }}>
            {errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <TextField type={'hidden'} {...registerField('token')} sx={{ visibility: 'hidden', display: 'none' }} />
        <TextInput
          {...registerField('email')}
          label={t('passwordReset.email') as string}
          helperText={t('passwordReset.emailHint') as string}
          errorMessage={errors.email?.message as string}
          disabled
          icon={<AlternateEmailOutlined />}
        />
        <PasswordInput
          {...registerField('newPassword')}
          label={t('dialogs.changePasswordDialog.newPasswordLabel') as string}
          helperText={t('dialogs.changePasswordDialog.newPasswordHint') as string}
          errorMessage={errors.newPassword?.message as string}
        />
        <PasswordInput
          {...registerField('repeatPassword')}
          label={t('dialogs.changePasswordDialog.repeatPasswordLabel') as string}
          helperText={t('dialogs.changePasswordDialog.repeatPasswordHint') as string}
          errorMessage={errors.repeatPassword?.message as string}
        />
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button variant='text' fullWidth={fullScreen} onClick={handleClose}>
          {t('passwordReset.backToSignIn')}
        </Button>
        <Box sx={{ flex: '1' }}></Box>
        <Button
          type='submit'
          variant='contained'
          fullWidth={fullScreen}
          loading={isSubmitting}
          endIcon={<LockReset />}
          children={t('common.save')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};
