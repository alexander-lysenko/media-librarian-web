import { Alert, Button, Collapse } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { enqueueSnack } from '../../../core/actions';
import { useProfilePatchRequest } from '../../../requests/profileRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { BadgeOutlined, DoneOutlined } from '../../icons';
import { TextInput } from '../../inputs/TextInput';
import { FormDialog } from '../../ui/modals/FormDialog';

import type { FormDialogProps } from '../../ui/modals/FormDialog';
import type { SyntheticEvent } from 'react';
import type { FieldValues, RegisterOptions, SubmitHandler } from 'react-hook-form';

interface FormType extends FieldValues {
  username: string;
}

/**
 * Profile - Dialog - Change Account's Username
 */
export const ChangeUsernameDialog = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);
  const open = useProfileDialogsStore((state) => state.usernameDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setUsernameDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();

  const { register, formState, handleSubmit, reset, setError, clearErrors } = useForm<FormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    values: { username: profile?.user?.name ?? '' },
  });

  const rules: RegisterOptions<FormType> = {
    setValueAs: (value: string) => value?.trim(),
    required: t('formValidation.usernameRequired'),
    minLength: { value: 3, message: t('formValidation.usernameMinLength', { n: 3 }) },
  };

  const handleClose = (event: SyntheticEvent | Event) => {
    if (profileUpdateRequest.status === 'pending') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    reset();
    setOpen(false);
  };

  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    void profileUpdateRequest.mutateAsync(
      { name: data.username },
      {
        onSuccess: (response) => {
          enqueueSnack({
            message: t('dialogs.changeUsernameDialog.success', { username: response.user.name }),
            type: 'success',
          });
        },
        onError: (reason) => {
          reset({ username: '' });
          setError('root.serverError', { message: reason.message });
        },
        onSettled: () => {
          handleClose(event as SyntheticEvent);
        },
      },
    );
  };

  const dialogProps: FormDialogProps = {
    id: 'change-username',
    open: open,
    maxWidth: 'xs',
    fullScreen: false,
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('dialogs.changeUsernameDialog.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('dialogs.changeUsernameDialog.subtitle')}</FormDialog.Subtitle>
        <Collapse in={!!formState.errors.root?.serverError} unmountOnExit>
          <Alert variant='filled' severity='error' onClose={() => clearErrors('root')} sx={{ my: 2 }}>
            {formState.errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <TextInput
          {...register('username', rules)}
          autoFocus
          autoComplete='name'
          label={t('dialogs.changeUsernameDialog.label')}
          errorMessage={formState.errors?.username?.message as string}
          icon={<BadgeOutlined />}
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
