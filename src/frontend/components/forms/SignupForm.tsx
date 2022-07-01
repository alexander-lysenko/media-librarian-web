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
import { useTranslationStore } from "../../hooks/useTranslationStore";

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
  const { t } = useTranslation();
  const { getLanguage, setLanguage } = useTranslationStore((state) => state);

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
    console.log(event);
    setLanguage(event.target.value);
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
        <MenuItem value={"en"}>English</MenuItem>
        <MenuItem value={"ru"}>Русский</MenuItem>
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};
