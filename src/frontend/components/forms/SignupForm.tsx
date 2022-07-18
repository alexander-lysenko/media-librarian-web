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
import React, { ChangeEvent, FocusEvent, useEffect, useMemo } from "react";

import { EmailValidator } from "../../core/formValidation/emailValidator";
import { RequiredValidator } from "../../core/formValidation/requiredValidator";
import { StringValidator } from "../../core/formValidation/stringValidator";
import { useFormValidation } from "../../hooks/useFormValidation";
import { LocalizedStringFn, useTranslation } from "../../hooks/useTranslation";
import { Language } from "../../store/useTranslationStore";
import { useForm } from "react-hook-form";
import { object as yupShape, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
};

const makeSchema = (t: LocalizedStringFn) =>
  yupShape({
    userName: string()
      .required(t("formValidation.usernameRequired"))
      .min(3, t("formValidation.usernameMinLength", { n: 3 }))
      .trim(),
    email: string()
      .required(t("formValidation.emailRequired"))
      .email(t("formValidation.emailInvalid"))
      .lowercase()
      .trim(),
  });

/**
 * Sign Up Form component
 * TODO: Form validation
 */
export const SignupForm = () => {
  const { t, getLanguage, setLanguage } = useTranslation();
  // const { errors, validateOnBlur, setValidationRule, validateOnSubmit } = useFormValidation();

  const schema = makeSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  //
  // useEffect(() => {
  //   // doesn't reload translation
  //   setValidationRule("username", [
  //     new RequiredValidator({ errorMessage: t("formValidation.usernameRequired") }),
  //     new StringValidator({
  //       minLength: 3,
  //       tooShortErrorMsg: t("formValidation.usernameMinLength", { n: 3 }),
  //       errorMessage: t("formValidation.usernameRequired"),
  //     }),
  //   ]);
  //   setValidationRule("email", [
  //     new RequiredValidator({ errorMessage: t("formValidation.emailRequired") }),
  //     new EmailValidator({ errorMessage: t("formValidation.emailInvalid") }),
  //   ]);
  // }, [setValidationRule, t]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    validateOnSubmit(event);
    console.log(errors);
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
    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
      <UsernameTextField
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint")}
        {...register("username")}
        errorMessage={errors.username?.message}
      />
      <EmailTextField
        label={t("signupPage.email")}
        helperText={t("signupPage.emailAsLoginHint")}
        onBlur={validateOnBlur}
        errorMessage={errors.email}
      />
      <PasswordTextField
        name={"password"}
        label={t("signupPage.password")}
        helperText={t("signupPage.passwordHint")}
        onBlur={validateOnBlur}
        errorMessage={errors.password}
      />
      <PasswordTextField
        name={"passwordRepeat"}
        label={t("signupPage.passwordRepeat")}
        helperText={t("signupPage.passwordRepeatHint")}
        onBlur={validateOnBlur}
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
      onBlur={props.onBlur}
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
  const { t } = useTranslation();

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
          {t("theme.presetLight")}
        </MenuItem>
        <MenuItem key={"dark"} value={"dark"}>
          {t("theme.presetDark")}
        </MenuItem>
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
};
