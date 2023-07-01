import { BadgeOutlined, LogoutOutlined } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { stringAvatar } from "../../core";
import { AppRoutes } from "../../core/enums";
import { useProfileStore } from "../../store/useProfileStore";

/**
 * Profile Avatar and menu designed to use inside AppBar
 * TODO: implement data source, navigation links
 */
export const NavbarProfiler = () => {
  const { t } = useTranslation();
  const { name: username, email, avatar } = useProfileStore((state) => state.profile);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = () => {
    console.log("Signed Out");
  };

  return (
    <>
      <Tooltip title={t("app.openProfileMenu")}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, ml: 1 }}>
          <Avatar alt={username} src={avatar} {...stringAvatar(username)} />
        </IconButton>
      </Tooltip>
      <Menu
        PaperProps={{ sx: { width: 240 } }}
        sx={{ mt: { xs: 5, sm: 6 } }}
        id="menu-appbar"
        keepMounted
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <ListItem dense>
          <ListItemText disableTypography sx={{ my: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", lineHeight: 1.5 }} noWrap>
              {username}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: "regular" }} noWrap>
              {email}
            </Typography>
          </ListItemText>
        </ListItem>
        <Divider variant="middle" sx={{ my: 1 }} />
        <MenuItem key="toProfile" component={Link} to={AppRoutes.profile}>
          <ListItemIcon>
            <BadgeOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{t("app.profile")}</ListItemText>
        </MenuItem>
        <MenuItem key="toLogOut" onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{t("app.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
