import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Grow,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../../core/actions";
import { useProfilePutRequest } from "../../../requests/useProfileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { useLanguageStore, useTranslationStore } from "../../../store/system/useTranslationStore";
import { useProfileStore } from "../../../store/useProfileStore";

import type { Language } from "../../../store/system/useTranslationStore";
import type { DialogProps } from "@mui/material";
import type { SyntheticEvent } from "react";

/**
 * A Simple Dialog to change locale settings (language) from Profile section
 */
export const SelectLocaleDialog = () => {
  const { t } = useTranslation();

  const languages = useTranslationStore((state) => state.languages);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const setProfile = useProfileStore((state) => state.setProfile);

  const open = useProfileDialogsStore((state) => state.localeDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setLocaleDialogOpen);

  const profileUpdateRequest = useProfilePutRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = (event: SyntheticEvent) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    setOpen(false);
  };

  const handleItemClick = (locale: Language) => {
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
        setOpen(false);
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
    <Dialog {...dialogProps} onClose={handleClose}>
      <StyledDialogTitle>{t("dialogs.changeLocaleDialog.title")}</StyledDialogTitle>
      <List>
        {Object.entries(languages).map(([key, label]) => (
          <ListItemButton key={key} disabled={loading} onClick={() => handleItemClick(key as Language)}>
            <ListItemAvatar>
              <Avatar>{key}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <StyledDialogContent>
        <Typography variant="body2">{"More languages coming soon"}</Typography>
      </StyledDialogContent>
    </Dialog>
  );
};

const StyledDialogTitle = styled(DialogTitle)({
  paddingBottom: 0,
});

const StyledDialogContent = styled(DialogContent)({
  paddingTop: 8,
});
