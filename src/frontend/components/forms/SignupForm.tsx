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
import React from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { Language } from "../../hooks/useTranslationStore";

type Props = {
  label: string;
  helperText?: string;
  name: string;
  onChange: (event: SelectChangeEvent) => void;
  value?: string;
};

/**
 * Sign Up Form component
 */
export const SignupForm = () => {
  const { t, getLanguage, setLanguage } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      passwordRepeat: data.get("passwordRepeat"),
      username: data.get("username"),
      language: data.get("language"),
    });
  };

  const handleLanguageSelect = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as Language);
  };

  const handleThemeSelect = (event: SelectChangeEvent) => {
    console.log(event);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <UsernameTextField
        label={t("signupPage.username")}
        helperText={t("signupPage.usernameHint")}
      />
      <EmailTextField label={t("signupPage.email")} helperText={t("signupPage.emailAsLoginHint")} />
      <PasswordTextField
        name={"password"}
        label={t("signupPage.password")}
        helperText={t("signupPage.passwordHint")}
      />
      <PasswordTextField
        name={"passwordRepeat"}
        label={t("signupPage.passwordRepeat")}
        helperText={t("signupPage.passwordRepeatHint")}
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

const EmailTextField = ({ label, helperText }: Partial<Props>) => (
  <TextField
    size="small"
    margin="dense"
    required
    fullWidth
    id="email"
    name="email"
    label={label}
    helperText={helperText}
    autoComplete="email"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <AlternateEmailOutlined />
        </InputAdornment>
      ),
    }}
  />
);

const UsernameTextField = ({ label, helperText }: Partial<Props>) => (
  <TextField
    size="small"
    margin="dense"
    required
    fullWidth
    id="username"
    name="username"
    label={label}
    helperText={helperText}
    autoComplete="name"
    autoFocus
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <BadgeOutlined />
        </InputAdornment>
      ),
    }}
  />
);

const PasswordTextField = ({ name, label, helperText }: Partial<Props>) => (
  <TextField
    size="small"
    margin="dense"
    required
    fullWidth
    type="password"
    id={name}
    name={name}
    label={label}
    helperText={helperText}
    autoComplete="current-password"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <PasswordOutlined />
        </InputAdornment>
      ),
    }}
  />
);

const LanguageSelect = ({ onChange, label, value, helperText }: Partial<Props>) => {
  const { languages } = useTranslation();
  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="language">{label}</InputLabel>
      <Select
        required
        labelId="language"
        id="language"
        name="language"
        value={value}
        label={label}
        onChange={onChange}
      >
        {Object.entries(languages).map(([key, definition]) => (
          <MenuItem key={key} value={key}>
            {definition}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

const ThemeSelect = ({ onChange, label, value, helperText }: Partial<Props>) => {
  return (
    <FormControl fullWidth size="small" margin="dense">
      <InputLabel id="theme">{label}</InputLabel>
      <Select
        required
        labelId="theme"
        id="theme"
        name="theme"
        value={value}
        label={label}
        onChange={onChange}
      >
        <MenuItem key={"light"} value={"light"}>
          {"light"}
        </MenuItem>
        <MenuItem key={"dark"} value={"dark"}>
          {"dark"}
        </MenuItem>
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};
