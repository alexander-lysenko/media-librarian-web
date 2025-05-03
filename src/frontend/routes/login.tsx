import { Avatar, Container, Grid, Link, Paper, styled, Typography } from "@mui/material";
import { createFileRoute, Link as NavLink } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BackgroundContainer, Copyright, StickyFooter } from "../components";
import { LoginForm } from "../components/forms/LoginForm";
import { LockOutlined } from "../components/icons";
import { PasswordResetInitDialog } from "../components/modals/PasswordResetInitDialog";
import { AppRoutes } from "../core/enums";
import { useUnsplashRandomRequest } from "../requests/unsplashApiRequests";

export const Route = createFileRoute(AppRoutes.login)({
  component: Login,
});

/**
 * Component representing the Login (Login) page
 */
function Login() {
  const { t } = useTranslation();

  const [background, setBackground] = useState<never>();
  const [passwordRecoverDialogOpen, setPasswordRecoverDialogOpen] = useState<boolean>(false);

  const getImageRequest = useUnsplashRandomRequest({ query: "movie, cinema, audio, music, arts" });

  useLayoutEffect(() => {
    setBackground(getImageRequest.data?.image as never);
  }, [getImageRequest.data?.image]);

  const handleRecoveryDialogOpen = () => {
    setPasswordRecoverDialogOpen(true);
  };
  const handleRecoveryDialogClose = () => {
    setPasswordRecoverDialogOpen(false);
  };
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <BackgroundContainer backgroundInfo={background} />
      <Grid container size={{ xs: 12, sm: 8, md: 6, lg: 5, xl: 4 }} component={Paper} elevation={6} square>
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
      <PasswordResetInitDialog open={passwordRecoverDialogOpen} onClose={handleRecoveryDialogClose} />
    </Grid>
  );
}

const Contents = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 64,
});
