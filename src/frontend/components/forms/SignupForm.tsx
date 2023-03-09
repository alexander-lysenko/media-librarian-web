import {
  AlternateEmailOutlined,
  BadgeOutlined,
  HourglassBottomOutlined,
  PasswordOutlined,
  PersonAddAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  PaletteMode,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, Dispatch, FocusEvent, forwardRef, SetStateAction, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import { useSignupFormValidation } from "../../hooks/useSignupFormValidation";
import { useTranslation } from "../../hooks/useTranslation";
import { useThemeStore } from "../../store/useThemeStore";
import { Language } from "../../store/useTranslationStore";
import { useSignupFormStore } from "../../store/useSignupFormStore";

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage?: string | undefined;
};

/**
 * Sign Up Form functional component
 */
export const SignupForm = () => {
  const { t, getLanguage, setLanguage } = useTranslation();

  const emailChecking = useSignupFormStore((state) => state.emailUniqueProcessing);
  const [loading, setLoading] = useState(false);
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);

  const { register, getValues, trigger, formState, handleSubmit, reset, getFieldState } = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });

  const { errors } = formState;
  const { registerField, registerFieldDebounced } = useSignupFormValidation({
    register,
    trigger,
    getValues,
    getFieldState,
  });

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
  const onValidSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log("Form is valid", data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      setLoading(false);
      reset();
    }, 2000);
  };

  const handleReset = () => {
    reset();
  };

  const handleLanguageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.value as PaletteMode);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <UsernameTextField
        {...registerField("username")}
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint")}
        errorMessage={errors.username?.message as string}
      />
      <EmailTextField
        {...registerFieldDebounced("email", 1000)}
        label={t("signupPage.email")}
        helperText={t("signupPage.emailAsLoginHint")}
        errorMessage={errors.email?.message as string}
        loadingState={emailChecking}
      />
      <PasswordTextField
        {...registerField("password")}
        label={t("signupPage.password")}
        helperText={t("signupPage.passwordHint")}
        errorMessage={errors.password?.message as string}
      />
      <PasswordTextField
        {...registerField("passwordRepeat")}
        label={t("signupPage.passwordRepeat")}
        helperText={t("signupPage.passwordRepeatHint")}
        errorMessage={errors.passwordRepeat?.message as string}
      />
      <LanguageSelect
        {...registerField("language")}
        onChange={handleLanguageSelect}
        value={getLanguage()}
        label={t("signupPage.language")}
        helperText={t("signupPage.languageHint")}
      />
      <ThemeSelect
        {...registerField("theme")}
        onChange={handleThemeSelect}
        value={themeMode}
        label={t("signupPage.theme")}
        helperText={t("signupPage.themeHint")}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        endIcon={loading ? <CircularProgress size={14} /> : <PersonAddAltOutlined />}
        sx={{ mt: 3, mb: 2 }}
      >
        {t("signupPage.signUpBtn")}
      </Button>
      <Button onClick={handleReset}>Reset</Button>
    </Box>
  );
};

const UsernameTextField = forwardRef((props: InputProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      size="small"
      margin="dense"
      fullWidth
      id="username"
      name="username"
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="name"
      onChange={props.onChange}
      onBlur={props.onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <BadgeOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
});

const EmailTextField = forwardRef((props: InputProps & { loadingState: boolean }, ref) => {
  return (
    <TextField
      inputRef={ref}
      size="small"
      margin="dense"
      fullWidth
      id="email"
      name="email"
      autoComplete="email"
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      onChange={props.onChange}
      onBlur={props.onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {props.loadingState ? <HourglassBottomOutlined /> : <AlternateEmailOutlined />}
          </InputAdornment>
        ),
      }}
    />
  );
});

const PasswordTextField = forwardRef((props: InputProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      size="small"
      margin="dense"
      fullWidth
      type="password"
      id={props.name}
      name={props.name}
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="current-password"
      onChange={props.onChange}
      onBlur={props.onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <PasswordOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
});

const LanguageSelect = forwardRef((props: InputProps, ref) => {
  const { languages } = useTranslation();

  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="language">{props.label}</InputLabel>
      <Select
        inputRef={ref}
        labelId="language"
        id="language"
        name="language"
        value={props.value}
        label={props.label}
        onChange={props.onChange as (event: SelectChangeEvent) => void | undefined}
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

const ThemeSelect = forwardRef((props: InputProps, ref) => {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="theme">{props.label}</InputLabel>
      <Select
        inputRef={ref}
        labelId="theme"
        id="theme"
        name="theme"
        value={props.value}
        label={props.label}
        onChange={props.onChange as (event: SelectChangeEvent) => void | undefined}
      >
        <MenuItem key={"light"} value={"light"}>
          {t("theme.presetLight")}
        </MenuItem>
        <MenuItem key={"dark"} value={"dark"}>
          {t("theme.presetDark")}
        </MenuItem>
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
});
