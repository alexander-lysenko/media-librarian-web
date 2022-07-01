import { PersonAddAltRounded } from "@mui/icons-material";
import { Avatar, Box, Grid, Link, Paper, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

import { Copyright } from "../components/Copyright";
import { SignupForm } from "../components/forms/SignupForm";
import { StickyFooter } from "../components/StickyFooter";
import { useTranslation } from "../hooks/useTranslation";

type Props = {
  children?: React.ReactNode;
};

/**
 * Component representing the SignUp (Register) page
 */
export const SignUp = () => {
  const { t } = useTranslation();

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <BackgroundContainer />
        <PageContainer>
          <Box mx={4} my={8} display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ m: 1, backgroundColor: "secondary.main", height: 64, width: 64 }}>
              <PersonAddAltRounded />
            </Avatar>
            <Typography variant="h5">{t("signupPage.title")}</Typography>
            <Typography variant="body2">{t("signupPage.subtitle")}</Typography>
            <SignupForm />
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" />
              </Grid>
              <Grid item>
                <Link component={NavLink} to={"/login"} variant="body2">
                  {t("signupPage.signIn")}
                </Link>
              </Grid>
            </Grid>
          </Box>
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
    xl={8}
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
    xl={4}
    container
    direction="column"
    component={Paper}
    elevation={6}
    square
  >
    {children}
  </Grid>
);
