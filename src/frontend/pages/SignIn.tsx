import { Avatar, Container, Grid2 as Grid, Link, Paper, styled, Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { BackgroundContainer, Copyright, StickyFooter } from "../components";
import { LoginForm } from "../components/forms/LoginForm";
import { LockOutlined } from "../components/icons";
import { PasswordResetInitDialog } from "../components/modals/PasswordResetInitDialog";
import { useUnsplashRandomRequest } from "../requests/unsplashApiRequests";

/**
 * Component representing the SignIn (Login) page
 */
export const SignIn = () => {
  const { t } = useTranslation();

  const [background, setBackground] = useState<never>();
  const [passwordRecoverDialogOpen, setPasswordRecoverDialogOpen] = useState<boolean>(false);

  const getImageRequest = useUnsplashRandomRequest();

  useLayoutEffect(() => {
    if (!!background) {
      return;
    }
    getImageRequest.setResponseEvents({
      onSuccess: (response) => {
        setBackground(response.image as never);
      },
    });
    getImageRequest.setQueryParams({ query: "movie, cinema, audio, music, studio, arts" });
    void getImageRequest.fetch();

    return () => getImageRequest.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecoveryDialogOpen = () => {
    setPasswordRecoverDialogOpen(true);
  };
  const handleRecoveryDialogClose = () => {
    setPasswordRecoverDialogOpen(false);
  };
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <BackgroundContainer backgroundInfo={background} />
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
      <PasswordResetInitDialog open={passwordRecoverDialogOpen} onClose={handleRecoveryDialogClose} />
    </Grid>
  );
};

const Contents = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 64,
});
