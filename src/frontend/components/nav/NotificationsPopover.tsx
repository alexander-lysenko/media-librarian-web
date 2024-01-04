import { Badge, Box, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { NotificationImportantOutlined, NotificationsOutlined } from "../icons";

import type { MouseEvent } from "react";

/**
 * TODO: WIP
 * @constructor
 */
export const NotificationsPopover = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const notificationsCount = 100;

  return (
    <>
      <Tooltip arrow title={t("app.unreadNotifications", { count: notificationsCount })}>
        <IconButton size="large" color="inherit" onClick={handleOpen}>
          <Badge badgeContent={notificationsCount} color="error">
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        onClose={handleOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: { xs: 0.5, sm: 1 } }}
        keepMounted
      >
        <Box sx={{ width: { xs: "calc(100vw - 32px)", sm: 360 } }}>
          <NoNewNotifications />
        </Box>
      </Popover>
    </>
  );
};

const NoNewNotifications = () => {
  const { t } = useTranslation();

  return (
    <Box
      p={2}
      width="100%"
      height={120}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      fontSize={48}
    >
      <NotificationImportantOutlined fontSize="inherit" color="success" />
      <Typography variant="body1">{t("app.noNewNotifications")}</Typography>
    </Box>
  );
};
