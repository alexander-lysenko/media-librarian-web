import { BadgeOutlined, LogoutOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
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
import React from "react";

import { stringAvatar } from "../core/helpers/stringAvatar";
import { useTranslation } from "../hooks/useTranslation";

/**
 * Profile Avatar and menu designed to use inside AppBar
 * TODO: implement data source, navigation links
 */
export const NavbarProfiler = () => {
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const username = "User Name";
  const email = "username@example.com";
  const { sx, children } = stringAvatar(username);
  const avatarSrc = "https://source.unsplash.com/random/56x56?cosplay,avatar";

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={t("app.openProfileMenu")}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={username} src={avatarSrc} sx={sx} children={children} />
        </IconButton>
      </Tooltip>
      <Menu
        PaperProps={{ sx: { width: 250 } }}
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
        <MenuItem key="toProfile">
          <ListItemIcon>
            <BadgeOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{t("app.profile")}</ListItemText>
        </MenuItem>
        <MenuItem key="toLogOut">
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{t("app.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
