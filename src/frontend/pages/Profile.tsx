import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import PhotoAlbumOutlinedIcon from "@mui/icons-material/PhotoAlbumOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
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
            itemIcon={PermContactCalendarOutlinedIcon}
            // secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={profileOpen ? ArrowDropUpOutlinedIcon : ArrowDropDownOutlinedIcon}
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
            itemIcon={PhotoAlbumOutlinedIcon}
            secondaryText={"lorem ipsum dolor sit amet"}
            actionIcon={libOpen ? ArrowDropUpOutlinedIcon : ArrowDropDownOutlinedIcon}
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
        <ListItemIcon children={<EmailOutlinedIcon />} />
        <ListItemText
          primary={t("profile.preferencesEnum.email")}
          secondary={email}
          secondaryTypographyProps={{ noWrap: true }}
          title={email}
        />
      </ListItemButton>
      <ListItemButton divider>
        <ListItemIcon children={<PasswordOutlinedIcon />} />
        <ListItemText primary={t("profile.preferencesEnum.password")} secondary={"********"} />
      </ListItemButton>
      <ListItemButton divider>
        <ListItemIcon children={<LightModeOutlinedIcon />} />
        <ListItemText primary={t("profile.preferencesEnum.theme")} secondary={"Dark"} />
      </ListItemButton>
      <ListItemButton divider>
        <ListItemIcon children={<TranslateOutlinedIcon />} />
        <ListItemText primary={t("profile.preferencesEnum.locale")} secondary={"English"} />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon children={<PowerSettingsNewOutlinedIcon />} />
        <ListItemText primary={"Log Out"} secondary={"Tap here to invalidate your session"} />
      </ListItemButton>
    </List>
  );
};

const AccountInfo = () => {
  const { t } = useTranslation();
  const { created_at, email_verified_at, status } = useProfileStore((state) => state.profile);

  const accountStatusIcon: Record<AccountStatusEnum, ReactNode> = {
    [AccountStatusEnum.CREATED]: <ErrorOutlinedIcon />,
    [AccountStatusEnum.ACTIVE]: <CheckCircleOutlinedIcon />,
    [AccountStatusEnum.BANNED]: <RemoveCircleOutlinedIcon />,
    [AccountStatusEnum.DELETED]: <HighlightOffOutlinedIcon />,
  };

  return (
    <List dense disablePadding component="div">
      <ListSubheader disableSticky component="div">
        {t("profile.aboutThisProfile")}
      </ListSubheader>
      <Divider />
      <ListItem>
        <ListItemIcon children={<CalendarMonthOutlinedIcon />} />
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
        <ListItemIcon>
          {email_verified_at ? <MarkEmailReadOutlinedIcon /> : <MarkEmailUnreadOutlinedIcon />}
        </ListItemIcon>
        <ListItemText
          primary={t("profile.detailsEnum.emailStatus")}
          secondary={
            email_verified_at ? t("profile.emailVerifiedEnum.verified") : t("profile.emailVerifiedEnum.unverified")
          }
        />
      </ListItem>
      <Divider sx={{ borderColor: "transparent" }} />
      <ListItem>
        <ListItemIcon children={<DriveFileRenameOutlineOutlinedIcon />} />
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
        <ListItemIcon children={<CreateNewFolderOutlinedIcon />} />
        <ListItemText
          primary={"Создать библиотеку"}
          secondary={"&nbsp;"}
          primaryTypographyProps={{ noWrap: true, textTransform: "uppercase" }}
          secondaryTypographyProps={{ noWrap: true }}
          title={email}
        />
      </ListItemButton>
      <ListItemButton divider onClick={actions?.handleOpenItemDialog}>
        <ListItemIcon children={<AddCircleOutlinedIcon />} />
        <ListItemText
          primary={"Добавить запись"}
          secondary={"&nbsp;"}
          primaryTypographyProps={{ noWrap: true, textTransform: "uppercase" }}
          secondaryTypographyProps={{ noWrap: true }}
          title={email}
        />
      </ListItemButton>
      <ListItem divider>
        <ListItemIcon children={<CollectionsOutlinedIcon />} />
        <ListItemText primary={"Test"} secondary={"lorem ipsum"} />
        <ListItemSecondaryAction>
          <IconButton size="small" aria-label="clear">
            <CleaningServicesOutlinedIcon />
          </IconButton>
          <IconButton size="small" aria-label="delete">
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};
