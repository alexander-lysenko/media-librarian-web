import { Avatar, Dialog, DialogTitle, Grow, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../../core/actions";
import { useProfilePutRequest } from "../../../requests/useProfileRequests";
import { useThemeStore } from "../../../store/system/useThemeStore";
import { useProfileStore } from "../../../store/useProfileStore";
import { ImageOutlined } from "../../icons";

import type { SimpleDialogProps } from "../../../core/types";
import type { DialogProps, PaletteMode } from "@mui/material";
import type { SyntheticEvent } from "react";

/**
 * A Simple Dialog to change interface settings (theme) from Profile section
 *
 * @param open
 * @param onClose
 */
export const ChangeThemeDialog = ({ open, onClose }: SimpleDialogProps) => {
  const { t } = useTranslation();

  const { setMode: setThemeMode } = useThemeStore((state) => state);
  const setProfile = useProfileStore((state) => state.setProfile);

  const profileUpdateRequest = useProfilePutRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const colors: Record<PaletteMode, { background: string; highlight: string }> = {
    light: {
      background: grey["200"],
      highlight: grey["900"],
    },
    dark: {
      background: grey["900"],
      highlight: grey["200"],
    },
  };

  const handleThemeItemClick = (event: SyntheticEvent, theme: PaletteMode) => {
    setLoading(true);
    profileUpdateRequest.setResponseEvents({
      onSuccess: (response) => {
        setThemeMode(theme);
        setProfile(response);
        enqueueSnack({ message: t("common.changesSaved"), type: "success" });
      },
      onError: (reason) => {
        enqueueSnack({ message: reason.message, type: "error" });
      },
      onComplete: () => {
        setLoading(false);
        onClose(event);
      },
    });

    void profileUpdateRequest.fetch({ theme });
  };

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    maxWidth: "xs",
    disableRestoreFocus: true,
    slots: { transition: Grow },
    slotProps: { transition: { timeout: 120 } },
  };

  return (
    <Dialog {...dialogProps} onClose={onClose}>
      <DialogTitle>{t("dialogs.changeThemeDialog.title")}</DialogTitle>
      <List>
        {Object.entries(colors).map(([key, color]) => {
          const onClick = (event: SyntheticEvent) => handleThemeItemClick(event, key as PaletteMode);

          return (
            <ListItemButton key={key} disabled={loading} onClick={onClick}>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: color.background, color: color.highlight }}>
                  <ImageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t(`theme.${key}`)} />
            </ListItemButton>
          );
        })}
      </List>
    </Dialog>
  );
};
