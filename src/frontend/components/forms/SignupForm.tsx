import { Box, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import React from "react";

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get("email"),
    password: data.get("password"),
  });
};

export const SignupForm = () => {
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <EmailTextField />
      <PasswordTextField />
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

const EmailTextField = () => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    id="email"
    name="email"
    label="Email Address"
    autoComplete="email"
    autoFocus
  />
);
const PasswordTextField = () => (
  <TextField
    size="small"
    margin="normal"
    required
    fullWidth
    type="password"
    id="password"
    name="password"
    label="Password"
    autoComplete="current-password"
  />
);
