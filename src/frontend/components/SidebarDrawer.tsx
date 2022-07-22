import { AddCircleOutlined } from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { KeyboardEvent, MouseEvent } from "react";

import { Anchor } from "../core/types";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";
import { SidebarProfiler } from "./SidebarProfiler";

const anchor: Anchor = "left";

export const SidebarDrawer = () => {
  const { open, setOpen } = useSidebarDrawerOpenStore((state) => state);
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up("md"));

  const toggleDrawer = (isOpen: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (event && event.type === "keydown") {
      if ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift") {
        return;
      }
    }

    setOpen(isOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 256 }} role="presentation" onKeyDown={toggleDrawer(false)}>
      <SidebarProfiler />
      <List>
        <ListItem>
          <ListItemIcon>
            <AddCircleOutlined />
          </ListItemIcon>
          <ListItemText>List Item Example</ListItemText>
        </ListItem>
        <ListItemButton>
          <ListItemIcon>
            <AddCircleOutlined />
          </ListItemIcon>
          <ListItemText disableTypography sx={{}}>
            List Item Button Example
          </ListItemText>
        </ListItemButton>
        <ListItem>Something goes here</ListItem>
      </List>
    </Box>
  );

  return isLargeViewport ? (
    <Drawer variant="persistent" open={open}>
      {drawerContent}
    </Drawer>
  ) : (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      disableBackdropTransition
    >
      {drawerContent}
    </SwipeableDrawer>
  );
};
