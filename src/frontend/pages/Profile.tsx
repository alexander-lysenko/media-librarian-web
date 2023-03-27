import {
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  EmailOutlined,
  LightModeOutlined,
  PasswordOutlined,
  PermContactCalendarOutlined,
  PhotoAlbumOutlined,
  PowerSettingsNewOutlined,
  TranslateOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { AppNavbar, PaperCardHeader } from "../components";
import { stringAvatar } from "../core";

const username = "User Name";
const email = "username@example.com";
const avatarSrc = "https://source.unsplash.com/TkJbk1I2 2hE/240x240";
const createdAt = "2020-01-01";

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
            itemIcon={PermContactCalendarOutlined}
            secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={profileOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined}
            actionEvents={{ onClick: () => setProfileOpen(!profileOpen) }}
          />
          <Grid container spacing={{ sm: 2 }} display={profileOpen ? "flex" : "none"}>
            <Grid item id="profiler" xs={12} md={4} sx={{ maxWidth: { md: 320 } }}>
              <Profiler username={username} email={email} avatar={avatarSrc} />
            </Grid>
            <Grid item id="preferences" xs={12} sm={6} md={4} lg={4}>
              <List dense disablePadding component="div">
                <ListSubheader component="div">{t("profile.preferences")}</ListSubheader>
                <ListItemButton divider>
                  <ListItemIcon children={<EmailOutlined />} />
                  <ListItemText
                    primary={t("profile.preferencesEnum.email")}
                    secondary={email}
                    secondaryTypographyProps={{ noWrap: true }}
                    title={email}
                  />
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemIcon children={<PasswordOutlined />} />
                  <ListItemText primary={t("profile.preferencesEnum.password")} secondary={"********"} />
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemIcon children={<LightModeOutlined />} />
                  <ListItemText primary={t("profile.preferencesEnum.theme")} secondary={"Dark"} />
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemIcon children={<TranslateOutlined />} />
                  <ListItemText primary={t("profile.preferencesEnum.locale")} secondary={"English"} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon children={<PowerSettingsNewOutlined />} />
                  <ListItemText primary={"Log Out"} secondary={"Tap here to invalidate your session"} />
                </ListItemButton>
              </List>
            </Grid>
            <Grid item id="account-info" xs={12} sm={6} md>
              <List dense disablePadding component="div">
                <ListSubheader component="div">{t("profile.aboutThisProfile")}</ListSubheader>
                <ListItem divider>
                  <ListItemText primary={t("profile.detailsEnum.registrationDate")} secondary={createdAt} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary={t("profile.detailsEnum.accountStatus")} secondary={"Active"} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary={t("profile.detailsEnum.emailStatus")} secondary={"Verified"} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary={"About me"} secondary={"Lorem Ipsum is simply dummy text of the..."} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ my: 3 }}>
          <PaperCardHeader
            title={t("profile.myLibraries")}
            itemIcon={PhotoAlbumOutlined}
            secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={libOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined}
            actionEvents={{ onClick: () => setLibOpen(!libOpen) }}
          />
          <Box display={libOpen ? "block" : "none"}>
            <Container maxWidth={"xl"} sx={{ mt: 3 }}>
              <img
                src="https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/c23f5f64934175.5ae25fb971b46.jpg"
                width="100%"
              />
            </Container>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

const Profiler = ({ username, email, avatar }: { username: string; email: string; avatar: string }) => {
  const { sx, children } = stringAvatar(username);
  const avatarSizes = { height: { xs: 64, sm: 128, md: 192 }, width: { xs: 64, sm: 128, md: 192 } };

  return (
    <Grid container>
      <Grid item xs="auto" md={12} display="flex" justifyContent="center" alignItems="center" px={2} pt={2}>
        <Avatar sx={{ ...sx, ...avatarSizes }} src={avatar} children={children} />
      </Grid>
      <Grid item xs md={12} pt={2}>
        <Typography variant="h5" noWrap title={username} width="100%" textAlign={{ md: "center" }}>
          {username}
        </Typography>
        <Typography variant="subtitle2" noWrap title={email} width="100%" textAlign={{ md: "center" }}>
          {email}
        </Typography>
      </Grid>
    </Grid>
  );
};

const ProfileForm = () => {
  return <></>;
};
