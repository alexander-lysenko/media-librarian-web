import { Avatar, Dialog, DialogTitle, Grow, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../../core/actions";
import { useProfilePutRequest } from "../../../requests/useProfileRequests";
import { useLanguageStore, useTranslationStore } from "../../../store/system/useTranslationStore";
import { useProfileStore } from "../../../store/useProfileStore";

import type { SimpleDialogProps } from "../../../core/types";
import type { Language } from "../../../store/system/useTranslationStore";
import type { DialogProps } from "@mui/material";
import type { SyntheticEvent } from "react";

/**
 * A Simple Dialog to change locale settings (language) from Profile section
 *
 * @param open
 * @param onClose
 */
export const ChangeLocaleDialog = ({ open, onClose }: SimpleDialogProps) => {
  const { t } = useTranslation();
  const languages = useTranslationStore((state) => state.languages);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const setProfile = useProfileStore((state) => state.setProfile);

  const profileUpdateRequest = useProfilePutRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLocaleItemClick = (event: SyntheticEvent, locale: Language) => {
    setLoading(true);
    profileUpdateRequest.setResponseEvents({
      onSuccess: (response) => {
        setLanguage(locale);
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

    void profileUpdateRequest.fetch({ locale });
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
      <DialogTitle>{t("dialogs.changeLocaleDialog.title")}</DialogTitle>
      <List>
        {Object.entries(languages).map(([key, label]) => {
          const onClick = (event: SyntheticEvent) => {
            return handleLocaleItemClick(event, key as Language);
          };

          return (
            <ListItemButton key={key} disabled={loading} onClick={onClick}>
              <ListItemAvatar>
                <Avatar>{key}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
    </Dialog>
  );
};
