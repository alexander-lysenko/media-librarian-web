import { Box, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import React from "react";

import { useTranslation } from "../../hooks/useTranslation";

type Props = {
  label: string;
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
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <EmailTextField label={t("loginPage.email")} />
      <PasswordTextField label={t("loginPage.password")} />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label={t("loginPage.rememberMe")}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t("loginPage.signIn")}
      </Button>
    </Box>
  );
};

const EmailTextField = ({ label }: Props) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    id="email"
    name="email"
    label={label}
    autoComplete="email"
    autoFocus
  />
);
const PasswordTextField = ({ label }: Props) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    type="password"
    id="password"
    name="password"
    label={label}
    autoComplete="current-password"
  />
);
