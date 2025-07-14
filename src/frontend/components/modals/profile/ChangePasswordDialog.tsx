import { Alert, Button, Collapse } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useProfileChangePasswordRequest } from '../../../requests/profileRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { DoneOutlined } from '../../icons';
import { PasswordInput } from '../../inputs/PasswordInput';
import { FormDialog } from '../../ui/modals/FormDialog';

import type { ErrorResponse, FormValidationRules, PasswordChangeFormData } from '../../../core/types';
import type { FormDialogProps } from '../../ui/modals/FormDialog';
import type { SyntheticEvent } from 'react';
import type { SubmitHandler } from 'react-hook-form';

type FormType = PasswordChangeFormData;

/**
 * Profile - Dialog - Change Account's Password
 */
export const ChangePasswordDialog = () => {
  const { t } = useTranslation();

  const open = useProfileDialogsStore((state) => state.passwordDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setPasswordDialogOpen);

  const changePasswordRequest = useProfileChangePasswordRequest();

  const useHookForm = useForm<FormType>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const { register, formState, reset, handleSubmit, setError, clearErrors, getFieldState, trigger } = useHookForm;
  const { errors } = formState;

  const registerField = useCallback(
    (fieldName: keyof FormType) => {
      const rules: Record<string, FormValidationRules<FormType, never>> = {
        password: {
          required: t('formValidation.passwordRequired'),
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
            matchesPasswords: (value: string, formValues: FormType) => {
              const message = t('formValidation.passwordRepeatNotMatch');
              const { newPassword } = formValues;

              return newPassword === value || message;
            },
          },
        },
      };

      return register(fieldName as never, rules[fieldName]);
    },
    [getFieldState, register, t, trigger],
  );

  const handleClose = (event: SyntheticEvent | Event) => {
    if (changePasswordRequest.status === 'pending') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    reset();
    setOpen(false);
  };

  const onErrorResponse = (reason: ErrorResponse) => {
    setError('root.serverError', { message: reason.message });
    if (reason.errors?.['password']) {
      setError('password', { message: reason.errors?.['password'][0] });
    }
    if (reason.errors?.['newPassword']) {
      setError('newPassword', { message: reason.errors?.['newPassword'][0] });
    }
    if (reason.errors?.['repeatPassword']) {
      setError('repeatPassword', { message: reason.errors?.['repeatPassword'][0] });
    }
  };

  const onValidSubmit: SubmitHandler<FormType> = (data, event) => {
    void changePasswordRequest.mutateAsync(data, {
      onSuccess: () => {
        handleClose(event as SyntheticEvent);
      },
      onError: onErrorResponse,
    });
  };

  const dialogProps: FormDialogProps = {
    id: 'change-password',
    open: open,
    maxWidth: 'xs',
    fullScreen: false,
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('dialogs.changePasswordDialog.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('dialogs.changePasswordDialog.subtitle')}</FormDialog.Subtitle>
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant='filled' severity='error' onClose={() => clearErrors('root')} sx={{ my: 2 }}>
            {errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <PasswordInput
          {...registerField('password')}
          label={t('dialogs.changePasswordDialog.passwordLabel')}
          helperText={t('dialogs.changePasswordDialog.passwordHint') as string}
          errorMessage={errors.password?.message as string}
        />
        <PasswordInput
          {...registerField('newPassword')}
          label={t('dialogs.changePasswordDialog.newPasswordLabel')}
          helperText={t('dialogs.changePasswordDialog.newPasswordHint') as string}
          errorMessage={errors.newPassword?.message as string}
        />
        <PasswordInput
          {...registerField('repeatPassword')}
          label={t('dialogs.changePasswordDialog.repeatPasswordLabel')}
          helperText={t('dialogs.changePasswordDialog.repeatPasswordHint') as string}
          errorMessage={errors.repeatPassword?.message as string}
        />
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button variant='text' onClick={handleClose} children={t('common.cancel')} />
        <Button
          type='submit'
          variant='contained'
          loading={changePasswordRequest.status === 'pending'}
          loadingPosition='end'
          endIcon={<DoneOutlined />}
          children={t('common.save')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};
