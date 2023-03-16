import { debounce } from "@mui/material/utils";
import { ChangeHandler, RegisterOptions, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";

import { useTranslation } from "../useTranslation";

type UseFormProps = Pick<UseFormReturn, "register">;

export const useLoginFormValidation = ({ register }: UseFormProps) => {
  const { t } = useTranslation();

  const rules: Record<string, RegisterOptions> = {
    email: {
      setValueAs: (value: string) => value.trim().toLowerCase(),
      required: t("formValidation.emailRequired"),
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t("formValidation.emailInvalid"),
      },
    },
    password: {
      required: t("formValidation.passwordRequired"),
    },
    rememberMe: {
      setValueAs: (value: string) => !!value,
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
