import {
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  PermContactCalendarOutlined,
  PhotoAlbumOutlined,
} from "@mui/icons-material";
import { Avatar, Box, Button, Container, IconButton, Paper, SvgIcon, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";

import { AppNavbar, PaperCardHeader } from "../components";
import { stringAvatar } from "../core";
import { useTranslation } from "react-i18next";

const username = "User Name";
const email = "username@example.com";
const avatarSrc = "https://source.unsplash.com/TkJbk1I2 2hE/240x240";

/**
 * Component representing the Profile page
 */
export const Profile = () => {
  const { t } = useTranslation();

  const [profileOpen, setProfileOpen] = useState(true);
  const [libOpen, setLibOpen] = useState(false);

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ my: 3 }}>
          <PaperCardHeader
            title={t("profile.basicDetails")}
            icon={PermContactCalendarOutlined}
            secondaryText={"lorem ipsum dolor sit amet"}
            action={
              <IconButton size="small" onClick={() => setProfileOpen(!profileOpen)}>
                <SvgIcon component={profileOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined} fontSize="inherit" />
              </IconButton>
            }
          />
          <Grid2 container spacing={2} display={profileOpen ? "flex" : "none"} sx={{ p: 3 }}>
            <Profiler username={username} email={email} avatar={avatarSrc} />
            <Grid2 xs>
              <Typography>Date</Typography>
              <Typography>11</Typography>
              <Typography>Count</Typography>
              <Typography>11</Typography>
              <Typography>Running</Typography>
              <Typography>11</Typography>
            </Grid2>
            <Grid2 xs={12} md={4}>
              <Grid2 xs={12}>
                <Button variant={"contained"} color={"primary"}>
                  {"Change email"}
                </Button>
              </Grid2>
              <Grid2 xs={12}>
                <Button variant={"contained"} color={"primary"}>
                  {"Change password"}
                </Button>
              </Grid2>
              <Grid2 xs={12}>
                <Button variant={"contained"} color={"primary"}>
                  {"Locale: en"}
                </Button>
              </Grid2>
              <Grid2 xs={12}>
                <Button variant={"contained"} color={"primary"}>
                  {"Theme: Dark"}
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        </Paper>
        <Paper elevation={3} sx={{ my: 3 }}>
          <PaperCardHeader
            title={t("profile.myLibraries")}
            icon={PhotoAlbumOutlined}
            secondaryText={"lorem ipsum dolor sit amet"}
            action={
              <IconButton size="small" onClick={() => setLibOpen(!libOpen)}>
                <SvgIcon component={libOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined} fontSize="inherit" />
              </IconButton>
            }
          />
          <Box display={libOpen ? "block" : "none"}>Content</Box>
        </Paper>
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

const Profiler = ({ username, email, avatar }: { username: string; email: string; avatar: string }) => {
  const { sx, children } = stringAvatar(username);
  const avatarSizes = { height: { xs: 64, sm: 128 }, width: { xs: 64, sm: 128 } };

  return (
    <Grid2
      container
      xs={12}
      sm={6}
      md={4}
      spacing={2}
      sx={{ display: "flex", alignContent: "start", maxWidth: { sm: 360 } }}
    >
      <Grid2 xs="auto" sm={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar sx={{ ...sx, ...avatarSizes }} src={avatar} children={children} />
      </Grid2>
      <Grid2 container xs sm={12} spacing={0} direction="column">
        <Grid2 xs sm={12} display="flex" justifyContent={{ xs: "start", sm: "center" }}>
          <Typography variant="h6" noWrap title={username}>
            {username}
          </Typography>
        </Grid2>
        <Grid2 xs sm={12} display="flex" justifyContent={{ xs: "start", sm: "center" }}>
          <Typography variant="subtitle2" noWrap title={email}>
            {email}
          </Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

const ProfileForm = () => {
  return <></>;
};
