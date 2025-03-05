import {
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppNavbar, MyLibraries, PaperCardHeader } from "../components";
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
  RemoveCircleOutlined,
  TranslateOutlined,
} from "../components/icons";
import {
  ChangeEmailDialog,
  ChangeLocaleDialog,
  ChangePasswordDialog,
  ChangeThemeDialog,
  ChangeUsernameDialog,
  LibraryCreateDialog,
} from "../components/modals";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { ProfileAvatar } from "../components/ui/ProfileAvatar";
import { AccountStatusEnum } from "../core/enums";
import { useProfileGetRequest } from "../requests/useProfileRequests";
import { useProfileDialogsStore } from "../store/app/useProfileDialogsStore";
import { useLanguageStore, useTranslationStore } from "../store/system/useTranslationStore";
import { useProfileStore } from "../store/useProfileStore";

import type { ReactNode } from "react";

/**
 * Component representing the Profile page
 */
export const Profile = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);

  const getProfileRequest = useProfileGetRequest();
  const dataFetchedRef = useRef(false);

  const [profileSectionOpen, setProfileSectionOpen] = useState(true);
  const [libSectionOpen, setLibSectionOpen] = useState(true);

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      void getProfileRequest.fetch();
    }
  }, [getProfileRequest]);

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
          {getProfileRequest.status === "SUCCESS" ? (
            <Grid container columnSpacing={2} display={profileSectionOpen ? "flex" : "none"}>
              <Grid id="profiler" size={{ xs: 12, md: 4 }} sx={{ maxWidth: { md: 320 } }}>
                <Profiler username={profile.user.name} email={profile.user.email} avatar={profile.user.avatar} />
              </Grid>
              <Grid id="preferences" size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <ProfileActions />
              </Grid>
              <Grid id="account-info" size={{ xs: 12, sm: 6, md: "grow" }}>
                <AccountInfo />
              </Grid>
            </Grid>
          ) : (
            <LoadingOverlayInner sx={{ height: 354 }} />
          )}
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
      <>
        <ChangeUsernameDialog />
        <ChangeEmailDialog />
        <ChangePasswordDialog />
        <ChangeThemeDialog />
        <ChangeLocaleDialog />
      </>
      <LibraryCreateDialog />
    </>
  );
};

const Profiler = ({ username, email, avatar }: { username: string; email: string; avatar: string }) => {
  const avatarSizes = { height: { xs: 64, sm: 128, md: 192 }, width: { xs: 64, sm: 128, md: 192 } };

  return (
    <Grid container>
      <Grid size={{ xs: "auto", md: 12 }} display="flex" justifyContent="center" alignItems="center" p={2}>
        <ProfileAvatar sx={{ ...avatarSizes }} src={avatar} username={username} />
      </Grid>
      <Grid size={{ xs: "grow", md: 12 }} p={2} ml={{ xs: -2, sm: 0 }}>
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

  const { name: username, email, locale, theme } = useProfileStore((state) => state.profile.user);
  const language = useTranslationStore().languages[locale];

  const setUsernameDialogOpen = useProfileDialogsStore((state) => state.setUsernameDialogOpen);
  const setEmailDialogOpen = useProfileDialogsStore((state) => state.setEmailDialogOpen);
  const setPasswordDialogOpen = useProfileDialogsStore((state) => state.setPasswordDialogOpen);
  const setLocaleDialogOpen = useProfileDialogsStore((state) => state.setLocaleDialogOpen);
  const setThemeDialogOpen = useProfileDialogsStore((state) => state.setThemeDialogOpen);

  return (
    <List dense disablePadding component="div">
      <ListSubheader disableSticky component="div" children={t("profile.preferences")} />
      <Divider />
      <ListItemButton divider onClick={() => setUsernameDialogOpen(true)}>
        <ListItemIcon children={<BadgeOutlined />} />
        <ListItemText
          primary={t("profile.preferencesEnum.username")}
          title={username}
          secondary={username}
          slotProps={{ secondary: { noWrap: true } }}
        />
      </ListItemButton>
      <ListItemButton divider onClick={() => setEmailDialogOpen(true)}>
        <ListItemIcon children={<EmailOutlined />} />
        <ListItemText
          primary={t("profile.preferencesEnum.email")}
          title={email}
          secondary={email}
          slotProps={{ secondary: { noWrap: true } }}
        />
      </ListItemButton>
      <ListItemButton divider onClick={() => setPasswordDialogOpen(true)}>
        <ListItemIcon children={<PasswordOutlined />} />
        <ListItemText primary={t("profile.preferencesEnum.password")} secondary={"********"} />
      </ListItemButton>
      <ListItemButton divider onClick={() => setThemeDialogOpen(true)}>
        <ListItemIcon children={<LightModeOutlined />} />
        <ListItemText primary={t("profile.preferencesEnum.theme")} secondary={t(`theme.${theme}`)} />
      </ListItemButton>
      <ListItemButton onClick={() => setLocaleDialogOpen(true)}>
        <ListItemIcon children={<TranslateOutlined />} />
        <ListItemText primary={t("profile.preferencesEnum.locale")} secondary={language} />
      </ListItemButton>
    </List>
  );
};

const AccountInfo = () => {
  const { t } = useTranslation();

  const { status, emailVerifiedAt, createdAt } = useProfileStore((state) => state.profile.stats);
  const { librariesTotal, itemsTotal } = useProfileStore((state) => state.profile.stats);
  const locale = useLanguageStore((state) => state.getLanguage());

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
        <ListItemIcon>{accountStatusIcon[status]}</ListItemIcon>
        <ListItemText
          primary={t("profile.detailsEnum.accountStatus")}
          secondary={t(`profile.accountStatusEnum.${status}`)}
        />
      </ListItem>
      <DividerTransparent />
      <ListItem>
        <ListItemIcon>{emailVerifiedAt ? <MarkEmailReadOutlined /> : <MarkEmailUnreadOutlined />}</ListItemIcon>
        <ListItemText
          primary={t("profile.detailsEnum.emailStatus")}
          secondary={t(`profile.emailVerifiedEnum.${emailVerifiedAt ? "verified" : "unverified"}`)}
        />
      </ListItem>
      <DividerTransparent />
      <ListItem>
        <ListItemIcon children={<CalendarMonthOutlined />} />
        <ListItemText
          primary={t("profile.detailsEnum.registrationDate")}
          secondary={dayjs(createdAt).locale(locale).format("LL")}
        />
      </ListItem>
      <DividerTransparent />
      <ListItem>
        <ListItemIcon>{<LibraryBooksOutlined />}</ListItemIcon>
        <ListItemText primary={t("profile.detailsEnum.librariesCount")} secondary={librariesTotal} />
      </ListItem>
      <DividerTransparent />
      <ListItem>
        <ListItemIcon>{<GridViewOutlined />}</ListItemIcon>
        <ListItemText primary={t("profile.detailsEnum.itemsTotalCount")} secondary={itemsTotal} />
      </ListItem>
      <DividerTransparent />
    </List>
  );
};

const DividerTransparent = styled(Divider)({ borderColor: "transparent" });
