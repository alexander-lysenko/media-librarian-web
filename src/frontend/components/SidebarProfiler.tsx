import { ArrowDropDownOutlined, ArrowDropUpOutlined, Badge, LogoutOutlined } from "@mui/icons-material";
import {
  Avatar,
  Collapse,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";

import { stringAvatar } from "../core/helpers/stringAvatar";

const { sx, children } = stringAvatar("User Name");
const profileSx: SxProps = { p: 2, backgroundImage: "url(https://source.unsplash.com/7OCUyev2M9E/256x155)" };

/**
 * Part of Sidebar Navigation Drawer - Profile Section
 */
export const SidebarProfiler = () => {
  const [collapseOpen, setCollapseOpen] = React.useState<boolean>(false);

  const toggleCollapse = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setCollapseOpen(!collapseOpen);
  };

  return (
    <>
      <ListItem key="profile" sx={profileSx}>
        <Grid container>
          <Avatar children={children} sx={{ ...sx, width: 60, height: 60 }}></Avatar>
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
        <ListItemButton key="l1">
          <ListItemIcon>
            <Badge />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </ListItemButton>
        <ListItemButton key="l2">
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText>Log Out</ListItemText>
        </ListItemButton>
        <Divider variant="middle" />
      </Collapse>
    </>
  );
};
