import { Avatar, Container, Grid2 as Grid, Link, Paper, styled, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { BackgroundContainer, Copyright, StickyFooter } from "../components";
import { LoginForm } from "../components/forms/LoginForm";
import { LockOutlined } from "../components/icons";
import { PasswordRecoveryRequestDialog } from "../components/modals/PasswordRecoveryRequestDialog";
import { PasswordResetDialog } from "../components/modals/PasswordResetDialog";

/**
 * Component representing the SignIn (Login) page
 */
export const SignIn = () => {
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);

  const { t } = useTranslation();

  const [passwordRecoverDialogOpen, setPasswordRecoverDialogOpen] = useState<boolean>(false);
  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState<boolean>(
    searchParams.has("action") && searchParams.get("action") === "recover",
  );

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
      <Grid container size={{ xs: 12, sm: 8, md: 5, xl: 4 }} component={Paper} elevation={6} square>
        <Contents>
          <Avatar sx={{ m: 1, backgroundColor: "secondary.main", height: 64, width: 64 }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">{t("loginPage.title")}</Typography>
          <Typography variant="body2">{t("loginPage.subtitle")}</Typography>
          <LoginForm />

          <Grid container size={12}>
            <Grid size={{ xs: "auto" }}>
              <Link variant="body2" onClick={handleRecoveryDialogOpen} sx={{ cursor: "pointer" }}>
                {t("loginPage.forgotPassword")}
              </Link>
            </Grid>
            <Grid size={{ xs: "grow" }} />
            <Grid size={{ xs: "auto" }}>
              <Link component={NavLink} to={"/signup"} variant="body2">
                {t("loginPage.needSignUp")}
              </Link>
            </Grid>
          </Grid>
        </Contents>
        <StickyFooter>
          <Copyright />
        </StickyFooter>
      </Grid>
      <PasswordRecoveryRequestDialog open={passwordRecoverDialogOpen} onClose={handleRecoveryDialogClose} />
      <PasswordResetDialog open={passwordResetDialogOpen} onClose={handleResetDialogClose} />
    </Grid>
  );
};

const Contents = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 64,
});
