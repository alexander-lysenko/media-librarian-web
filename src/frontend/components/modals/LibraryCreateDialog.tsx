import { Box, Button, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { type KeyboardEvent } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LibraryElementEnum } from '../../core/enums';
import { useLibraryCreateFormValidation } from '../../hooks/validations/useLibraryCreateFormValidation';
import { useLibraryCreateRequest } from '../../requests/libraryRequests';
import { useLibraryCreateFormStore } from '../../store/useLibraryCreateFormStore';
import { AddCircleOutlined, DriveFileRenameOutlineOutlined, HourglassBottomOutlined, SaveAsOutlined } from '../icons';
import { LibraryFieldTemplate } from '../inputs/LibraryFieldTemplate';
import { TextInput } from '../inputs/TextInput';
import { FormDialog } from '../ui/modals/FormDialog';

import type { LibraryFormData } from '../../core/types';
import type { FormDialogProps } from '../ui/modals/FormDialog';
import type { MutateOptions } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import type { SubmitHandler } from 'react-hook-form';

/**
 * A dialog component for creating new libraries with customizable fields.
 * Provides a form interface where users can:
 * - Set the library title
 * - Add, remove, and configure multiple fields
 * - Specify field types (e.g., line, text, etc.)
 */
export const LibraryCreateDialog = () => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));

  const open = useLibraryCreateFormStore((state) => state.open);
  const setOpen = useLibraryCreateFormStore((state) => state.setOpen);
  const titleUniqueProcessing = useLibraryCreateFormStore((state) => state.titleUniqueProcessing);

  const libraryCreateRequest = useLibraryCreateRequest();

  // HOOK FORM
  const { register, formState, setError, reset, handleSubmit, control, clearErrors } = useForm<LibraryFormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { title: '', fields: [{ name: '', type: 'line' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  const { registerField } = useLibraryCreateFormValidation(register);

  // EVENTS
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      event.preventDefault();
      return false;
    }

    clearErrors();
    reset();
    setOpen(false);
  };

  const handleAddNewField = () => append({ name: '', type: LibraryElementEnum.line }, { shouldFocus: true });

  const onValidSubmit: SubmitHandler<LibraryFormData> = async (data, event) => {
    const responseEffects: MutateOptions = {
      onSuccess: () => {
        handleClose(event as SyntheticEvent, 'submit');
      },
      onError: (reason) => {
        setError('root.serverError', { message: `${reason.code} ${reason.message}` });
      },
    };

    void libraryCreateRequest.mutateAsync({ data }, responseEffects as never);
  };

  const handleSubmitByCtrlEnter = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    if (e.code === 'Enter' && !['TEXTAREA'].includes(target.tagName)) {
      e.preventDefault();
    }

    if (e.code === 'Enter' && e.ctrlKey) {
      handleSubmit(onValidSubmit)();
    }
  };

  const dialogProps: FormDialogProps = {
    open,
    paperSx: { minHeight: { sm: 'calc(100% - 128px)' } },
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
    onKeyDown: handleSubmitByCtrlEnter,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('libraryCreate.title')}</FormDialog.Title>
      <FormDialog.Content dividers>
        <TextInput
          {...registerField('title')}
          label={t('libraryCreate.libraryTitle')}
          errorMessage={formState.errors.title?.message as string}
          margin='none'
          icon={titleUniqueProcessing ? <HourglassBottomOutlined /> : <DriveFileRenameOutlineOutlined />}
        />
        <Typography variant='subtitle1' children={t('libraryCreate.fieldsSet')} mt={1} />
        <Divider sx={{ mb: 0.5 }} />
        {fields.map((_field, index) => {
          return (
            <LibraryFieldTemplate
              key={index}
              index={index}
              registerField={registerField}
              errors={formState.errors}
              onRemove={() => remove(index)}
            />
          );
        })}
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button
          variant='outlined'
          onClick={handleAddNewField}
          startIcon={<AddCircleOutlined />}
          children={fullScreen ? t('libraryCreate.field') : t('libraryCreate.addNewField')}
        />
        <Box flex='1 0 auto' />
        <Button variant='text' onClick={handleClose} children={t('common.cancel')} />
        <Button
          type='submit'
          variant='contained'
          loading={libraryCreateRequest.status === 'pending' || titleUniqueProcessing}
          loadingPosition='end'
          endIcon={<SaveAsOutlined />}
          children={t('common.create')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};
