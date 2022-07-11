import { AlternateEmailOutlined, BadgeOutlined, PasswordOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, FocusEvent } from "react";

import { useFormValidation } from "../../hooks/useFormValidation";
import { useTranslation } from "../../hooks/useTranslation";
import { Language } from "../../hooks/useTranslationStore";

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
};

/**
 * Sign Up Form component
 * TODO: Form validation
 */
export const SignupForm = () => {
  const { t, getLanguage, setLanguage } = useTranslation();
  const { values, errors, handleChange, handleBlur } = useFormValidation();
  // const validationRules = {
  //   email: validation.required().string({min: 10}),
  //   username: validation.required().string(),
  //   password: validation.required().string(),
  //   passwordRepeat: validation.required().string(),
  //   language: validation.required().string(),
  // };

  console.info(errors);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      username: data.get("username"),
      password: data.get("password"),
      passwordRepeat: data.get("passwordRepeat"),
      language: data.get("language"),
    });
  };

  const handleLanguageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: ChangeEvent) => {
    console.log(event);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <UsernameTextField
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint")}
        onChange={handleChange}
        onBlur={handleBlur}
        errorMessage={errors.username}
      />
      <EmailTextField
        label={t("signupPage.email")}
        helperText={t("signupPage.emailAsLoginHint")}
        onChange={handleChange}
        errorMessage={errors.email}
      />
      <PasswordTextField
        name={"password"}
        label={t("signupPage.password")}
        helperText={t("signupPage.passwordHint")}
        onChange={handleChange}
        errorMessage={errors.password}
      />
      <PasswordTextField
        name={"passwordRepeat"}
        label={t("signupPage.passwordRepeat")}
        helperText={t("signupPage.passwordRepeatHint")}
        onChange={handleChange}
        errorMessage={errors.passwordRepeat}
      />
      <LanguageSelect
        onChange={handleLanguageSelect}
        value={getLanguage()}
        label={t("signupPage.language")}
        helperText={t("signupPage.languageHint")}
      />
      <ThemeSelect
        onChange={handleThemeSelect}
        value={"light"}
        label={t("signupPage.theme")}
        helperText={t("signupPage.themeHint")}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t("signupPage.signUpBtn")}
      </Button>
    </Box>
  );
};

const UsernameTextField = (props: Partial<InputProps>) => {
  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      id="username"
      name="username"
      label={props.label}
      error={props.errorMessage !== undefined}
      helperText={props.errorMessage || props.helperText}
      autoComplete="name"
      autoFocus
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
};

const EmailTextField = (props: Partial<InputProps>) => {
  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      id="email"
      name="email"
      autoComplete="email"
      label={props.label}
      error={props.errorMessage !== undefined}
      helperText={props.errorMessage || props.helperText}
      onChange={props.onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <AlternateEmailOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PasswordTextField = (props: Partial<InputProps>) => {
  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      type="password"
      id={props.name}
      name={props.name}
      label={props.label}
      error={props.errorMessage !== undefined}
      helperText={props.errorMessage || props.helperText}
      autoComplete="current-password"
      onChange={props.onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <PasswordOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
};

const LanguageSelect = (props: Partial<InputProps>) => {
  const { languages } = useTranslation();
  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="language">{props.label}</InputLabel>
      <Select
        required
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
};

const ThemeSelect = (props: Partial<InputProps>) => {
  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="theme">{props.label}</InputLabel>
      <Select
        required
        labelId="theme"
        id="theme"
        name="theme"
        value={props.value}
        label={props.label}
        onChange={props.onChange as (event: SelectChangeEvent) => void | undefined}
      >
        <MenuItem key={"light"} value={"light"}>
          {"light"}
        </MenuItem>
        <MenuItem key={"dark"} value={"dark"}>
          {"dark"}
        </MenuItem>
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
};
