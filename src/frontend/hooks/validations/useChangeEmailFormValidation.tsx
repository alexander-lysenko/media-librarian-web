import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { emailValidationPattern } from '../../core';
import { useEmailValidationRequest } from '../../requests/validationRequests';

import type { ChangeEvent } from 'react';
import type { ChangeHandler, FieldPath, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

export const useChangeEmailFormValidation = <FormType extends FieldValues>(register: UseFormRegister<FormType>) => {
  const { t } = useTranslation();
  const validateEmail = useEmailValidationRequest();
  const emailOnChangeRef = useRef<ChangeHandler | null>(null);

  // prettier-ignore
  const rules = useMemo((): Record<string, RegisterOptions<FormType, FieldPath<FormType>>> => ({
    email: {
      setValueAs: (value: string) => value?.trim().toLowerCase(),
      required: t('formValidation.emailRequired'),
      pattern: {
        message: t('formValidation.emailInvalid'),
        value: emailValidationPattern,
      },
      validate: {
        uniqueValidation: async (value: string) => {
          return await validateEmail
            .mutateAsync({ email: value })
            .then((response) => response?.message)
            .catch((error) => error.message);
        },
      },
    },
  }), [t, validateEmail]);

  // noinspection DuplicatedCode
  const debouncedTitleValidation = useMemo(() => {
    const fn = (event: ChangeEvent<HTMLInputElement>) => {
      // Call the latest onChange handler from react-hook-form
      void emailOnChangeRef.current?.(event);
    };
    return debounce(fn, 1000);
  }, []);

  // Clean up the debounced function on unmounting to prevent memory leaks
  useEffect(() => () => debouncedTitleValidation.cancel(), [debouncedTitleValidation]);

  const registerField = useCallback(
    (fieldName: string, ruleName?: string) => {
      const registerReturn = register(fieldName as Path<FormType>, rules[ruleName ?? fieldName]);
      // Store the latest onChange handler in the ref
      emailOnChangeRef.current = registerReturn.onChange;

      // Return a stable debounced function
      return { ...registerReturn, onChange: debouncedTitleValidation as never };
    },
    [debouncedTitleValidation, register, rules],
  );

  return { registerField };
};
