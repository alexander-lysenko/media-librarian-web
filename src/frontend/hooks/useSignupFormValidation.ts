import { FieldValues, RegisterOptions, UseFormGetFieldState, UseFormRegister } from "react-hook-form";
import { UseFormGetValues, UseFormTrigger } from "react-hook-form/dist/types/form";

import { useSignupFormStore } from "../store/useSignupFormStore";
import { useTranslation } from "./useTranslation";

type UseFormProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  trigger: UseFormTrigger<T>;
  getValues: UseFormGetValues<T>;
  getFieldState: UseFormGetFieldState<T>;
};

export const useSignupFormValidation = ({ register, trigger, getValues, getFieldState }: UseFormProps<FieldValues>) => {
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
        // required: (value: string) => value !== "" || t("formValidation.passwordRequired"),
        matchesPasswords: () => {
          const prevField = "passwordRepeat";
          const { isDirty, invalid } = getFieldState(prevField);
          if (isDirty || invalid) {
            trigger(prevField).then(() => true);
          }
          return true;
        },
        // minLength: (value: string) => value.length >= 8 || t("formValidation.passwordMinLength", { n: 8 }),
      },
    },
    passwordRepeat: {
      required: t("formValidation.passwordRepeatRequired"),
      validate: {
        matchesPasswords: (value: string) => {
          const { password } = getValues();
          return password === value || t("formValidation.passwordRepeatNotMatch");
        },
      },
    },
  };
  const registerField = (fieldName: string) => ({ ...register(fieldName, rules[fieldName] || undefined) });

  const registerFieldDebounced = (fieldName: string, wait: number) => ({
    ...register(fieldName, rules[fieldName] || undefined),
    // onChange: debounce(async () => await trigger(fieldName), wait, { trailing: true }),
  });

  return { registerField, registerFieldDebounced };
};
