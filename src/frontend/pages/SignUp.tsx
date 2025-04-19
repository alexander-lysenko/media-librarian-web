import { Avatar, Container, Grid2 as Grid, Link, Paper, styled, Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { BackgroundContainer, StickyFooter } from "../components";
import { Copyright } from "../components";
import { SignupForm } from "../components/forms/SignupForm";
import { PersonAddAltRounded } from "../components/icons";
import { useUnsplashRandomRequest } from "../requests/unsplashApiRequests";

/**
 * Component representing the SignUp (Register) page
 */
export const SignUp = () => {
  const { t } = useTranslation();

  const [background, setBackground] = useState<never>();
  const getImage = useUnsplashRandomRequest();

  useLayoutEffect(() => {
    if (!!background) {
      return;
    }
    getImage.setResponseEvents({
      onSuccess: (response) => {
        setBackground(response.image as never);
      },
    });
    getImage.setQueryParams({ query: "poster, audio, studio" });
    void getImage.fetch();

    return () => getImage.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <BackgroundContainer backgroundInfo={background} />
      <Grid container size={{ xs: 12, sm: 8, md: 5, xl: 4 }} component={Paper} elevation={6} square>
        <Contents>
          <Avatar sx={{ m: 1, backgroundColor: "secondary.main", height: 64, width: 64 }}>
            <PersonAddAltRounded />
          </Avatar>
          <Typography variant="h5">{t("signupPage.title")}</Typography>
          <Typography variant="body2">{t("signupPage.subtitle")}</Typography>
          <SignupForm />

          <Grid container size={12}>
            <Grid size={{ xs: "grow" }}>
              <Link href="#" variant="body2" />
            </Grid>
            <Grid size={{ xs: "auto" }}>
              <Link component={NavLink} to={"/login"} variant="body2">
                {t("signupPage.signIn")}
              </Link>
            </Grid>
          </Grid>
        </Contents>
        <StickyFooter>
          <Copyright />
        </StickyFooter>
      </Grid>
    </Grid>
  );
};

const Contents = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 64,
});
