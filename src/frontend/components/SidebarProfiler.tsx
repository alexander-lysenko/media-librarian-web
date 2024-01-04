import {
  Avatar,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { ArrowDropDownOutlined, ArrowDropUpOutlined, Badge, LogoutOutlined } from "../components/icons";
import { stringAvatar } from "../core";

import type { SxProps } from "@mui/system";
import type { MouseEventHandler } from "react";

const { sx, children } = stringAvatar("User Name");
const profileSx: SxProps = { p: 2, backgroundImage: "url(https://source.unsplash.com/7OCUyev2M9E/256x155)" };

/**
 * Part of Sidebar Navigation Drawer - Profile Section
 * @deprecated
 */
export const SidebarProfiler = () => {
  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);

  const toggleCollapse: MouseEventHandler = (event) => {
    event.preventDefault();
    setCollapseOpen(!collapseOpen);
  };

  return (
    <List sx={{ py: 0 }}>
      <ListItem key="profile" sx={profileSx}>
        <Grid container>
          <Avatar children={children} sx={{ ...sx, width: 60, height: 60 }} />
          <Grid container alignItems="flex-end" sx={{ mt: 2 }} wrap="nowrap" onClick={toggleCollapse}>
            <Grid item xs zeroMinWidth>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", lineHeight: 1.5 }} noWrap>
                User Name
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "regular" }} noWrap>
                username@example.com
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton sx={{ p: 0 }}>
                {collapseOpen ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
      <Collapse in={collapseOpen}>
        <ListItemButton key="toProfile">
          <ListItemIcon>
            <Badge />
          </ListItemIcon>
          <ListItemText disableTypography>Profile</ListItemText>
        </ListItemButton>
        <ListItemButton key="toLogOut">
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>Log Out</ListItemText>
        </ListItemButton>
        <Divider variant="middle" sx={{ pt: 1, pb: 0 }} />
      </Collapse>
    </List>
  );
};
