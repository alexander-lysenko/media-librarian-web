import {
  AddCircleOutlined,
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlined,
  CleaningServicesOutlined,
  CollectionsOutlined,
  CreateNewFolderOutlined,
  DeleteForeverOutlined,
  DriveFileRenameOutlineOutlined,
  EmailOutlined,
  ErrorOutlined,
  HighlightOffOutlined,
  LightModeOutlined,
  MarkEmailReadOutlined,
  MarkEmailUnreadOutlined,
  PasswordOutlined,
  PermContactCalendarOutlined,
  PhotoAlbumOutlined,
  PowerSettingsNewOutlined,
  RemoveCircleOutlined,
  SvgIconComponent,
  TranslateOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { AppNavbar, PaperCardHeader } from "../components";
import { ColoredRating } from "../components/library/ColoredRating";
import { LibraryCreateDialog } from "../components/modals/LibraryCreateDialog";
import { LibraryItemDialog } from "../components/modals/LibraryItemDialog";
import { SimpleDialog } from "../components/modals/SimpleDialog";
import { stringAvatar } from "../core";
import { AccountStatusEnum } from "../core/types";
import { useProfileStore } from "../store/useProfileStore";

type LibraryActions = {
  actions: Record<string, () => void>;
};

/**
 * Component representing the Profile page
 */
export const Profile = () => {
  const { t } = useTranslation();

  const [profileOpen, setProfileOpen] = useState(true);
  const [libOpen, setLibOpen] = useState(true);
  const [libCreateDialogOpen, setLibCreateDialogOpen] = useState(false);
  const [libAddItemDialogOpen, setLibAddItemDialogOpen] = useState(false);

  const [profile, request] = useProfileStore((state) => [state.profile, state.getRequest], shallow);
  const { name, email, avatar } = profile;

  useEffect(() => {
    return () => {
      request();
    };
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
            actionIcon={profileOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined}
            actionEvents={{ onClick: () => setProfileOpen(!profileOpen) }}
          />
          <Grid container display={profileOpen ? "flex" : "none"}>
            <Grid item id="profiler" xs={12} md={4} sx={{ maxWidth: { md: 320 } }}>
              <Profiler username={name} email={email} avatar={avatar} />
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
            title={t("profile.myLibraries")}
            itemIcon={PhotoAlbumOutlined}
            secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={libOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined}
            actionEvents={{ onClick: () => setLibOpen(!libOpen) }}
          />
          <Box display={libOpen ? "block" : "none"}>
            <LibrariesList
              actions={{
                handleOpenLibraryDialog: () => setLibCreateDialogOpen(true),
                handleOpenItemDialog: () => setLibAddItemDialogOpen(true),
              }}
            />
          </Box>
        </Paper>
      </Container>
      <SimpleDialog />
      <LibraryCreateDialog
        open={libCreateDialogOpen}
        handleClose={() => setLibCreateDialogOpen(false)}
        handleSubmitted={() => false}
      />
      <LibraryItemDialog
        open={libAddItemDialogOpen}
        handleClose={() => setLibAddItemDialogOpen(false)}
        handleSubmitted={() => false}
      />
      <ColoredRating value={4.5} size={10} precision={0.5} />
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
  const { email } = useProfileStore((state) => state.profile);

  return (
    <List dense disablePadding component="div">
      <ListSubheader disableSticky component="div">
        {t("profile.preferences")}
      </ListSubheader>
      <Divider />
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
      <ListSubheader disableSticky component="div">
        {t("profile.aboutThisProfile")}
      </ListSubheader>
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
        <ListItemIcon children={<DriveFileRenameOutlineOutlined />} />
        <ListItemText primary={"About me"} secondary={"Lorem Ipsum is simply dummy text of the..."} />
      </ListItem>
    </List>
  );
};

const LibrariesList = ({ actions }: LibraryActions) => {
  const { t } = useTranslation();
  const { email } = useProfileStore((state) => state.profile);

  return (
    <List dense disablePadding component="div">
      <ListItemButton divider onClick={actions?.handleOpenLibraryDialog}>
        <ListItemIcon children={<CreateNewFolderOutlined />} />
        <ListItemText
          primary={"Создать библиотеку"}
          secondary={"&nbsp;"}
          primaryTypographyProps={{ noWrap: true, textTransform: "uppercase" }}
          secondaryTypographyProps={{ noWrap: true }}
          title={email}
        />
      </ListItemButton>
      <ListItemButton divider onClick={actions?.handleOpenItemDialog}>
        <ListItemIcon children={<AddCircleOutlined />} />
        <ListItemText
          primary={"Добавить запись"}
          secondary={"&nbsp;"}
          primaryTypographyProps={{ noWrap: true, textTransform: "uppercase" }}
          secondaryTypographyProps={{ noWrap: true }}
          title={email}
        />
      </ListItemButton>
      <ListItem divider>
        <ListItemIcon children={<CollectionsOutlined />} />
        <ListItemText primary={"Test"} secondary={"lorem ipsum"} />
        <ListItemSecondaryAction>
          <IconButton size="small" aria-label="clear">
            <CleaningServicesOutlined />
          </IconButton>
          <IconButton size="small" aria-label="delete">
            <DeleteForeverOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};
