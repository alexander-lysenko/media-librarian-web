import { debounce } from "@mui/material/utils";
import { ChangeHandler, FieldValues, RegisterOptions, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";

import { RegisteredFormNamesEnum } from "../core/enums";
import { useSignupFormStore } from "../store/useSignupFormStore";
import { useTranslation } from "./";

type RegisteredFormNames = keyof typeof RegisteredFormNamesEnum;

export const useFormValidation = (formName: RegisteredFormNames, useFormReturn: UseFormReturn) => {
  const { t } = useTranslation();

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const rules: Record<RegisteredFormNamesEnum, Record<string, RegisterOptions>> = {
    login: {
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired"),
        pattern: {
          value: emailPattern,
          message: t("formValidation.emailInvalid"),
        },
      },
      password: {
        required: t("formValidation.passwordRequired"),
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
        required: t("formValidation.passwordRequired"),
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
        required: t("formValidation.passwordRepeatRequired"),
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const { password } = formValues;
            return password === value || t("formValidation.passwordRepeatNotMatch");
          },
        },
      },
    },
    passwordRecoveryRequest: {
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired"),
        pattern: {
          value: emailPattern,
          message: t("formValidation.emailInvalid"),
        },
      },
    },
    signup: {
      username: {
        setValueAs: (value: string) => value.trim(),
        required: t("formValidation.usernameRequired"),
        minLength: { value: 3, message: t("formValidation.usernameMinLength", { n: 3 }) },
      },
      email: {
        setValueAs: (value: string) => value.trim().toLowerCase(),
        required: t("formValidation.emailRequired"),
        pattern: {
          value: emailPattern,
          message: t("formValidation.emailInvalid"),
        },
        validate: {
          uniqueValidation: async (value: string) => {
            const setEmailCheckingState = useSignupFormStore.getState().setEmailUniqueProcessing;
            setEmailCheckingState(true);

            // todo: replace with a real API request
            const hasEmailTaken = await new Promise<boolean>((resolve) => {
              setTimeout(() => {
                resolve(value === "admin@example.com");
              }, 1000);
            });

            setEmailCheckingState(false);
            return !hasEmailTaken || t("formValidation.emailNotUnique");
          },
        },
      },
      password: {
        required: t("formValidation.passwordRequired"),
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
        required: t("formValidation.passwordRepeatRequired"),
        validate: {
          matchesPasswords: (value: string, formValues: FieldValues) => {
            const { password } = formValues;
            return password === value || t("formValidation.passwordRepeatNotMatch");
          },
        },
      },
    },
  };

  const { register } = useFormReturn;
  const getRule = (fieldName: string): RegisterOptions | undefined => {
    return rules[formName][fieldName] || undefined;
  };

  const registerField = (fieldName: string): UseFormRegisterReturn => ({
    ...register(fieldName, getRule(fieldName)),
  });

  const registerFieldDebounced = (fieldName: string, wait: number): UseFormRegisterReturn => {
    const registerReturn = register(fieldName, getRule(fieldName));
    const { onChange: onChangeRegular } = registerReturn;
    const onChange: ChangeHandler = debounce(async (event) => {
      await onChangeRegular(event);
    }, wait);

    return { ...registerReturn, onChange };
  };

  return { registerField, registerFieldDebounced };
};
