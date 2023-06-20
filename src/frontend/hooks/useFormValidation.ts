import { debounce } from "@mui/material/utils";
import {
  ChangeHandler,
  FieldValues,
  Message,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { RegisteredFormNamesEnum } from "../core/enums";
import { useLibraryCreateFormStore } from "../store/useLibraryCreateFormStore";
import { useSignupFormStore } from "../store/useSignupFormStore";

type RegisteredFormNames = keyof typeof RegisteredFormNamesEnum;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormValidation = (formName: RegisteredFormNames, useFormReturn: UseFormReturn<any>) => {
  const { t } = useTranslation();

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

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
            const prevField = "newPasswordRepeat";
            const { isDirty, invalid } = getFieldState(prevField);
            if (isDirty || invalid) {
              trigger(prevField).then(() => true);
            }

            return true;
          },
        },
      },
      newPasswordRepeat: {
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
      username: {
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
          uniqueValidation: async (value: string) => {
            const setEmailCheckingState = useSignupFormStore.getState().setEmailUniqueProcessing;
            const message = t("formValidation.emailNotUnique");
            setEmailCheckingState(true);

            // todo: replace with a real API request
            const hasEmailTaken = await new Promise<boolean>((resolve) => {
              setTimeout(() => {
                resolve(value === "admin@example.com");
              }, 1000);
            });

            setEmailCheckingState(false);
            return !hasEmailTaken || message;
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
          uniqueValidation: async (value: string) => {
            const message = t("formValidation.libraryTitleNotUnique");
            const setTitleCheckingState = useLibraryCreateFormStore.getState().setTitleUniqueProcessing;
            setTitleCheckingState(true);

            // todo: replace with a real API request
            const hasTitleTaken = await new Promise<boolean>((resolve) => {
              setTimeout(() => {
                resolve(value === "Example");
              }, 1000);
            });

            setTitleCheckingState(false);
            return !hasTitleTaken || message;
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
        setValueAs: (value: string) => value.trim(),
        required: t("formValidation.entryTitleRequired") as Message,
        validate: {
          uniqueValidation: async (value: string) => {
            const message = t("formValidation.entryTitleNotUnique");
            const setTitleCheckingState = useLibraryCreateFormStore.getState().setTitleUniqueProcessing;
            setTitleCheckingState(true);

            // todo: replace with a real API request
            const hasTitleTaken = await new Promise<boolean>((resolve) => {
              setTimeout(() => {
                resolve(value === "Example");
              }, 1000);
            });

            setTitleCheckingState(false);
            return !hasTitleTaken || message;
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
