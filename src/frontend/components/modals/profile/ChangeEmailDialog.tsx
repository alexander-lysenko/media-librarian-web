import { Alert, Button, Collapse } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { enqueueSnack } from '../../../core/actions';
import { useChangeEmailFormValidation } from '../../../hooks/validations/useChangeEmailFormValidation';
import { useProfilePatchRequest } from '../../../requests/profileRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { DoneOutlined } from '../../icons';
import { EmailInput } from '../../inputs/EmailInput';
import { FormDialog } from '../../ui/modals/FormDialog';

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

  const profile = useProfileStore((state) => state.profile);
  const open = useProfileDialogsStore((state) => state.emailDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setEmailDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();

  const { register, formState, reset, handleSubmit, setError, clearErrors } = useForm<FormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    values: { email: profile.user.email },
  });
  const { registerField } = useChangeEmailFormValidation(register);
  const { errors } = formState;

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

  const dialogProps: FormDialogProps = {
    id: 'change-email',
    open: open,
    maxWidth: 'xs',
    fullScreen: false,
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('dialogs.changeEmailDialog.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('dialogs.changeEmailDialog.subtitle')}</FormDialog.Subtitle>
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant='filled' severity='error' onClose={() => clearErrors('root')} sx={{ my: 2 }}>
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
          loading={profileUpdateRequest.status === 'pending'}
          loadingPosition='end'
          endIcon={<DoneOutlined />}
          children={t('common.save')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};
