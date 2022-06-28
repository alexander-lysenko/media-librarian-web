import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

import { Copyright } from "../components/Copyright";
import { StickyFooter } from "../components/StickyFooter";

type Props = {
  children: React.ReactNode;
};

/***
 * Component representing the Login page
 */
export const Login = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  return (
    <>
      <LoginPageWrapper>
        <BackgroundContainer />
        <PageContainer>
          <LoginPageBox>
            <Avatar sx={{ m: 1, backgroundColor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
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
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={NavLink} to={"/signup"} variant="body2">
                    {"Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </LoginPageBox>
          <StickyFooter>
            <Copyright />
          </StickyFooter>
        </PageContainer>
      </LoginPageWrapper>
    </>
  );
};

const LoginPageWrapper = ({ children }: Props) => (
  <Grid container component="main" sx={{ height: "100vh" }}>
    {children}
  </Grid>
);

const BackgroundContainer = () => (
  <Grid
    item
    xs={false}
    sm={4}
    md={7}
    sx={{
      backgroundImage: "url(https://source.unsplash.com/random?movie,series)",
      backgroundRepeat: "no-repeat",
      backgroundColor: (t) =>
        t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
);

const PageContainer = ({ children }: Props) => (
  <Grid
    item
    xs={12}
    sm={8}
    md={5}
    container
    direction="column"
    component={Paper}
    elevation={6}
    square
  >
    {children}
  </Grid>
);

const LoginPageBox = ({ children }: Props) => (
  <Box
    sx={{
      my: 8,
      mx: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {children}
  </Box>
);

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
