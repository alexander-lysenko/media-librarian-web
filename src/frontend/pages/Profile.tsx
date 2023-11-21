import {
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  BadgeOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlined,
  EmailOutlined,
  ErrorOutlined,
  GridViewOutlined,
  HighlightOffOutlined,
  LibraryBooksOutlined,
  LightModeOutlined,
  MarkEmailReadOutlined,
  MarkEmailUnreadOutlined,
  PasswordOutlined,
  PermContactCalendarOutlined,
  PhotoAlbumOutlined,
  PowerSettingsNewOutlined,
  RemoveCircleOutlined,
  TranslateOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Divider,
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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppNavbar, MyLibraries, PaperCardHeader } from "../components";
import {
  ChangeEmailDialog,
  ChangePasswordDialog,
  ChangeUsernameDialog,
  LibraryCreateDialog,
} from "../components/modals";
import { SimpleDialog } from "../components/modals/SimpleDialog";
import { stringAvatar } from "../core";
import { enqueueSnack } from "../core/actions";
import { AccountStatusEnum } from "../core/enums";
import { useProfileGetRequest } from "../requests/useProfileRequests";
import { useProfileStore } from "../store/useProfileStore";

import type { ReactNode } from "react";

/**
 * Component representing the Profile page
 */
export const Profile = () => {
  const { t } = useTranslation();
  const { fetch: request } = useProfileGetRequest();
  const profile = useProfileStore((state) => state.profile);

  const dataFetchedRef = useRef(false);

  const [profileSectionOpen, setProfileSectionOpen] = useState(true);
  const [libSectionOpen, setLibSectionOpen] = useState(true);

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      void request();
    }
  }, [request]);

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ my: 3 }}>
          <PaperCardHeader
            title={t("profile.basicDetails")}
            itemIcon={PermContactCalendarOutlined}
            // secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={profileSectionOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined}
            actionEvents={{ onClick: () => setProfileSectionOpen(!profileSectionOpen) }}
          />
          <Grid container display={profileSectionOpen ? "flex" : "none"}>
            <Grid item id="profiler" xs={12} md={4} sx={{ maxWidth: { md: 320 } }}>
              <Profiler username={profile.name} email={profile.email} avatar={profile.avatar} />
            </Grid>
            <Grid item id="preferences" xs={12} sm={6} md={4} lg={4}>
              <ProfileActions />
            </Grid>
            <Grid item id="account-info" xs={12} sm={6} md>
              <AccountInfo />
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ my: 3 }}>
          <PaperCardHeader
            title={t("myLibraries.title")}
            itemIcon={PhotoAlbumOutlined}
            secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={libSectionOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined}
            actionEvents={{ onClick: () => setLibSectionOpen(!libSectionOpen) }}
          />
          <Box display={libSectionOpen ? "block" : "none"}>
            <MyLibraries />
          </Box>
        </Paper>
      </Container>
      <SimpleDialog />
      <LibraryCreateDialog />
    </>
  );
};

