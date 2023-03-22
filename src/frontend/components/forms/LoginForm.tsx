import { AlternateEmailOutlined, LoginOutlined, PasswordOutlined } from "@mui/icons-material";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, InputAdornment, TextField } from "@mui/material";
import React, { ChangeEvent, FocusEvent, forwardRef, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";

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
 * Sign In (aka Login) Form functional component
 */
export const LoginForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const useLoginForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { registerField } = useFormValidation("login", useLoginForm);
  const { formState, handleSubmit, reset, setError } = useLoginForm;
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    setLoading(true);

    const submitted = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Submit request
        // resolve(true);
        reject({ message: "Invalid username or password" });
      }, 2000);
    })
      .then(() => {
        reset();
      })
      .catch((reason) => {
        reset({ password: "" });
        setError("password", reason);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <EmailTextField
        {...registerField("email")}
        label={t("loginPage.email")}
        errorMessage={errors.email?.message as string}
      />
      <PasswordTextField
        {...registerField("password")}
        label={t("loginPage.password")}
        errorMessage={errors.password?.message as string}
      />
      <FormControlLabel
        control={<Checkbox color="primary" {...registerField("rememberMe")} />}
        label={t("loginPage.rememberMe")}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        endIcon={loading ? <CircularProgress size={14} /> : <LoginOutlined />}
        sx={{ mt: 3, mb: 2 }}
        children={t("loginPage.signInBtn")}
      />
    </Box>
  );
};

const EmailTextField = forwardRef((props: InputProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      size="small"
      margin="normal"
      id="email"
      name="email"
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="email"
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
});

const PasswordTextField = forwardRef((props: InputProps, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      size="small"
      margin="normal"
      type="password"
      id="password"
      name="password"
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
