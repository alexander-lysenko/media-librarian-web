import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { urlValidationPattern } from '../../core';
import { useItemTitleValidationRequest } from '../../requests/validationRequests';

import type { ChangeEvent } from 'react';
import type {
  ChangeHandler,
  FieldPath,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  ValidateResult,
} from 'react-hook-form';

export const useLibraryItemFormValidation = <FormType extends FieldValues>(
  register: UseFormRegister<FormType>,
  selectedItemId?: number,
) => {
  const { t } = useTranslation();
  const validateItemTitle = useItemTitleValidationRequest();
  const titleOnChangeRef = useRef<ChangeHandler | null>(null);

  // prettier-ignore
  const rules = useMemo((): Record<string, RegisterOptions<FormType, FieldPath<FormType>>> => ({
    title: {
      setValueAs: (value: string) => value?.trim(),
      required: t('formValidation.entryTitleRequired'),
      validate: {
        uniqueValidation: async (value: string): Promise<ValidateResult> => {
          return await validateItemTitle
            .mutateAsync({ title: value, item: selectedItemId })
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
  }), [selectedItemId, t, validateItemTitle]);

  // noinspection DuplicatedCode
  const debouncedTitleValidation = useMemo(() => {
    const fn = (event: ChangeEvent<HTMLInputElement>) => {
      // Call the latest onChange handler from react-hook-form
      void titleOnChangeRef.current?.(event);
    };
    return debounce(fn, 1000);
  }, []);

  // Clean up the debounced function on unmounting to prevent memory leaks
  useEffect(() => () => debouncedTitleValidation.cancel(), [debouncedTitleValidation]);

  const registerField = useCallback(
    (fieldName: string, ruleName?: string) => {
      const registerReturn = register(fieldName as Path<FormType>, rules[ruleName ?? fieldName]);

      if (fieldName === 'title') {
        // Store the latest onChange handler in the ref
        titleOnChangeRef.current = registerReturn.onChange;
        // Return a stable debounced function
        return { ...registerReturn, onChange: debouncedTitleValidation as never };
      }

      return registerReturn;
    },
    [debouncedTitleValidation, register, rules],
  );

  return { registerField };
};
