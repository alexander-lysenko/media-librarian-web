import { Box, Button, debounce, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LibraryElementEnum } from '../../core/enums';
import { useLibraryCreateRequest } from '../../requests/libraryRequests';
import { useLibraryTitleValidationRequest } from '../../requests/validationRequests';
import { useLibraryCreateFormStore } from '../../store/useLibraryCreateFormStore';
import { AddCircleOutlined, DriveFileRenameOutlineOutlined, HourglassBottomOutlined, SaveAsOutlined } from '../icons';
import { LibraryFieldTemplate } from '../inputs/LibraryFieldTemplate';
import { TextInput } from '../inputs/TextInput';
import { FormDialog } from '../ui/modals/FormDialog';

import type { FormValidationRules, LibraryFormData, UseFieldArrayService, UseFormService } from '../../core/types';
import type { FormDialogProps } from '../ui/modals/FormDialog';
import type { MutateOptions } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import type { SubmitHandler, ValidateResult } from 'react-hook-form';

type FormType = LibraryFormData;

/**
 * A dialog component for creating new libraries with customizable fields.
 * Provides a form interface where users can:
 * - Set the library title
 * - Add, remove, and configure multiple fields
 * - Specify field types (e.g., line, text, etc.)
 */
export const LibraryCreateDialog = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const open = useLibraryCreateFormStore((state) => state.open);
  const titleUniqueProcessing = useLibraryCreateFormStore((state) => state.titleUniqueProcessing);

  const formService = useDialogForm();
  const { registerField, errors, isSubmitting, dynamicFields, appendField, removeField } = formService;
  const { handleSubmit, handleClose } = formService;

  const dialogProps: FormDialogProps = {
    open,
    paperSx: { minHeight: { sm: 'calc(100% - 128px)' } },
    onSubmit: handleSubmit,
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t('libraryCreate.title')}</FormDialog.Title>
      <FormDialog.Content dividers>
        <TextInput
          {...registerField('title')}
          label={t('libraryCreate.libraryTitle')}
          errorMessage={errors.title?.message as string}
          margin='none'
          icon={titleUniqueProcessing ? <HourglassBottomOutlined /> : <DriveFileRenameOutlineOutlined />}
        />
        <Typography variant='subtitle1' children={t('libraryCreate.fieldsSet')} mt={1} />
        <Divider sx={{ mb: 0.5 }} />
        {dynamicFields.map((_field, index) => {
          return (
            <LibraryFieldTemplate
              key={index}
              index={index}
              registerField={registerField as never}
              errors={errors}
              onRemove={() => removeField(index)}
            />
          );
        })}
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button
          variant='outlined'
          onClick={appendField as never}
          startIcon={<AddCircleOutlined />}
          children={fullScreen ? t('libraryCreate.field') : t('libraryCreate.addNewField')}
        />
        <Box flex='1 0 auto' />
        <Button variant='text' onClick={handleClose} children={t('common.cancel')} />
        <Button
          type='submit'
          variant='contained'
          loading={isSubmitting || titleUniqueProcessing}
          endIcon={<SaveAsOutlined />}
          children={t('common.create')}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};

/**
 * A custom hook that manages the form state and operations for the Library creation dialog.
 */
const useDialogForm = (): UseFormService<FormType> & UseFieldArrayService<FormType> => {
  const { t } = useTranslation();
  const setOpen = useLibraryCreateFormStore((state) => state.setOpen);

  const libraryCreateRequest = useLibraryCreateRequest();
  const validateLibraryTitle = useLibraryTitleValidationRequest();

  // HOOK FORM
  const { register, formState, setError, reset, handleSubmit, control, watch, clearErrors } = useForm<FormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { title: '', fields: [{ name: '', type: 'line' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  console.log(fields);
  // const watchingFields = watch('fields');

  const registerField = useCallback(
    (fieldName: keyof FormType, ruleName?: string) => {
      const rules: Record<string, FormValidationRules<FormType, never>> = {
        title: {
          setValueAs: (value: string) => value.trim(),
          required: t('formValidation.libraryTitleRequired'),
          validate: {
            uniqueValidation: async (value: string): Promise<ValidateResult> => {
              return await validateLibraryTitle
                .mutateAsync({ title: value })
                .then((response) => response?.message)
                .catch((error) => error.message);
            },
          },
        },
        name: {
          setValueAs: (value: string) => value.trim(),
          required: t('formValidation.libraryFiledNameRequired'),
          validate: {
            distinct: (value: string, formValues: FormType) => {
              const message = t('formValidation.libraryFiledNameDistinct');
              const coincidences = formValues.fields.filter(
                (item: { name: string; type: string }) => item.name === value,
              );

              return coincidences.length <= 1 || message;
            },
          },
        },
        type: {
          required: true,
        },
      };

      const registerReturn = register(fieldName as never, rules[ruleName ?? fieldName]);

      if (fieldName === 'title') {
        return { ...registerReturn, onChange: debounce(registerReturn.onChange, 1000) };
      } else {
        return registerReturn;
      }
    },
    [register, t, validateLibraryTitle],
  );

  // EVENTS
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      event.preventDefault();
      return false;
    }

    reset();
    setOpen(false);
  };

  const handleAddNewField = () => append({ name: '', type: LibraryElementEnum.line }, { shouldFocus: true });

  const onValidSubmit: SubmitHandler<LibraryFormData> = async (data) => {
    const responseEffects: MutateOptions = {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: (reason) => {
        setError('root.serverError', { message: `${reason.code} ${reason.message}` });
      },
    };

    void libraryCreateRequest.mutateAsync({ data }, responseEffects as never);
  };

  return {
    registerField,
    handleSubmit: handleSubmit(onValidSubmit),
    isSubmitting: libraryCreateRequest.status === 'pending',
    dismissRootError: () => clearErrors('root'),
    errors: formState.errors,
    handleClose,
    dynamicFields: fields,
    appendField: handleAddNewField,
    removeField: remove,
  };
};
