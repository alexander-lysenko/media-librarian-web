import { Avatar, Box, Container, Grid, IconButton, Paper, SvgIcon, Typography } from "@mui/material";
import React, { useState } from "react";
import { AppNavbar, PaperCardHeader } from "../components";
import { stringAvatar } from "../core/helpers/stringAvatar";
import { useTranslation } from "../hooks/useTranslation";
import {
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  PermContactCalendarOutlined,
  PhotoAlbumOutlined,
} from "@mui/icons-material";

const username = "User Name";
const email = "username@example.com";
const avatarSrc = "https://source.unsplash.com/TkJbk1I2 2hE/240x240";

export const Profile = () => {
  const { t } = useTranslation();
  const { sx, children } = stringAvatar(username);
  const avatarSizes = {
    height: { xs: 64, sm: 128, md: 240 },
    width: { xs: 64, sm: 128, md: 240 },
  };

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
          <Grid container spacing={{ xs: 2, sm: 3, md: 6 }} display={profileOpen ? "flex" : "none"} sx={{ p: 3 }}>
            <Grid item xs="auto">
              <Avatar sx={{ ...sx, ...avatarSizes }} src={avatarSrc} children={children} />
            </Grid>
            <Grid item xs>
              <Typography>User Name</Typography>
              <Typography>username@example.com</Typography>
              2222
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              4444
            </Grid>
          </Grid>
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
