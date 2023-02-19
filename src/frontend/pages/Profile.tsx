import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "../components/AppNavbar";
import { AppRoutes } from "../core";
import { stringAvatar } from "../core/helpers/stringAvatar";
import { useTranslation } from "../hooks/useTranslation";
import { PaperCardHeader } from "../components";
import { Fingerprint, PermContactCalendar } from "@mui/icons-material";

const username = "User Name";
const email = "username@example.com";
const avatarSrc = "https://source.unsplash.com/TkJbk1I2 2hE/240x240";

export const Profile = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { sx, children } = stringAvatar(username);
  const avatarSizes = {
    height: { xs: 64, sm: 128, md: 240 },
    width: { xs: 64, sm: 128, md: 240 },
  };

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Paper elevation={3}>
          <PaperCardHeader
            title={t("Basic Details")}
            icon={PermContactCalendar}
            secondaryText={"text"}
            action={
              <IconButton size="small">
                <Fingerprint />
              </IconButton>
            }
          />
          <Grid container spacing={1} sx={{ p: 3 }}>
            <Grid item xs="auto">
              <Avatar sx={{ ...sx, ...avatarSizes }} src={avatarSrc}></Avatar>
            </Grid>
            <Grid item xs sx={{ ml: 2 }}>
              <Typography>User Name</Typography>
              <Typography>username@example.com</Typography>
              2222
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              4444
            </Grid>
          </Grid>
        </Paper>
        {/*<Card variant="outlined">*/}
        {/*  <CardHeader>Header</CardHeader>*/}
        {/*  <CardMedia>media</CardMedia>*/}
        {/*  <CardContent>User Name</CardContent>*/}
        {/*  <CardActions>*/}
        {/*    <Button size="small">Share</Button>*/}
        {/*    <Button size="small">Learn More</Button>*/}
        {/*  </CardActions>*/}
        {/*</Card>*/}
      </Container>
      <Container maxWidth={"xl"} sx={{ mt: 3 }}>
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/c23f5f64934175.5ae25fb971b46.jpg"
          width="100%"
        />
      </Container>
    </>
  );
};
