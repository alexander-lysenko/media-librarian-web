import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Box, Grid, Link, Paper, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { StickyFooter } from "../components";
import { Copyright } from "../components/Copyright";
import { LoginForm } from "../components/forms/LoginForm";
import { PasswordRecoveryRequestDialog } from "../components/modals/PasswordRecoveryRequestDialog";
import { PasswordResetDialog } from "../components/modals/PasswordResetDialog";
import { useSnackbar } from "../hooks/useSnackbar";

/**
 * Component representing the SignIn (Login) page
 */
export const SignIn = () => {
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);

  const { t } = useTranslation();
  const snackbar = useSnackbar({});

  const [passwordRecoverDialogOpen, setPasswordRecoverDialogOpen] = useState<boolean>(false);
  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState<boolean>(
    searchParams.has("action") && searchParams.get("action") === "recover",
  );

  const emailConfirmedSnackbar = () => {
    snackbar.show("success", t("passwordRecovery.emailSent"));
  };
  const passwordResetSnackbar = () => {
    snackbar.show("success", t("passwordReset.successfullyReset"));
  };

  const handleRecoveryDialogOpen = () => {
    setPasswordRecoverDialogOpen(true);
  };
  const handleRecoveryDialogClose = () => {
    setPasswordRecoverDialogOpen(false);
  };
  const handleResetDialogClose = () => {
    setPasswordResetDialogOpen(false);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <BackgroundContainer />
      <PageContainer>
        <Box mx={4} my={8} display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, backgroundColor: "secondary.main", height: 64, width: 64 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">{t("loginPage.title")}</Typography>
          <Typography variant="body2">{t("loginPage.subtitle")}</Typography>
          <LoginForm />

          <Grid container>
            <Grid item xs>
              <Link variant="body2" onClick={handleRecoveryDialogOpen} sx={{ cursor: "pointer" }}>
                {t("loginPage.forgotPassword")}
              </Link>
            </Grid>
            <Grid item>
              <Link component={NavLink} to={"/signup"} variant="body2">
                {t("loginPage.needSignUp")}
              </Link>
            </Grid>
          </Grid>
        </Box>
        <StickyFooter>
          <Copyright />
        </StickyFooter>
      </PageContainer>
      <PasswordRecoveryRequestDialog
        handleSubmitted={emailConfirmedSnackbar}
        handleClose={handleRecoveryDialogClose}
        open={passwordRecoverDialogOpen}
      />
      <PasswordResetDialog
        handleSubmitted={passwordResetSnackbar}
        handleClose={handleResetDialogClose}
        open={passwordResetDialogOpen}
      />
      {snackbar.render()}
    </Grid>
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
      backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
      backgroundImage: "url(https://source.unsplash.com/random?movie-posters)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
);

type PageContainerProps = {
  children?: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => (
  <Grid item xs={12} sm={8} md={5} xl={4} container direction="column" component={Paper} elevation={6} square>
    {children}
  </Grid>
);
