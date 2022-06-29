import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Box, Grid, Link, Paper, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

import { Copyright } from "../components/Copyright";
import { LoginForm } from "../components/forms/LoginForm";
import { StickyFooter } from "../components/StickyFooter";

type Props = {
  children: React.ReactNode;
};

/**
 * Component representing the SignUp (Register) page
 */
export const SignUp = () => {
  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <BackgroundContainer />
        <PageContainer>
          <PageBox>
            <Avatar sx={{ m: 1, backgroundColor: "secondary.main", height: 64, width: 64 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <LoginForm />
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={NavLink} to={"/login"} variant="body2">
                  {"Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </PageBox>
          <StickyFooter>
            <Copyright />
          </StickyFooter>
        </PageContainer>
      </Grid>
    </>
  );
};

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

const PageBox = ({ children }: Props) => (
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
