import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  styled,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCroppedImg } from "../../../core";
import { enqueueSnack } from "../../../core/actions";
import { useProfilePutRequest } from "../../../requests/useProfileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { useProfileStore } from "../../../store/useProfileStore";
import { CloseOutlined, CloudUploadOutlined, DoneOutlined } from "../../icons";
import { ImageCrop } from "../../ui/ImageCrop";
import { ProfileAvatar } from "../../ui/ProfileAvatar";

import type { CropParams } from "../../../core/types";
import type { DialogProps } from "@mui/material";
import type { ChangeEvent, SyntheticEvent } from "react";

/**
 * Profile - Dialog - Change Account's Avatar (Profile Image)
 */
export const UploadAvatarDialog = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const open = useProfileDialogsStore((state) => state.avatarDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setAvatarDialogOpen);

  const profileUpdateRequest = useProfilePutRequest();
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [cropMode, setCropMode] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | null>();
  const [cropOptions, setCropOptions] = useState<CropParams>();

  useEffect(() => {
    setAvatar(profile.user.avatar);
  }, [profile.user.avatar]);

  const resetAvatar = () => {
    setAvatar(profile.user.avatar);
    (hiddenFileInputRef.current as HTMLInputElement).value = "";
  };

  const handleClose = (event: SyntheticEvent) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    resetAvatar();
    setCropMode(false);
    setCropOptions(undefined);
    setOpen(false);
  };

  const handleBrowseClick = () => {
    hiddenFileInputRef.current?.click();
  };

  const handleAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result as string;
      setAvatar(result);
      setCropMode(true);
    });
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    if (avatar === profile.user.avatar) {
      handleClose(event);
      return false;
    }

    setLoading(true);
    profileUpdateRequest.setResponseEvents({
      onSuccess: (response) => {
        setProfile(response);
        enqueueSnack({ message: t("common.changesSaved"), type: "success" });
      },
      onError: (reason) => {
        enqueueSnack({ message: reason.message, type: "error" });
      },
      onComplete: () => {
        setLoading(false);
        handleClose(event);
      },
    });

    if (cropMode && cropOptions) {
      setCropMode(false);
      const image = await getCroppedImg(avatar || "", cropOptions.area, cropOptions.rotation, cropOptions.flip);

      void profileUpdateRequest.fetch({ avatar: image });
      return true;
    }

    void profileUpdateRequest.fetch({ avatar });
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
      <DialogTitle variant={"h5"}>{t("dialogs.changeAvatarDialog.title")}</DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        {!cropMode ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ProfileAvatar username={profile.user.name} src={avatar || undefined} sx={{ height: 192, width: 192 }} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ImageCrop image={avatar ?? ""} cropSize={{ width: 256, height: 256 }} onCropUpdate={setCropOptions} />
          </Box>
        )}
      </DialogContent>
      {!cropMode && (
        <BottomNavigation showLabels sx={{ background: "transparent" }}>
          <Action disabled />
          <Action
            label={t("dialogs.changeAvatarDialog.uploadPhoto")}
            icon={<CloudUploadOutlined />}
            onClick={handleBrowseClick}
          />
          <Action
            label={t("dialogs.changeAvatarDialog.removePhoto")}
            icon={<CloseOutlined />}
            onClick={() => setAvatar(null)}
          />
          <Action disabled />
        </BottomNavigation>
      )}
      <DialogActions>
        <HiddenInput type="file" ref={hiddenFileInputRef} onChange={handleAvatar} />
        <Button variant="text" onClick={handleClose} children={t("common.cancel")} />
        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
          endIcon={loading ? <CircularProgress size={14} /> : <DoneOutlined />}
          children={t("common.save")}
        />
      </DialogActions>
    </Dialog>
  );
};

const HiddenInput = styled("input")({ display: "none", visibility: "hidden" });

const Action = styled(BottomNavigationAction)(({ theme }) => ({
  "&:hover": {
    background: theme.palette.action.hover,
  },
}));
