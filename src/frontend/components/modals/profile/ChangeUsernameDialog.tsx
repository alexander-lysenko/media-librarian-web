import { Button, debounce } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { enqueueSnack } from '../../../core/actions';
import { useProfilePatchRequest } from '../../../requests/profileRequests';
import { useProfileDialogsStore } from '../../../store/app/useProfileDialogsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { BadgeOutlined, DoneOutlined } from '../../icons';
import { TextInput } from '../../inputs/TextInput';
import { FormDialog } from '../../ui/modals/FormDialog';

import type { FormValidationRules, UseFormService } from '../../../core/types';
import type { FormDialogProps } from '../../ui/modals/FormDialog';
import type { SyntheticEvent } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';

interface FormType extends FieldValues {
  username: string;
}

/**
 * Profile - Dialog - Change Account's Username
 */
export const ChangeUsernameDialog = () => {
  const { t } = useTranslation();
  const open = useProfileDialogsStore((state) => state.usernameDialogOpen);

  const { registerField, handleSubmit, handleClose, isSubmitting, errors } = useDialogForm();

  const dialogProps: FormDialogProps = {
    open: open,
    maxWidth: 'xs',
    fullScreen: false,
    onSubmit: handleSubmit,
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('dialogs.changeUsernameDialog.title')}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t('dialogs.changeUsernameDialog.subtitle')}</FormDialog.Subtitle>
        <TextInput
          {...registerField('username')}
          autoFocus
          autoComplete='name'
          label={t('dialogs.changeUsernameDialog.label')}
          errorMessage={errors?.username?.message as string}
          icon={<BadgeOutlined />}
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
  const setOpen = useProfileDialogsStore((state) => state.setUsernameDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();

  const { register, formState, handleSubmit, reset, clearErrors } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    values: { username: profile.user.name },
  });

  const registerField = useCallback(
    (fieldName: keyof FormType) => {
      const rules: Record<string, FormValidationRules<FormType, never>> = {
        username: {
          setValueAs: (value: string) => value?.trim(),
          required: t('formValidation.usernameRequired'),
          minLength: { value: 3, message: t('formValidation.usernameMinLength', { n: 3 }) },
        },
      };

      const registerReturn = register(fieldName as never, rules[fieldName] as never);

      return { ...registerReturn, onChange: debounce(registerReturn.onChange, 1000) };
    },
    [register, t],
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
        onSettled: () => {
          handleClose(event as SyntheticEvent);
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
