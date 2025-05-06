import { debounce } from '@mui/material/utils';
import { useTranslation } from 'react-i18next';

import { RegisteredFormNamesEnum } from '../core/enums';
import {
  useEmailValidationRequest,
  useItemTitleValidationRequest,
  useLibraryTitleValidationRequest,
} from '../requests/validationRequests';
import { useLibraryItemFormStore } from '../store/useLibraryItemFormStore';

import type {
  ChangeHandler,
  FieldValues,
  Message,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
  ValidateResult,
} from 'react-hook-form';

type RegisteredFormNames = keyof typeof RegisteredFormNamesEnum;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormValidation = (formName: RegisteredFormNames, useFormReturn: UseFormReturn<any>) => {
  const { t } = useTranslation();

  const selectedItemId = useLibraryItemFormStore((state) => state.selectedItem?.id);
  const isEditMode = useLibraryItemFormStore((state) => state.isEditMode);

  const validateEmail = useEmailValidationRequest();
  const validateLibraryTitle = useLibraryTitleValidationRequest();
  const validateItemTitle = useItemTitleValidationRequest();

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const urlPattern = /^(ht|f)tps?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,9}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/i;

  const rules: Record<RegisteredFormNamesEnum, Record<string, RegisterOptions>> = {
    [RegisteredFormNamesEnum.login]: {
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t('formValidation.emailRequired') as Message,
        pattern: {
          value: emailPattern,
          message: t('formValidation.emailInvalid'),
        },
      },
      password: {
        required: t('formValidation.passwordRequired') as Message,
      },
      rememberMe: {
        setValueAs: (value: string) => !!value,
      },
      'cf-turnstile-response': {
        required: t('formValidation.captchaRequired') as Message,
      },
    },
    [RegisteredFormNamesEnum.passwordRecovery]: {
      email: {
        required: true,
      },
      newPassword: {
        required: t('formValidation.passwordRequired') as Message,
        minLength: { value: 8, message: t('formValidation.passwordMinLength', { n: 8 }) },
        validate: {
          matchesPasswords: () => {
            const { getFieldState, trigger } = useFormReturn;
            const prevField = 'repeatPassword';
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              void trigger(prevField);
            }

            return true;
          },
        },
      },
      repeatPassword: {
        required: t('formValidation.passwordRepeatRequired') as Message,
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const message = t('formValidation.passwordRepeatNotMatch');
            const { newPassword } = formValues;

            return newPassword === value || message;
          },
        },
      },
    },
    [RegisteredFormNamesEnum.passwordRecoveryRequest]: {
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t('formValidation.emailRequired') as Message,
        pattern: {
          value: emailPattern,
          message: t('formValidation.emailInvalid'),
        },
      },
    },
    [RegisteredFormNamesEnum.signup]: {
      name: {
        setValueAs: (value: string) => value.trim(),
        required: t('formValidation.usernameRequired') as Message,
        minLength: { value: 3, message: t('formValidation.usernameMinLength', { n: 3 }) },
      },
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t('formValidation.emailRequired') as Message,
        pattern: {
          value: emailPattern,
          message: t('formValidation.emailInvalid'),
        },
        validate: {
          uniqueValidation: async (value: string): Promise<ValidateResult> => {
            return await validateEmail
              .mutateAsync({ email: value })
              .then((response) => response?.message)
              .catch((error) => error.message);
          },
        },
      },
      password: {
        required: t('formValidation.passwordRequired') as Message,
        minLength: { value: 8, message: t('formValidation.passwordMinLength', { n: 8 }) },
        validate: {
          matchesPasswords: () => {
            const { getFieldState, trigger } = useFormReturn;
            const prevField = 'passwordRepeat';
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              trigger(prevField).then(() => true);
            }

            return true;
          },
        },
      },
      passwordRepeat: {
        required: t('formValidation.passwordRepeatRequired') as Message,
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const message = t('formValidation.passwordRepeatNotMatch');
            const { password } = formValues;

            return password === value || message;
          },
        },
      },
    },
    [RegisteredFormNamesEnum.libraryCreate]: {
      title: {
        setValueAs: (value: string) => value.trim(),
        required: t('formValidation.libraryTitleRequired') as Message,
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
        required: t('formValidation.libraryFiledNameRequired') as Message,
        validate: {
          distinct: (value: string, formValues: FieldValues) => {
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
    },
    [RegisteredFormNamesEnum.libraryItem]: {
      title: {
        setValueAs: (value: string) => value?.trim(),
        required: t('formValidation.entryTitleRequired') as Message,
        validate: {
          uniqueValidation: async (value: string): Promise<ValidateResult> => {
            return await validateItemTitle
              .mutateAsync({ title: value, item: isEditMode ? selectedItemId : undefined })
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
          value: urlPattern,
          message: t('formValidation.urlInvalid'),
        },
      },
    },
    [RegisteredFormNamesEnum.profile]: {
      username: {
        setValueAs: (value: string) => value?.trim(),
        required: t('formValidation.usernameRequired') as Message,
        minLength: { value: 3, message: t('formValidation.usernameMinLength', { n: 3 }) },
      },
      email: {
        setValueAs: (value: string) => value?.trim().toLowerCase(),
        required: t('formValidation.emailRequired') as Message,
        pattern: {
          message: t('formValidation.emailInvalid'),
          value: emailPattern,
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
      password: {
        required: t('formValidation.passwordRequired') as Message,
      },
      newPassword: {
        required: t('formValidation.passwordRequired') as Message,
        minLength: { value: 8, message: t('formValidation.passwordMinLength', { n: 8 }) },
        validate: {
          matchesPasswords: () => {
            const { getFieldState, trigger } = useFormReturn;
            const prevField = 'repeatPassword';
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              void trigger(prevField);
            }

            return true;
          },
        },
      },
      repeatPassword: {
        required: t('formValidation.passwordRepeatRequired') as Message,
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const message = t('formValidation.passwordRepeatNotMatch');
            const { newPassword } = formValues;

            return newPassword === value || message;
          },
        },
      },
    },
  };

  const { register } = useFormReturn;
  const getRule = (fieldName: string): RegisterOptions | undefined => {
    return rules[formName][fieldName] || undefined;
  };

  const registerField = (fieldName: string, ruleName?: string): UseFormRegisterReturn => ({
    ...register(fieldName, getRule(ruleName || fieldName)),
  });

  const registerFieldDebounced = (wait: number, fieldName: string, ruleName?: string): UseFormRegisterReturn => {
    const registerReturn = register(fieldName, getRule(ruleName || fieldName));
    const { onChange: onChangeRegular } = registerReturn;
    const onChange: ChangeHandler = debounce(async (event) => {
      await onChangeRegular(event);
    }, wait);

    return { ...registerReturn, onChange };
  };

  return { registerField, registerFieldDebounced };
};
