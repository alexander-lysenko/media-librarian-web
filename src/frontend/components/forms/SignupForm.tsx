import { yupResolver } from "@hookform/resolvers/yup";
import { AlternateEmailOutlined, BadgeOutlined, HourglassBottomOutlined, PasswordOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
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
import React, { ChangeEvent, FocusEvent, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { object as yupShape, ref as yupRef, string } from "yup";

import { registerFieldWithDebounceValidation } from "../../core/helpers/registerFieldWithDebounceValidation";
import { yupSequentialStringSchema } from "../../core/helpers/yupSequentialStringSchema";
import { LocalizedStringFn, useTranslation } from "../../hooks/useTranslation";
import { useThemeStore } from "../../store/useThemeStore";
import { Language } from "../../store/useTranslationStore";

type ReactSetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;
type InputProps = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  errorMessage: string | undefined;
  loadingState?: boolean;
};

const makeValidationSchema = (t: LocalizedStringFn, setEmailCheckingState: ReactSetStateAction<boolean>) => {
  return yupShape({
    email: yupSequentialStringSchema([
      string().required(t("formValidation.emailRequired")).email(t("formValidation.emailInvalid")).lowercase().trim(),
      string().test({
        name: "checkEmailUnique",
        message: t("formValidation.emailNotUnique"),
        test: (email) => {
          console.log("Email unique check: simulating...");
          return new Promise((resolve) => {
            setEmailCheckingState(true);
            setTimeout(() => {
              resolve(email !== "admin@example.com");
              setEmailCheckingState(false);
            }, 1000);
          });
          // // async validation example #2
          // return fetch(`is-email-unique/${email}`).then(async (res) => {
          //   const { isEmailUnique } = await res.json();
          //   return isEmailUnique;
          // });
        },
      }),
    ]),
    username: string()
      .required(t("formValidation.usernameRequired"))
      .min(3, t("formValidation.usernameMinLength", { n: 3 }))
      .trim(),
    password: string()
      .required(t("formValidation.passwordRequired"))
      .min(8, t("formValidation.passwordMinLength", { n: 8 })),
    passwordRepeat: string()
      .required(t("formValidation.passwordRepeatRequired"))
      .oneOf([yupRef("password")], t("formValidation.passwordRepeatNotMatch")),
  });
};

/**
 * Sign Up Form functional component
 */
export const SignupForm = () => {
  const [emailChecking, setEmailChecking] = useState(false);
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);

  const { t, getLanguage, setLanguage } = useTranslation();
  const schema = makeValidationSchema(t, setEmailChecking);

  const { register, trigger, formState, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { errors } = formState;

  const onValidSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);
  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);

  const handleLanguageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.value as PaletteMode);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <UsernameTextField
        {...register("username")}
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint")}
        errorMessage={errors.username?.message as string}
      />
      <EmailTextField
        {...register("email")}
        // {...registerFieldWithDebounceValidation("email", 1000, trigger, register)}
        label={t("signupPage.email")}
        helperText={t("signupPage.emailAsLoginHint")}
        errorMessage={errors.email?.message as string}
        loadingState={emailChecking}
      />
      <PasswordTextField
        {...register("password")}
        label={t("signupPage.password")}
        helperText={t("signupPage.passwordHint")}
        errorMessage={errors.password?.message as string}
      />
      <PasswordTextField
        {...register("passwordRepeat")}
        label={t("signupPage.passwordRepeat")}
        helperText={t("signupPage.passwordRepeatHint")}
        errorMessage={errors.passwordRepeat?.message as string}
      />
      <LanguageSelect
        {...register("language")}
        onChange={handleLanguageSelect}
        value={getLanguage()}
        label={t("signupPage.language")}
        helperText={t("signupPage.languageHint")}
      />
      <ThemeSelect
        {...register("theme")}
        onChange={handleThemeSelect}
        value={themeMode}
        label={t("signupPage.theme")}
        helperText={t("signupPage.themeHint")}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t("signupPage.signUpBtn")}
      </Button>
    </Box>
  );
};

const UsernameTextField = React.forwardRef((props: Partial<InputProps>, ref) => {
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

const EmailTextField = React.forwardRef((props: Partial<InputProps>, ref) => {
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

const PasswordTextField = React.forwardRef((props: Partial<InputProps>, ref) => {
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

const LanguageSelect = React.forwardRef((props: Partial<InputProps>, ref) => {
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

const ThemeSelect = React.forwardRef((props: Partial<InputProps>, ref) => {
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
