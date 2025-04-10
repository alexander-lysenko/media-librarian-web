import {
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppNavbar, MyLibraries, PaperCardHeader } from "../components";
import {
  AccountBox,
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
  MoreVertOutlined,
  PasswordOutlined,
  PermContactCalendarOutlined,
  PhotoAlbumOutlined,
  RemoveCircleOutlined,
  TranslateOutlined,
} from "../components/icons";
import {
  ChangeEmailDialog,
  ChangePasswordDialog,
  ChangeUsernameDialog,
  LibraryCreateDialog,
  SelectLocaleDialog,
  SelectThemeDialog,
} from "../components/modals";
import { UploadAvatarDialog } from "../components/modals/profile/UploadAvatarDialog";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { ProfileAvatar } from "../components/ui/ProfileAvatar";
import { AccountStatusEnum } from "../core/enums";
import { useProfileGetRequest } from "../requests/profileRequests";
import { useProfileDialogsStore } from "../store/app/useProfileDialogsStore";
import { useLanguageStore, useTranslationStore } from "../store/system/useTranslationStore";
import { useProfileStore } from "../store/useProfileStore";

import type { MenuProps } from "@mui/material";
import type { ReactNode, SyntheticEvent } from "react";

/**
 * Component representing the Profile page
 */
export const Profile = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);

  const getProfileRequest = useProfileGetRequest();

  const [profileSectionOpen, setProfileSectionOpen] = useState(true);
  const [libSectionOpen, setLibSectionOpen] = useState(true);

  useLayoutEffect(() => {
    void getProfileRequest.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <ProfileStats />
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
        <SelectThemeDialog />
        <SelectLocaleDialog />
        <UploadAvatarDialog />
      </>
      <LibraryCreateDialog />
    </>
  );
};

const Profiler = ({ username, email, avatar }: { username: string; email: string; avatar: string | null }) => {
  const { t } = useTranslation();
  const mobileViewport = useMediaQuery(useTheme().breakpoints.down("sm"));

  const setAvatarDialogOpen = useProfileDialogsStore((state) => state.setAvatarDialogOpen);
  const openAvatarDialog = () => setAvatarDialogOpen(true);

  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const handleMenuClick = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const avatarSizes = { height: { xs: 64, sm: 128, md: 192 }, width: { xs: 64, sm: 128, md: 192 } };
  const menuProps: MenuProps = {
    anchorEl: anchorEl,
    open: !!anchorEl,
    anchorOrigin: { vertical: "bottom", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "right" },
    slots: { transition: Fade },
    onClose: handleClose,
  };

  // noinspection CommaExpressionJS
  return (
    <Grid container>
      <AvatarGrid size={{ xs: "auto", md: 12 }}>
        <ProfileAvatar sx={{ ...avatarSizes }} src={avatar} username={username} />
      </AvatarGrid>
      <IdentityGrid container size={{ xs: "grow", md: 12 }}>
        <Grid size={{ xs: "grow", sm: 12 }}>
          <Typography variant="h5" noWrap title={username} width="100%" textAlign={{ md: "center" }}>
            {username}
          </Typography>
          <Typography variant="subtitle2" noWrap title={email} width="100%" textAlign={{ md: "center" }}>
            {email}
          </Typography>
        </Grid>
        <ButtonsGrid size="auto">
          {mobileViewport ? (
            <span>
              <IconButton size="large" onClick={handleMenuClick}>
                <MoreVertOutlined />
              </IconButton>
              <Menu {...menuProps}>
                <MenuItem dense onClick={() => (handleClose(), openAvatarDialog())}>
                  <ListItemIcon>
                    <AccountBox fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t("profile.preferencesEnum.avatar")}</ListItemText>
                </MenuItem>
              </Menu>
            </span>
          ) : (
            <Button variant="outlined" startIcon={<AccountBox />} onClick={openAvatarDialog}>
              {t("profile.preferencesEnum.avatar")}
            </Button>
          )}
        </ButtonsGrid>
      </IdentityGrid>
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

  const openUsernameDialog = () => setUsernameDialogOpen(true);
  const openEmailDialog = () => setEmailDialogOpen(true);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const openThemeDialog = () => setThemeDialogOpen(true);
  const openLocaleDialog = () => setLocaleDialogOpen(true);

  return (
    <List dense disablePadding component="div">
      <ListSubheader disableSticky component="div" children={t("profile.preferences")} />
      <Divider />
      <ListItemButton divider onClick={openUsernameDialog}>
        <ListItemIcon children={<BadgeOutlined />} />
        <ListItemText
          primary={t("profile.preferencesEnum.username")}
          title={username}
          secondary={username}
          slotProps={{ secondary: { noWrap: true } }}
        />
      </ListItemButton>
      <ListItemButton divider onClick={openEmailDialog}>
        <ListItemIcon children={<EmailOutlined />} />
        <ListItemText
          primary={t("profile.preferencesEnum.email")}
          title={email}
          secondary={email}
          slotProps={{ secondary: { noWrap: true } }}
        />
      </ListItemButton>
      <ListItemButton divider onClick={openPasswordDialog}>
        <ListItemIcon children={<PasswordOutlined />} />
        <ListItemText primary={t("profile.preferencesEnum.password")} secondary={"********"} />
      </ListItemButton>
      <ListItemButton divider onClick={openThemeDialog}>
        <ListItemIcon children={<LightModeOutlined />} />
        <ListItemText primary={t("profile.preferencesEnum.theme")} secondary={t(`theme.${theme}`)} />
      </ListItemButton>
      <ListItemButton onClick={openLocaleDialog}>
        <ListItemIcon children={<TranslateOutlined />} />
        <ListItemText primary={t("profile.preferencesEnum.locale")} secondary={language} />
      </ListItemButton>
    </List>
  );
};

const ProfileStats = () => {
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

const AvatarGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: 16,
  [theme.breakpoints.down("sm")]: {
    paddingRight: 0,
  },
}));

const IdentityGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignContent: "flex-start",
  justifyContent: "center",
  padding: 16,
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-start",
  },
}));

const ButtonsGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignContent: "flex-start",
  paddingTop: 8,
  [theme.breakpoints.down("sm")]: {
    paddingTop: 0,
  },
}));

const DividerTransparent = styled(Divider)({ borderColor: "transparent" });
