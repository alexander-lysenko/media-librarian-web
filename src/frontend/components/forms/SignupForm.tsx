import {
  AlternateEmailOutlined,
  BadgeOutlined,
  HourglassBottomOutlined,
  PersonAddAltOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  PaletteMode,
  Select,
  TextField,
} from "@mui/material";
import { ChangeEvent, forwardRef, useState } from "react";
import { ChangeHandler, FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InputCustomProps } from "../../core/types";
import { useFormValidation } from "../../hooks";
import { useSignupFormStore } from "../../store/useSignupFormStore";
import { useThemeStore } from "../../store/useThemeStore";
import { Language, useLanguageStore, useTranslationStore } from "../../store/useTranslationStore";
import { PasswordInput } from "../inputs/PasswordInput";
import { EmailInput } from "../inputs/EmailInput";
import { TextInput } from "../inputs/TextInput";

/**
 * Sign Up Form functional component
 */
export const SignupForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const emailChecking = useSignupFormStore((state) => state.emailUniqueProcessing);
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);
  const [language, setLanguage] = useLanguageStore((state) => [state.language, state.setLanguage]);

  const useHookForm = useForm({
    mode: "onBlur" || "onTouched",
    reValidateMode: "onChange",
  });
  const { registerField, registerFieldDebounced } = useFormValidation("signup", useHookForm);
  const { formState, handleSubmit, reset } = useHookForm;
  const { errors } = formState;

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

  // const handleReset = () => {
  //   reset();
  // };

  const handleLanguageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.value as PaletteMode);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} sx={{ mt: 1 }}>
      <Collapse in={!!errors.root?.serverError} unmountOnExit>
        <Alert variant="filled" severity="error" onClose={() => reset({ root: "" })} sx={{ mt: 2 }}>
          {errors.root?.serverError.message as string}
        </Alert>
      </Collapse>
      <TextInput
        {...registerField("username")}
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint") as string}
        errorMessage={errors.username?.message as string}
        autocomplete={"name"}
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
        {...registerField("language")}
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        endIcon={loading ? <CircularProgress size={14} /> : <PersonAddAltOutlined />}
        sx={{ mt: 3, mb: 2 }}
        children={t("signupPage.signUpBtn")}
      />
      {/*<Button onClick={handleReset}>Reset</Button>*/}
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
        value={props.value}
        label={props.label}
        onChange={props.onChange}
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
