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

import { AddCircleOutlined } from "../components/icons";
import { usePreviewDrawerStore } from "../store/app/usePreviewDrawerStore";
import { SidebarProfiler } from "./SidebarProfiler";

import type { KeyboardEvent, MouseEvent } from "react";

type Anchor = "top" | "left" | "bottom" | "right";

/**
 * @deprecated
 * @constructor
 */
export const SidebarDrawer = () => {
  const { open, setOpen } = usePreviewDrawerStore((state) => state);
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

  const anchor: Anchor = "left";

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
