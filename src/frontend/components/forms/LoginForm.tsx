import { Turnstile } from "@marsidev/react-turnstile";
import { Alert, Box, Button, Checkbox, CircularProgress, Collapse, FormControlLabel } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useUserLoginRequest } from "../../requests/authRequests";
import { useAuthCredentialsStore } from "../../store/useAuthCredentialsStore";
import { LoginOutlined } from "../icons";
import { EmailInput } from "../inputs/EmailInput";
import { PasswordInput } from "../inputs/PasswordInput";

import type { LoginFormData } from "../../core/types";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Sign In (Login) Form functional component
 */
export const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);
  const captchaRef = useRef<TurnstileInstance>(null);

  const useHookForm = useForm<LoginFormData>({ mode: "onBlur", reValidateMode: "onChange" });
  const { registerField } = useFormValidation("login", useHookForm);
  const { formState, handleSubmit, setError, clearErrors, getValues, reset } = useHookForm;
  const { errors } = formState;

  const useLoginRequest = useUserLoginRequest();
  const loading = useLoginRequest.status === "pending";

  const onValidSubmit: SubmitHandler<LoginFormData> = (data) => {
    void useLoginRequest.mutateAsync(data, {
      onSuccess: (response) => {
        const { email } = getValues();
        const { token, redirectTo } = response;
        setCredentials(email, token);
        reset();
        navigate({href: redirectTo, replace: true });
      },
      onError: (reason) => {
        reset({ password: "" });
        setError("root.serverError", { message: reason.message });
        captchaRef.current?.reset();
      },
    });
  };
  const onInvalidSubmit: SubmitErrorHandler<LoginFormData> = () => {
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
          onExpire={() => captchaRef.current?.reset()}
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
