import { Turnstile } from "@marsidev/react-turnstile";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { forwardRef, useRef } from "react";
import { type SubmitErrorHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { useUserSignupRequest } from "../../requests/authRequests";
import { useThemeStore } from "../../store/system/useThemeStore";
import { useLanguageStore, useTranslationStore } from "../../store/system/useTranslationStore";
import { useSignupFormStore } from "../../store/useSignupFormStore";
import { BadgeOutlined, PersonAddAltOutlined } from "../icons";
import { EmailInput } from "../inputs/EmailInput";
import { PasswordInput } from "../inputs/PasswordInput";
import { TextInput } from "../inputs/TextInput";

import type { InputCustomProps, SignupFormData } from "../../core/types";
import type { Language } from "../../store/system/useTranslationStore";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { PaletteMode } from "@mui/material";
import type { ChangeEvent } from "react";
import type { ChangeHandler, SubmitHandler } from "react-hook-form";

/**
 * Sign Up (Register) Form functional component
 */
export const SignupForm = () => {
  const { t, i18n } = useTranslation();

  const captchaRef = useRef<TurnstileInstance>(null);

  const emailChecking = useSignupFormStore((state) => state.emailUniqueProcessing);
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const signupRequest = useUserSignupRequest();
  const loading = signupRequest.status === "pending";

  const useHookForm = useForm<SignupFormData>({ mode: "onBlur", reValidateMode: "onChange" });
  const { registerField, registerFieldDebounced } = useFormValidation("signup", useHookForm);
  const { formState, handleSubmit, reset, setError } = useHookForm;
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<SignupFormData> = (data) => {
    void signupRequest.mutateAsync(data, {
      onError: (reason) => {
        reset({ password: "", passwordRepeat: "" });
        setError("root.serverError", { message: reason.message });
        captchaRef.current?.reset();
      },
    });
  };

  const onInvalidSubmit: SubmitErrorHandler<SignupFormData> = () => {
    if (errors["cf-turnstile-response"]) {
      setError("root.serverError", { message: errors["cf-turnstile-response"]?.message as string });
    }
  };

  const handleLanguageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.value as PaletteMode);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant="filled" severity="error" onClose={() => reset({ root: "" })} sx={{ my: 2 }}>
          {errors.root?.serverError.message as string}
        </Alert>
      </Collapse>
      <TextInput
        {...registerField("name")}
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint") as string}
        errorMessage={errors.name?.message as string}
        autoComplete={"name"}
        icon={<BadgeOutlined />}
      />
      <EmailInput
        {...registerFieldDebounced(1000, "email")}
        label={t("signupPage.email")}
        helperText={t("signupPage.emailAsLoginHint") as string}
        errorMessage={errors.email?.message as string}
        loadingState={emailChecking}
      />
      <PasswordInput
        {...registerField("password")}
        label={t("signupPage.password")}
        helperText={t("signupPage.passwordHint") as string}
        errorMessage={errors.password?.message as string}
      />
      <PasswordInput
        {...registerField("passwordRepeat")}
        label={t("signupPage.passwordRepeat")}
        helperText={t("signupPage.passwordRepeatHint") as string}
        errorMessage={errors.passwordRepeat?.message as string}
      />
      <LanguageSelect
        {...registerField("locale")}
        onChange={handleLanguageSelect as ChangeHandler}
        value={language}
        label={t("signupPage.language")}
        helperText={t("signupPage.languageHint") as string}
      />
      <ThemeSelect
        {...registerField("theme")}
        onChange={handleThemeSelect as ChangeHandler}
        value={themeMode}
        label={t("signupPage.theme")}
        helperText={t("signupPage.themeHint") as string}
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
        endIcon={loading ? <CircularProgress size={14} /> : <PersonAddAltOutlined />}
        sx={{ mt: 3, mb: 2 }}
        children={t("signupPage.signUpBtn")}
      />
    </Box>
  );
};

const LanguageSelect = forwardRef((props: InputCustomProps, ref) => {
  const languages = useTranslationStore((state) => state.languages);

  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="language">{props.label}</InputLabel>
      <Select
        inputRef={ref}
        labelId="language"
        id="language"
        name="language"
        variant="outlined"
        value={props.value}
        label={props.label}
        onChange={props.onChange}
      >
        {Object.entries(languages).map(([key, definition]) => (
          <MenuItem key={key} value={key}>
            {definition}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
});

const ThemeSelect = forwardRef((props: InputCustomProps, ref) => {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="theme">{props.label}</InputLabel>
      <Select
        inputRef={ref}
        labelId="theme"
        id="theme"
        name="theme"
        variant="outlined"
        value={props.value}
        label={props.label}
        onChange={props.onChange}
      >
        <MenuItem key={"light"} value={"light"}>
          {t("theme.light")}
        </MenuItem>
        <MenuItem key={"dark"} value={"dark"}>
          {t("theme.dark")}
        </MenuItem>
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
});
