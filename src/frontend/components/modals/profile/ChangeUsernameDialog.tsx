import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../../core/actions";
import { useFormValidation } from "../../../hooks";
import { useProfilePutRequest } from "../../../requests/useProfileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { useProfileStore } from "../../../store/useProfileStore";
import { BadgeOutlined, DoneOutlined } from "../../icons";
import { TextInput } from "../../inputs/TextInput";

import type { DialogProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Profile - Dialog - Change Account's Username
 */
export const ChangeUsernameDialog = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const open = useProfileDialogsStore((state) => state.usernameDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setUsernameDialogOpen);

  const profileUpdateRequest = useProfilePutRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    values: { username: profile.user.name },
  });
  const { registerField } = useFormValidation("profile", useHookForm);
  const { formState, reset, handleSubmit } = useHookForm;

  const handleClose = (event: SyntheticEvent) => {
    event.persist();
    reset();
    setLoading(false);
    setOpen(false);
  };

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = () => {};
  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    setLoading(true);

    profileUpdateRequest.setResponseEvents({
      onSuccess: (response) => {
        setProfile(response);
        enqueueSnack({
          message: t("dialogs.changeUsernameDialog.success", { username: response.user.name }),
          type: "success",
        });
      },
      onError: (reason) => {
        enqueueSnack({ message: reason.message, type: "error" });
      },
      onComplete: () => {
        handleClose(event as SyntheticEvent);
      },
    });

    void profileUpdateRequest.fetch({ name: data.username });
  };

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    maxWidth: "xs",
    disableRestoreFocus: true,
    closeAfterTransition: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 120 },
      paper: {
        component: "form",
        onSubmit: handleSubmit(onValidSubmit, onInvalidSubmit),
      },
    },
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <DialogTitle variant={"h5"}>{t("dialogs.changeUsernameDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText mb={1}>{t("dialogs.changeUsernameDialog.subtitle")}</DialogContentText>
        <TextInput
          {...registerField("username")}
          autoFocus
          autoComplete="name"
          label={t("dialogs.changeUsernameDialog.label")}
          errorMessage={formState.errors?.username?.message as string}
          icon={<BadgeOutlined />}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose} children={t("common.cancel")} />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <DoneOutlined />}
          children={t("common.save")}
        />
      </DialogActions>
    </Dialog>
  );
};
