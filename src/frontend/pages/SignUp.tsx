import { PersonAddAltRounded } from "@mui/icons-material";
import { Avatar, Box, Grid, Link, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { BackgroundContainer, StickyFooter } from "../components";
import { Copyright } from "../components";
import { SignupForm } from "../components/forms/SignupForm";

import type { ReactNode } from "react";

/**
 * Component representing the SignUp (Register) page
 */
export const SignUp = () => {
  const { t } = useTranslation();

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <BackgroundContainer />
      <PageContainer>
        <Box mx={4} mt={8} display="flex" flexDirection="column" alignItems="center">
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
  );
};

type PageContainerProps = {
  children?: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => (
  <Grid item xs={12} sm={8} md={5} xl={4} container direction="column" component={Paper} elevation={6} square>
    {children}
  </Grid>
);
