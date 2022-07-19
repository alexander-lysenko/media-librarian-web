import { yupResolver } from "@hookform/resolvers/yup";
import { AlternateEmailOutlined, PasswordOutlined } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField } from "@mui/material";
import React, { ChangeEvent, FocusEvent } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { boolean, object as yupShape, string } from "yup";

import { LocalizedStringFn, useTranslation } from "../../hooks/useTranslation";

type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
};

const makeValidationSchema = (t: LocalizedStringFn) =>
  yupShape({
    email: string()
      .required(t("formValidation.emailRequired"))
      .email(t("formValidation.emailInvalid"))
      .lowercase()
      .trim(),
    password: string()
      .required(t("formValidation.passwordRequired"))
      .min(8, t("formValidation.passwordMinLength", { n: 8 })),
    rememberMe: boolean(),
  });

/**
 * Sign In (aka Login) Form functional component
 */
export const LoginForm = () => {
  const { t } = useTranslation();
  const schema = makeValidationSchema(t);
  const { register, formState, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <EmailTextField
        {...register("email")}
        label={t("loginPage.email")}
        errorMessage={errors.email?.message as unknown as string}
      />
      <PasswordTextField
        {...register("password")}
        label={t("loginPage.password")}
        errorMessage={errors.password?.message as unknown as string}
      />
      <FormControlLabel
        control={<Checkbox color="primary" {...register("rememberMe")} />}
        label={t("loginPage.rememberMe")}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t("loginPage.signInBtn")}
      </Button>
    </Box>
  );
};

const EmailTextField = React.forwardRef((props: Partial<InputProps>, ref) => {
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
});

const PasswordTextField = React.forwardRef((props: Partial<InputProps>, ref) => {
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
