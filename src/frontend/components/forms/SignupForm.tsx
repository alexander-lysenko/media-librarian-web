import { Box, Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import React from "react";

import { useTranslation } from "../../hooks/useTranslation";

type Props = {
  label: string;
  helperText?: string;
  name: string;
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
    password: data.get("password"),
  });
};

export const SignupForm = () => {
  const { t } = useTranslation();

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <EmailTextField
            label={t("signupPage.email")}
            helperText={t("signupPage.emailAsLoginHint")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <UsernameTextField
            label={t("signupPage.username")}
            helperText={t("signupPage.usernameHint")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PasswordTextField
            name={"password"}
            label={t("signupPage.password")}
            helperText={t("signupPage.passwordHint")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PasswordTextField
            name={"passwordRepeat"}
            label={t("signupPage.passwordRepeat")}
            helperText={t("signupPage.passwordRepeatHint")}
          />
        </Grid>
      </Grid>
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
    </Box>
  );
};

const EmailTextField = ({ label, helperText }: Partial<Props>) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    id="email"
    name="email"
    label={label}
    helperText={helperText}
    autoComplete="email"
    autoFocus
  />
);

const UsernameTextField = ({ label, helperText }: Partial<Props>) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    id="email"
    name="email"
    label={label}
    helperText={helperText}
    autoComplete="email"
    autoFocus
  />
);
const PasswordTextField = ({ name, label, helperText }: Props) => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    type="password"
    id={name}
    name={name}
    label={label}
    helperText={helperText}
    autoComplete="current-password"
  />
);
