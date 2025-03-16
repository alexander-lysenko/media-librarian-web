import { Turnstile } from "@marsidev/react-turnstile";
import { Alert, Box, Button, Checkbox, CircularProgress, Collapse, FormControlLabel } from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useUserLoginRequest } from "../../requests/useAuthRequests";
import { LoginOutlined } from "../icons";
import { EmailInput } from "../inputs/EmailInput";
import { PasswordInput } from "../inputs/PasswordInput";

import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Sign In (Login) Form functional component
 */
export const LoginForm = () => {
  const { t, i18n } = useTranslation();

  const captchaRef = useRef(null);

  const useHookForm = useForm({ mode: "onBlur", reValidateMode: "onChange" });
  const { registerField } = useFormValidation("login", useHookForm);
  const { formState, handleSubmit, setError, clearErrors } = useHookForm;
  const { errors } = formState;

  const useLoginRequest = useUserLoginRequest(useHookForm);
  const loading = useLoginRequest.status === "LOADING";

  const onValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    useLoginRequest.setResponseEvents({
      onError: (reason) => {
        useHookForm.reset({ password: "" });
        setError("root.serverError", { message: reason.message });
        // @ts-ignore TS2339: Property "reset" does not exist on type "never"
        captchaRef.current?.reset();
      },
    });
    await useLoginRequest.fetch(data as never);
  };
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = () => {
    if (errors["cf-turnstile-response"]) {
      setError("root.serverError", { message: errors["cf-turnstile-response"]?.message as string });
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant="filled" severity="error" onClose={() => clearErrors("root")} sx={{ my: 2 }}>
          {errors.root?.serverError.message as string}
        </Alert>
      </Collapse>
      <EmailInput
        {...registerField("email")}
        label={t("loginPage.email")}
        errorMessage={errors.email?.message as string}
      />
      <PasswordInput
        {...registerField("password")}
        label={t("loginPage.password")}
        errorMessage={errors.password?.message as string}
      />
      <FormControlLabel
        control={<Checkbox color="primary" {...registerField("rememberMe")} />}
        label={t("loginPage.rememberMe")}
      />
      <Box sx={{ textAlign: "center", pt: 1 }}>
        <Turnstile
          ref={captchaRef}
          options={{ size: "flexible", language: i18n.language }}
          siteKey={import.meta.env.VITE_CF_TURNSTILE_SITEKEY}
          onWidgetLoad={() => registerField("cf-turnstile-response")}
          onSuccess={(token) => useHookForm.setValue("cf-turnstile-response", token)}
          onExpire={() => {
            // @ts-ignore TS2339: Property "reset" does not exist on type "never"
            captchaRef.current?.reset();
          }}
        />
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
        children={t("loginPage.signInBtn")}
        endIcon={loading ? <CircularProgress size={14} /> : <LoginOutlined />}
      />
    </Box>
  );
};
