import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useLibraryTitleValidationRequest } from '../../requests/validationRequests';

import type { ChangeEvent } from 'react';
import type { ChangeHandler, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

export const useLibraryCreateFormValidation = <FormType extends FieldValues>(register: UseFormRegister<FormType>) => {
  const { t } = useTranslation();
  const validateLibraryTitle = useLibraryTitleValidationRequest();
  const titleOnChangeRef = useRef<ChangeHandler | null>(null);

  // prettier-ignore
  const rules = useMemo((): Record<string, RegisterOptions<FormType, Path<FormType>>> => ({
    title: {
      setValueAs: (value: string) => value?.trim(),
      required: t('formValidation.libraryTitleRequired'),
      validate: {
        uniqueValidation: async (value: string) => {
          return await validateLibraryTitle
            .mutateAsync({ title: value })
            .then((response) => response?.message || true)
            .catch((error) => error?.message || t('formValidation.unknownError'));
        },
      },
    },
    name: {
      setValueAs: (value: string) => value.trim(),
      required: t('formValidation.libraryFiledNameRequired'),
      validate: {
        distinct: (value: string, formValues: FormType) => {
          const message = t('formValidation.libraryFiledNameDistinct');
          const coincidences = formValues.fields
            .filter((item: { name: string; type: string }): boolean => item.name === value);

          return coincidences.length <= 1 || message;
        },
      },
    },
    type: {
      required: true,
    },
  }), [t, validateLibraryTitle]);

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
