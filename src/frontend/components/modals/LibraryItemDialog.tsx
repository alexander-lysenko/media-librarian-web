import { Box, Button, debounce } from '@mui/material';
import dayjs from 'dayjs';
import { defaults, pick } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { urlValidationPattern } from '../../core';
import { useLibraryItemPostRequest, useLibraryItemPutRequest } from '../../requests/libraryItemRequests';
import { useItemTitleValidationRequest } from '../../requests/validationRequests';
import { useSelectedLibraryStore } from '../../store/library/useLibrariesStore';
import { useLibraryItemFormStore } from '../../store/useLibraryItemFormStore';
import { AddCircleOutlined, ArrowDropDownOutlined, ArrowDropUpOutlined, SaveAsOutlined } from '../icons';
import { LibraryItemInputControl } from '../libraryItemInput/LibraryItemInputControl';
import { FormDialog } from '../ui/modals/FormDialog';
import { PosterUploadInputBox } from '../ui/PosterUploadInputBox';

import type {
  FormValidationRules,
  LibraryElement,
  LibraryFields,
  LibraryItemFormData,
  LibraryItemFormValues,
  UseFormService,
} from '../../core/types';
import type { FormDialogProps } from '../ui/modals/FormDialog';
import type { MutateOptions } from '@tanstack/react-query';
import type { KeyboardEvent, SyntheticEvent } from 'react';
import type { Control, SubmitHandler, ValidateResult } from 'react-hook-form';

type FormType = LibraryItemFormValues;

interface FormEvents {
  handleSubmitByCtrlEnter: (e: KeyboardEvent) => void;
}

/**
 * Modal Dialog to Add New Item / Update Existing Item in a Library
 */
export const LibraryItemDialog = () => {
  const { t } = useTranslation();

  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());
  const { open, isEditMode, titleUniqueProcessing } = useLibraryItemFormStore((state) => state);
  const { showPosterForm, setShowPosterForm } = useLibraryItemFormStore((state) => state);

  const formService = useDialogForm();
  const { registerField, errors, isSubmitting, control } = formService;
  const { handleSubmit, handleSubmitByCtrlEnter, handleClose } = formService;

  const dialogProps: FormDialogProps = {
    open: open,
    paperSx: { minHeight: { sm: 'calc(100% - 128px)' } },
    onSubmit: handleSubmit,
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
            errorMessage={errors?.[label]?.message as string}
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

/**
 * A custom hook that manages the dialog form for creating or updating a Library Items.
 *
 * This hook provides functionality to handle form submission, validation, and interaction
 * with the backend for either creating or updating a library item.
 * It also handles resetting form data and managing submission states.
 */
const useDialogForm = (): UseFormService<FormType> & FormEvents & { control: Control<FormType> } => {
  const { t } = useTranslation();

  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());

  const { handleClose, selectedLibraryId, selectedItem } = useLibraryItemFormStore((state) => state);
  const { open, isEditMode } = useLibraryItemFormStore((state) => state);
  const { setShowPosterForm } = useLibraryItemFormStore((state) => state);

  const createLibraryItemRequest = useLibraryItemPostRequest();
  const updateLibraryItemRequest = useLibraryItemPutRequest();
  const validateItemTitle = useItemTitleValidationRequest();

  const useHookForm = useForm<FormType>({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const { register, formState, reset, handleSubmit, control } = useHookForm;

  const registerField = useCallback(
    (fieldName: keyof FormType, ruleName?: string) => {
      const rules: Record<string, FormValidationRules<FormType, never>> = {
        title: {
          setValueAs: (value: string) => value?.trim(),
          required: t('formValidation.entryTitleRequired'),
          validate: {
            uniqueValidation: async (value: string): Promise<ValidateResult> => {
              return await validateItemTitle
                .mutateAsync({ title: value, item: isEditMode ? selectedItem?.id : undefined })
                .then((response) => response?.message)
                .catch((error) => error.message);
            },
          },
        },
        line: {
          setValueAs: (value: string) => (value ?? '').trim(),
        },
        text: {
          setValueAs: (value: string) => (value ?? '').trim(),
        },
        url: {
          setValueAs: (value: string) => (value ?? '').trim(),
          pattern: {
            value: urlValidationPattern,
            message: t('formValidation.urlInvalid'),
          },
        },
      };

      const registerReturn = register(fieldName as never, rules[ruleName ?? fieldName]);

      if (ruleName === 'title') {
        return { ...registerReturn, onChange: debounce(registerReturn.onChange, 1000) };
      } else {
        return registerReturn;
      }
    },
    [isEditMode, register, selectedItem?.id, t, validateItemTitle],
  );

  const onValidSubmit: SubmitHandler<FormType> = (data, event) => {
    const id = selectedLibraryId as number;
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
    setShowPosterForm(false);
    handleClose();
  };

  useEffect(() => {
    if (open) {
      const formDefaultValues = initFormDefaultValues(selectedLibrary?.fields);
      const dataValues = pick(selectedItem, Object.keys(selectedLibrary?.fields ?? {}));
      const formValues = defaults(dataValues, formDefaultValues);
      reset(formValues, { keepDirtyValues: true });
    }
  }, [open, reset, selectedItem, selectedLibrary]);

  return {
    registerField,
    handleSubmit: handleSubmit(onValidSubmit),
    isSubmitting: createLibraryItemRequest.status === 'pending' || updateLibraryItemRequest.status === 'pending',
    control,
    errors: formState.errors,
    handleClose: handleCloseWithReset,
    handleSubmitByCtrlEnter,
  };
};
