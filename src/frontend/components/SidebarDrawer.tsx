import { AddCircleOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import React, { KeyboardEvent, MouseEvent, useState } from "react";

import { Anchor } from "../core/types";
import { SidebarProfiler } from "./SidebarProfiler";

const anchor: Anchor = "left";

export const SidebarDrawer = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (event && event.type === "keydown") {
      if ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift") {
        return;
      }
    }

    setOpen(open);
  };

  return (
    <>
      <Button onClick={toggleDrawer(true)}>{anchor}</Button>
      <SwipeableDrawer
        anchor={anchor}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableBackdropTransition
      >
        <Box sx={{ width: 256 }} role="presentation" onKeyDown={toggleDrawer(false)}>
          <List sx={{ py: 0 }}>
            <SidebarProfiler />
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
              <ListItemText>List Item Button Example</ListItemText>
            </ListItemButton>
            <ListItem>Something goes here</ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </>
  );
};
