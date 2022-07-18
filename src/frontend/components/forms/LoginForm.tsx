import { AlternateEmailOutlined, PasswordOutlined } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField } from "@mui/material";
import React, { ChangeEvent, FocusEvent, useEffect } from "react";

import { EmailValidator } from "../../core/formValidation/emailValidator";
import { RequiredValidator } from "../../core/formValidation/requiredValidator";
import { StringValidator } from "../../core/formValidation/stringValidator";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useTranslation } from "../../hooks/useTranslation";

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
    password: data.get("password"),
  });
};

export const LoginForm = () => {
  const { t } = useTranslation();
  const { errors, validateOnBlur, setValidationRule, validateOnSubmit } = useFormValidation();

  useEffect(() => {
    // doesn't reload translation
    setValidationRule("email", [
      new RequiredValidator({ errorMessage: t("formValidation.emailRequired") }),
      new EmailValidator({ errorMessage: t("formValidation.emailInvalid") }),
    ]);
    setValidationRule("password", [
      new RequiredValidator({ errorMessage: t("formValidation.passwordRequired") }),
      new StringValidator({
        minLength: 8,
        tooShortErrorMsg: t("formValidation.passwordMinLength", { n: 8 }),
      }),
    ]);
  }, [setValidationRule, t]);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <EmailTextField
        label={t("loginPage.email")}
        onBlur={validateOnBlur}
        errorMessage={errors.email}
      />
      <PasswordTextField
        label={t("loginPage.password")}
        onBlur={validateOnBlur}
        errorMessage={errors.password}
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label={t("loginPage.rememberMe")}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t("loginPage.signInBtn")}
      </Button>
    </Box>
  );
};

const EmailTextField = (props: Partial<InputProps>) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    id="email"
    name="email"
    label={props.label}
    error={props.errorMessage !== undefined}
    helperText={props.errorMessage || props.helperText}
    autoComplete="email"
    autoFocus
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
const PasswordTextField = (props: Partial<InputProps>) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    type="password"
    id="password"
    name="password"
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
