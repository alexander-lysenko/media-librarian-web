import { debounce } from "@mui/material/utils";
import { ChangeHandler, FieldValues, RegisterOptions, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";

import { useSignupFormStore } from "../../store/useSignupFormStore";
import { useTranslation } from "../useTranslation";

type UseFormProps = Pick<UseFormReturn, "register" | "trigger" | "getFieldState">;

export const useSignupFormValidation = ({ register, trigger, getFieldState }: UseFormProps) => {
  const { t } = useTranslation();

  const rules: Record<string, RegisterOptions> = {
    username: {
      setValueAs: (value: string) => value.trim(),
      required: t("formValidation.usernameRequired"),
      minLength: { value: 3, message: t("formValidation.usernameMinLength", { n: 3 }) },
    },
    email: {
      setValueAs: (value: string) => value.trim().toLowerCase(),
      required: t("formValidation.emailRequired"),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
  };

  // noinspection DuplicatedCode
  const registerField = (fieldName: string): UseFormRegisterReturn => ({
    ...register(fieldName, rules[fieldName] || undefined),
  });

  const registerFieldDebounced = (fieldName: string, wait: number): UseFormRegisterReturn => {
    const registerReturn = register(fieldName, rules[fieldName] || undefined);
    const { onChange: onChangeRegular } = registerReturn;
    const onChange: ChangeHandler = debounce(async (event) => {
      await onChangeRegular(event);
    }, wait);

    return { ...registerReturn, onChange };
  };

  return { registerField, registerFieldDebounced };
};
