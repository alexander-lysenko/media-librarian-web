import { debounce } from "@mui/material/utils";
import { useTranslation } from "react-i18next";

import {
  useEmailValidationRequest,
  useItemTitleValidationRequest,
  useLibraryTitleValidationRequest,
} from "../requests/validationRequests";
import { useSelectedLibraryStore } from "../store/library/useLibrariesStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";

import type { RegisteredFormNamesEnum } from "../core/enums";
import type {
  ChangeHandler,
  FieldValues,
  Message,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";
import type { ValidateResult } from "react-hook-form/dist/types/validator";

type RegisteredFormNames = keyof typeof RegisteredFormNamesEnum;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormValidation = (formName: RegisteredFormNames, useFormReturn: UseFormReturn<any>) => {
  const { t } = useTranslation();

  const selectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary());
  const selectedItem = useLibraryItemFormStore((state) => state.selectedItem?.id);

  const validateEmail = useEmailValidationRequest();
  const validateLibraryTitle = useLibraryTitleValidationRequest();
  const validateItemTitle = useItemTitleValidationRequest();

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const urlPattern = /^(ht|f)tps?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,9}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/i;

  const rules: Record<RegisteredFormNamesEnum, Record<string, RegisterOptions>> = {
    login: {
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired") as Message,
        pattern: {
          value: emailPattern,
          message: t("formValidation.emailInvalid"),
        },
      },
      password: {
        required: t("formValidation.passwordRequired") as Message,
      },
      rememberMe: {
        setValueAs: (value: string) => !!value,
      },
      "cf-turnstile-response": {
        required: t("formValidation.captchaRequired") as Message,
      },
    },
    passwordRecovery: {
      email: {
        required: true,
      },
      newPassword: {
        required: t("formValidation.passwordRequired") as Message,
        minLength: { value: 8, message: t("formValidation.passwordMinLength", { n: 8 }) },
        validate: {
          matchesPasswords: () => {
            const { getFieldState, trigger } = useFormReturn;
            const prevField = "repeatPassword";
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              void trigger(prevField);
            }

            return true;
          },
        },
      },
      repeatPassword: {
        required: t("formValidation.passwordRepeatRequired") as Message,
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const message = t("formValidation.passwordRepeatNotMatch");
            const { newPassword } = formValues;

            return newPassword === value || message;
          },
        },
      },
    },
    passwordRecoveryRequest: {
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired") as Message,
        pattern: {
          value: emailPattern,
          message: t("formValidation.emailInvalid"),
        },
      },
    },
    signup: {
      name: {
        setValueAs: (value: string) => value.trim(),
        required: t("formValidation.usernameRequired") as Message,
        minLength: { value: 3, message: t("formValidation.usernameMinLength", { n: 3 }) },
      },
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired") as Message,
        pattern: {
          value: emailPattern,
          message: t("formValidation.emailInvalid"),
        },
        validate: {
          uniqueValidation: async (value: string): Promise<ValidateResult> => {
            const message = await validateEmail.fetch({ email: value }).catch((error) => {
              console.warn(error);
              return error.message;
            });
            console.log(message);
            return message;
          },
        },
      },
      password: {
        required: t("formValidation.passwordRequired") as Message,
        minLength: { value: 8, message: t("formValidation.passwordMinLength", { n: 8 }) },
        validate: {
          matchesPasswords: () => {
            const { getFieldState, trigger } = useFormReturn;
            const prevField = "passwordRepeat";
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              trigger(prevField).then(() => true);
            }

            return true;
          },
        },
      },
      passwordRepeat: {
        required: t("formValidation.passwordRepeatRequired") as Message,
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const message = t("formValidation.passwordRepeatNotMatch");
            const { password } = formValues;

            return password === value || message;
          },
        },
      },
    },
    libraryCreate: {
      title: {
        setValueAs: (value: string) => value.trim(),
        required: t("formValidation.libraryTitleRequired") as Message,
        validate: {
          uniqueValidation: async (value: string): Promise<ValidateResult> => {
            return await validateLibraryTitle.fetch({ title: value });
          },
        },
      },
      name: {
        setValueAs: (value: string) => value.trim(),
        required: t("formValidation.libraryFiledNameRequired") as Message,
        validate: {
          distinct: (value: string, formValues: FieldValues) => {
            const message = t("formValidation.libraryFiledNameDistinct");
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
    libraryItem: {
      title: {
        setValueAs: (value: string) => value?.trim(),
        required: t("formValidation.entryTitleRequired") as Message,
        validate: {
          uniqueValidation: async (value: string): Promise<ValidateResult> => {
            validateItemTitle.setPathParams({ id: selectedLibrary?.id as number });

            return await validateItemTitle.fetch({ title: value, item: selectedItem ?? null });
          },
        },
      },
      url: {
        setValueAs: (value: string) => value?.trim(),
        pattern: {
          value: urlPattern,
          message: t("formValidation.urlInvalid"),
        },
      },
    },
    profile: {
      username: {
        setValueAs: (value: string) => value?.trim(),
        required: t("formValidation.usernameRequired") as Message,
        minLength: { value: 3, message: t("formValidation.usernameMinLength", { n: 3 }) },
      },
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired") as Message,
        pattern: {
          message: t("formValidation.emailInvalid"),
          value: emailPattern,
        },
        validate: {
          uniqueValidation: async (value: string) => {
            const message = t("formValidation.emailNotUnique");

            const hasEmailTaken = await validateEmail.fetch({ email: value });
            return !hasEmailTaken || message;
          },
        },
      },
      password: {
        required: t("formValidation.passwordRequired") as Message,
      },
      newPassword: {
        required: t("formValidation.passwordRequired") as Message,
        minLength: { value: 8, message: t("formValidation.passwordMinLength", { n: 8 }) },
        validate: {
          matchesPasswords: () => {
            const { getFieldState, trigger } = useFormReturn;
            const prevField = "repeatPassword";
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              void trigger(prevField);
            }

            return true;
          },
        },
      },
      repeatPassword: {
        required: t("formValidation.passwordRepeatRequired") as Message,
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const message = t("formValidation.passwordRepeatNotMatch");
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