const Profiler = ({ username, email, avatar }: { username: string; email: string; avatar: string }) => {
  const { sx, children } = stringAvatar(username);
  const avatarSizes = { height: { xs: 64, sm: 128, md: 192 }, width: { xs: 64, sm: 128, md: 192 } };

  return (
    <Grid container>
      <Grid item xs="auto" md={12} display="flex" justifyContent="center" alignItems="center" p={2}>
        <Avatar sx={{ ...sx, ...avatarSizes }} src={avatar} children={children} />
      </Grid>
      <Grid item zeroMinWidth xs md={12} p={2} ml={{ xs: -2, sm: 0 }}>
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

const ProfileActions = () => {
  const { t } = useTranslation();
  const { name: username, email } = useProfileStore((state) => state.profile);

  const [usernameDialogOpen, setUsernameDialogOpen] = useState<boolean>(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);

  return (
    <List dense disablePadding component="div">
      <ListSubheader disableSticky component="div" children={t("profile.preferences")} />
      <Divider />
      <ListItemButton divider onClick={() => setUsernameDialogOpen(true)}>
        <ListItemIcon children={<BadgeOutlined />} />
        <ListItemText
          primary={t("profile.preferencesEnum.username")}
          secondary={username}
          secondaryTypographyProps={{ noWrap: true }}
          title={username}
        />
      </ListItemButton>
      <ListItemButton divider onClick={() => setEmailDialogOpen(true)}>
        <ListItemIcon children={<EmailOutlined />} />
        <ListItemText
          primary={t("profile.preferencesEnum.email")}
          secondary={email}
          secondaryTypographyProps={{ noWrap: true }}
          title={email}
        />
      </ListItemButton>
      <ListItemButton divider onClick={() => setPasswordDialogOpen(true)}>
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
      <ListItemButton
        onClick={() => {
          enqueueSnack({
            message: "Logged Out!",
            type: "success",
            enableCloseButton: true,
          });
        }}
      >
        <ListItemIcon children={<PowerSettingsNewOutlined />} />
        <ListItemText primary={"Log Out"} secondary={"Tap here to invalidate your session"} />
      </ListItemButton>
      <ChangeUsernameDialog open={usernameDialogOpen} onClose={() => setUsernameDialogOpen(false)} />
      <ChangeEmailDialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} />
      <ChangePasswordDialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} />
    </List>
  );
};

const AccountInfo = () => {
  const { t } = useTranslation();
  const { created_at, email_verified_at, status } = useProfileStore((state) => state.profile);

  const accountStatusIcon: Record<AccountStatusEnum, ReactNode> = {
    [AccountStatusEnum.CREATED]: <ErrorOutlined />,
    [AccountStatusEnum.ACTIVE]: <CheckCircleOutlined />,
    [AccountStatusEnum.BANNED]: <RemoveCircleOutlined />,
    [AccountStatusEnum.DELETED]: <HighlightOffOutlined />,
  };

  return (
    <List dense disablePadding component="div">
      <ListSubheader disableSticky component="div" children={t("profile.aboutThisProfile")} />
      <Divider />
      <ListItem>
        <ListItemIcon children={<CalendarMonthOutlined />} />
        <ListItemText primary={t("profile.detailsEnum.registrationDate")} secondary={created_at} />
      </ListItem>
      <Divider sx={{ borderColor: "transparent" }} />
      <ListItem>
        <ListItemIcon>{accountStatusIcon[status]}</ListItemIcon>
        <ListItemText
          primary={t("profile.detailsEnum.accountStatus")}
          secondary={t(`profile.accountStatusEnum.${status}`)}
        />
      </ListItem>
      <Divider sx={{ borderColor: "transparent" }} />
      <ListItem>
        <ListItemIcon>{email_verified_at ? <MarkEmailReadOutlined /> : <MarkEmailUnreadOutlined />}</ListItemIcon>
        <ListItemText
          primary={t("profile.detailsEnum.emailStatus")}
          secondary={
            email_verified_at ? t("profile.emailVerifiedEnum.verified") : t("profile.emailVerifiedEnum.unverified")
          }
        />
      </ListItem>
      <Divider sx={{ borderColor: "transparent" }} />
      <ListItem>
        <ListItemIcon>{<LibraryBooksOutlined />}</ListItemIcon>
        <ListItemText primary={t("profile.detailsEnum.librariesCount")} secondary={"0" /*todo replace with value*/} />
      </ListItem>
      <Divider sx={{ borderColor: "transparent" }} />
      <ListItem>
        <ListItemIcon>{<GridViewOutlined />}</ListItemIcon>
        <ListItemText primary={t("profile.detailsEnum.itemsTotalCount")} secondary={"0" /*todo replace with value*/} />
      </ListItem>
      <Divider sx={{ borderColor: "transparent" }} />
    </List>
  );
};
