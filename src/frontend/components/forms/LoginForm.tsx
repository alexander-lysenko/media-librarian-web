import { AlternateEmailOutlined, LoginOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { BaseApiResponseEvents } from "../../core";
import { CustomInputProps } from "../../core/types";
import { useFormValidation } from "../../hooks";
import { useLoginRequest } from "../../requests/auth/useLoginRequest";

/**
 * Sign In (aka Login) Form functional component
 */
export const LoginForm = () => {
  const { t } = useTranslation();
  // const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { registerField } = useFormValidation("login", useHookForm);
  const { formState, handleSubmit, reset, setError } = useHookForm;
  const { errors } = formState;

  const { status, fetch: submit, abort, setEvents } = useLoginRequest();
  const loading = status === "LOADING";
  const responseEvents: BaseApiResponseEvents = {
    onSuccess: () => reset(),
    onReject: (reason) => {
      console.log("Rejected", reason);
      reset({ password: "" });
      setError("root.serverError", { message: reason.response?.data.message || reason.message });
    },
  };

  const onValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await submit({ email: data.email, password: data.password });
    abort();
  };
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);

  useEffect(() => {
    setEvents(responseEvents);
  }, [setEvents]);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant="filled" severity="error" onClose={() => reset({ root: "" })} sx={{ mt: 2 }}>
          {errors.root?.serverError.message as string}
        </Alert>
      </Collapse>
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

const EmailTextField = forwardRef((props: CustomInputProps, ref) => {
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

const PasswordTextField = forwardRef((props: CustomInputProps, ref) => {
  const { t } = useTranslation();
  const [passVisible, setPassVisible] = useState<boolean>(false);

  const handlePassVisible = () => setPassVisible(true);
  const handlePassHide = () => setPassVisible(false);
  const togglePassVisible = () => setPassVisible(!passVisible);

  return (
    <TextField
      inputRef={ref}
      fullWidth
      size="small"
      margin="normal"
      type={passVisible ? "text" : "password"}
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
          <InputAdornment
            position="end"
            sx={{ cursor: "pointer" }}
            title={t("common.holdToSeePass")}
            onMouseDown={handlePassVisible}
            onMouseUp={handlePassHide}
            onMouseLeave={handlePassHide}
            onTouchStart={togglePassVisible}
            children={passVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
          />
        ),
      }}
    />
  );
});
