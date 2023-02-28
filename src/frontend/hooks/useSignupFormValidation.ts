import { debounce } from "lodash";
import { FieldValues, RegisterOptions, UseFormGetFieldState, UseFormRegister, ValidateResult } from "react-hook-form";
import { UseFormGetValues, UseFormTrigger } from "react-hook-form/dist/types/form";

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
        uniqueValidation: debounce(async (email: string) => {
          // https://github.com/react-hook-form/react-hook-form/issues/40#issuecomment-532881592
          console.log("Email unique check: simulating...");
          const b = await new Promise<string | true>((resolve) => {
            // setEmailCheckingState(true);
            setTimeout(() => {
              resolve(email !== "admin@example.com" || t("formValidation.emailNotUnique"));
              console.log("Done", email);
              // setEmailCheckingState(false);
            }, 1000);
          });
          console.log(b);
          return b;
        }, 1000),
      },
    },
    password: {
      // required: t("formValidation.passwordRequired"),
      // minLength: { value: 8, message: t("formValidation.passwordMinLength", { n: 8 }) },
      validate: {
        required: (value: string) => value !== "" || t("formValidation.passwordRequired"),
        matchesPasswords: () => {
          const prevField = "passwordRepeat";
          const { isDirty, invalid } = getFieldState(prevField);
          if (isDirty || invalid) {
            trigger(prevField).then(() => true);
          }
          return true;
        },
        minLength: (value: string) => value.length >= 8 || t("formValidation.passwordMinLength", { n: 8 }),
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
    // _username: string()
    //   .required(t("formValidation.usernameRequired"))
    //   .min(3, t("formValidation.usernameMinLength", { n: 3 }))
    //   .trim(),
    // _email: yupSequentialStringSchema([
    //   string().required(t("formValidation.emailRequired")).email(t("formValidation.emailInvalid")).lowercase().trim(),
    //   string().test({
    //     name: "checkEmailUnique",
    //     message: t("formValidation.emailNotUnique"),
    //     test: (email) => {
    //       console.log("Email unique check: simulating...");
    //       return new Promise((resolve) => {
    //         setEmailCheckingState(true);
    //         setTimeout(() => {
    //           resolve(email !== "admin@example.com");
    //           setEmailCheckingState(false);
    //         }, 1000);
    //       });
    //       // // async validation example #2
    //       // return fetch(`is-email-unique/${email}`).then(async (res) => {
    //       //   const { isEmailUnique } = await res.json();
    //       //   return isEmailUnique;
    //       // });
    //     }
    //   })
    // ]),
    // _password: string()
    //   .required(t("formValidation.passwordRequired"))
    //   .min(8, t("formValidation.passwordMinLength", { n: 8 })),
    // _passwordRepeat: string()
    //   .required(t("formValidation.passwordRepeatRequired"))
    //   .oneOf([yupRef("password")], t("formValidation.passwordRepeatNotMatch"))
  };
  const registerField = (fieldName: string) => ({ ...register(fieldName, rules[fieldName] || undefined) });

  const registerFieldDebounced = (fieldName: string, delay: number) => ({
    ...register(fieldName, rules[fieldName] || undefined),
    onChange: debounce(async () => await trigger(fieldName), delay, { leading: true }),
  });

  return { registerField, registerFieldDebounced };
};
