import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import { defaults, pick } from 'lodash-es';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useLibraryItemFormValidation } from '../../hooks/validations/useLibraryItemFormValidation';
import { useLibraryItemPostRequest, useLibraryItemPutRequest } from '../../requests/libraryItemRequests';
import { useSelectedLibraryStore } from '../../store/library/useLibrariesStore';
import { useLibraryItemFormStore } from '../../store/useLibraryItemFormStore';
import { AddCircleOutlined, ArrowDropDownOutlined, ArrowDropUpOutlined, SaveAsOutlined } from '../icons';
import { LibraryItemInputControl } from '../libraryItemInput/LibraryItemInputControl';
import { FormDialog } from '../ui/modals/FormDialog';
import { PosterUploadInputBox } from '../ui/PosterUploadInputBox';

import type { LibraryElement, LibraryFields, LibraryItemFormData, LibraryItemFormValues } from '../../core/types';
import type { FormDialogProps } from '../ui/modals/FormDialog';
import type { MutateOptions } from '@tanstack/react-query';
import type { KeyboardEvent, SyntheticEvent } from 'react';
import type { SubmitHandler } from 'react-hook-form';

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 */
export const LibraryItemDialog = () => {
  const { t } = useTranslation();

  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());
  // const open = useLibraryItemFormStore((state) => state.open);
  // const setOpen = useLibraryItemFormStore((state) => state.setOpen);
  // const isEditMode = useLibraryItemFormStore((state) => state.isEditMode);
  // const handleClose = useLibraryItemFormStore((state) => state.handleClose);
  // const showPosterForm = useLibraryItemFormStore((state) => state.showPosterForm);
  // const setShowPosterForm = useLibraryItemFormStore((state) => state.setShowPosterForm);
  // const titleUniqueProcessing = useLibraryItemFormStore((state) => state.titleUniqueProcessing);

  const { open, handleClose, isEditMode } = useLibraryItemFormStore((state) => state);
  const { selectedItem, titleUniqueProcessing } = useLibraryItemFormStore((state) => state);
  const { showPosterForm, setShowPosterForm } = useLibraryItemFormStore((state) => state);

  const createLibraryItemRequest = useLibraryItemPostRequest();
  const updateLibraryItemRequest = useLibraryItemPutRequest();

  const isSubmitting = createLibraryItemRequest.status === 'pending' || updateLibraryItemRequest.status === 'pending';

  const useHookForm = useForm<LibraryItemFormValues>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const { register, formState, reset, handleSubmit, control, getValues } = useHookForm;

  const { registerField } = useLibraryItemFormValidation(register, selectedItem?.id);

  const onValidSubmit: SubmitHandler<LibraryItemFormValues> = (data, event) => {
    console.log('On valid submit', data, event);
    const id = selectedLibrary?.id as number;
    const item = selectedItem?.id as number;
    const requestData: LibraryItemFormData = {
      contents: data,
      // poster: poster ?? "",
    };

    const responseEffects: MutateOptions = {
      onSuccess: () => handleCloseWithReset(event as SyntheticEvent),
    };

    if (isEditMode) {
      void updateLibraryItemRequest.mutateAsync({ id, item, data: requestData }, responseEffects as never);
    } else {
      void createLibraryItemRequest.mutateAsync({ id, data: requestData }, responseEffects as never);
    }
  };

  const onInvalidSubmit = (errors: Record<string, unknown>) => {
    console.log('On invalid submit', errors);
    console.log(formState);
  };

  const handleSubmitByCtrlEnter = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (e.code === 'Enter' && !['TEXTAREA'].includes(target.tagName)) {
      e.preventDefault();
    }
    if (e.code === 'Enter' && e.ctrlKey) {
      handleSubmit(onValidSubmit)();
    }
  };

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      event.preventDefault();
      return false;
    }

    reset();
    handleClose();
  };

  useEffect(() => {
    if (open) {
      const formDefaultValues = initFormDefaultValues(selectedLibrary?.fields);
      const dataValues = pick(selectedItem, Object.keys(selectedLibrary?.fields ?? {}));
      const formValues = defaults(dataValues, formDefaultValues);
      console.log('Form values', formValues);
      console.log('getValues', getValues());
      reset(formValues, { keepDirtyValues: true });
      // reset(formValues);
    }
  }, [open, reset, selectedItem, selectedLibrary]);

  const dialogProps: FormDialogProps = {
    open: open,
    paperSx: { minHeight: { sm: 'calc(100% - 128px)' } },
    onSubmit: handleSubmit(onValidSubmit, onInvalidSubmit),
    onKeyDown: handleSubmitByCtrlEnter,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title noWrap>
        {isEditMode ? t('libraryItem.title.edit') : t('libraryItem.title.create')}
      </FormDialog.Title>
      <FormDialog.Content dividers>
        {Object.entries(selectedLibrary?.fields || {}).map(([label, type]: [string, LibraryElement], index: number) => (
          <LibraryItemInputControl
            {...registerField(label, index === 0 ? 'title' : label)}
            key={label}
            type={type as LibraryElement}
            label={label}
            control={control}
            errorMessage={formState.errors?.[label]?.message as string}
            loadingState={index === 0 ? titleUniqueProcessing : false}
          />
        ))}
      </FormDialog.Content>
      <FormDialog.Actions sx={{ display: showPosterForm ? 'flex' : 'none', pb: 0 }}>
        <PosterUploadInputBox />
      </FormDialog.Actions>
      <FormDialog.Actions>
        <Button
          variant='outlined'
          onClick={() => setShowPosterForm(!showPosterForm)}
          startIcon={<AddCircleOutlined />}
          endIcon={showPosterForm ? <ArrowDropDownOutlined /> : <ArrowDropUpOutlined />}
          children={t('libraryItem.addPoster')}
        />
        <Box flex='1 0 auto' />
        <Button variant='text' onClick={handleClose} children={t('common.cancel')} />
        <Button
          type='submit'
          variant='contained'
          loading={isSubmitting}
          loadingPosition='end'
          endIcon={<SaveAsOutlined />}
          children={isEditMode ? t('common.update') : t('common.create')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};

/**
 * Initializes default values for a form based on the provided fields.
 */
const initFormDefaultValues = (fields?: LibraryFields) => {
  const defaultValues: Record<LibraryElement, () => string | number | boolean> = {
    line: () => '',
    text: () => '',
    date: () => dayjs().format('YYYY-MM-DD'),
    datetime: () => dayjs().format('YYYY-MM-DD HH:mm:ss'),
    url: () => '',
    checkmark: () => false,
    rating5: () => 0,
    rating5precision: () => 0,
    rating10: () => 0,
    rating10precision: () => 0,
    priority: () => 0,
  };

  const reducer = (acc: LibraryItemFormValues, [column, type]: [string, LibraryElement]) => {
    acc[column] = defaultValues[type]();

    return acc;
  };
  return Object.entries(fields || {}).reduce(reducer, {});
};
