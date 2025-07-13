import { Alert, Button, Collapse, debounce } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { emailValidationPattern } from '../../../core';
import { enqueueSnack } from '../../../core/actions';
import { useProfilePatchRequest } from '../../../requests/profileRequests';
import { useEmailValidationRequest } from '../../../requests/validationRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { DoneOutlined } from '../../icons';
import { EmailInput } from '../../inputs/EmailInput';
import { FormDialog } from '../../ui/modals/FormDialog';

import type { FormValidationRules, UseFormService } from '../../../core/types';
import type { FormDialogProps } from '../../ui/modals/FormDialog';
import type { SyntheticEvent } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

interface FormType extends FieldValues {
  email: string;
}

/**
 * Profile - Dialog - Change Account's Email Address
 */
export const ChangeEmailDialog = () => {
  const { t } = useTranslation();
  const open = useProfileDialogsStore((state) => state.emailDialogOpen);

  const { registerField, handleSubmit, handleClose, isSubmitting, dismissRootError, errors } = useDialogForm();

  const dialogProps: FormDialogProps = {
    id: 'change-email',
    open: open,
    maxWidth: 'xs',
    fullScreen: false,
    onSubmit: handleSubmit,
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('dialogs.changeEmailDialog.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('dialogs.changeEmailDialog.subtitle')}</FormDialog.Subtitle>
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant='filled' severity='error' onClose={dismissRootError} sx={{ my: 2 }}>
            {errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <EmailInput
          {...registerField('email')}
          autoFocus
          label={t('dialogs.changeEmailDialog.label')}
          errorMessage={errors?.email?.message as string}
        />
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button variant='text' onClick={handleClose} children={t('common.cancel')} />
        <Button
          type='submit'
          variant='contained'
          loading={isSubmitting}
          endIcon={<DoneOutlined />}
          children={t('common.save')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};

const useDialogForm = (): UseFormService<FormType> => {
  const { t } = useTranslation();
  const profile = useProfileStore((state) => state.profile);
  const setOpen = useProfileDialogsStore((state) => state.setEmailDialogOpen);

  const validateEmail = useEmailValidationRequest();
  const profileUpdateRequest = useProfilePatchRequest();

  const { register, formState, reset, handleSubmit, setError, clearErrors } = useForm<FormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    values: { email: profile.user.email },
  });

  const registerField = useCallback(
    (fieldName: keyof FormType) => {
      const rules: Record<string, FormValidationRules<FormType, never>> = {
        email: {
          setValueAs: (value: string) => value?.trim().toLowerCase(),
          required: t('formValidation.emailRequired'),
          pattern: {
            message: t('formValidation.emailInvalid'),
            value: emailValidationPattern,
          },
          validate: {
            uniqueValidation: async (value: string) => {
              return await validateEmail
                .mutateAsync({ email: value })
                .then((response) => response?.message)
                .catch((error) => error.message);
            },
          },
        },
      };

      const registerReturn = register(fieldName as never, rules[fieldName]);

      return { ...registerReturn, onChange: debounce(registerReturn.onChange, 1000) };
    },
    [register, t, validateEmail],
  );

  const handleClose = (event: SyntheticEvent | Event) => {
    if (profileUpdateRequest.status === 'pending') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    reset();
    setOpen(false);
  };

  const onValidSubmit: SubmitHandler<FormType> = (data, event) => {
    void profileUpdateRequest.mutateAsync(
      { email: data.email },
      {
        onSuccess: () => {
          handleClose(event as SyntheticEvent);
          enqueueSnack({ message: t('dialogs.changeEmailDialog.success'), type: 'success' });
        },
        onError: (reason) => {
          setError('root.serverError', { message: reason.message });
        },
      },
    );
  };

  return {
    registerField,
    handleSubmit: handleSubmit(onValidSubmit),
    isSubmitting: profileUpdateRequest.status === 'pending',
    dismissRootError: () => clearErrors('root'),
    handleClose,
    errors: formState.errors,
  };
};
