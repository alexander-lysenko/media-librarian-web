import {
  Alert,
  Button,
  CircularProgress,
  Collapse,
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
import { useProfilePutRequest } from "../../../requests/profileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { useProfileStore } from "../../../store/useProfileStore";
import { DoneOutlined } from "../../icons";
import { EmailInput } from "../../inputs/EmailInput";

import type { DialogProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Profile - Dialog - Change Account's Username
 */
export const ChangeEmailDialog = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const open = useProfileDialogsStore((state) => state.emailDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setEmailDialogOpen);

  const profileUpdateRequest = useProfilePutRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm<FieldValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    values: { email: profile.user.email },
  });
  const { registerField } = useFormValidation("profile", useHookForm);
  const { formState, reset, handleSubmit, setError, clearErrors } = useHookForm;

  const handleClose = (event: SyntheticEvent) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    reset();
    setOpen(false);
  };

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = () => {};
  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    setLoading(true);

    profileUpdateRequest.setResponseEvents({
      onSuccess: (response) => {
        setProfile(response);
        handleClose(event as SyntheticEvent);
        enqueueSnack({ message: t("dialogs.changeEmailDialog.success"), type: "success" });
      },
      onError: (reason) => {
        setLoading(false);
        setError("root.serverError", { message: reason.message });
      },
      onComplete: () => {
        setLoading(false);
      },
    });

    void profileUpdateRequest.fetch({ email: data.email });
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
      <DialogTitle variant={"h5"}>{t("dialogs.changeEmailDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText mb={1}>{t("dialogs.changeEmailDialog.subtitle")}</DialogContentText>
        <Collapse in={!!formState.errors.root?.serverError} unmountOnExit>
          <Alert variant="filled" severity="error" onClose={() => clearErrors("root")} sx={{ my: 2 }}>
            {formState.errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <EmailInput
          {...registerField("email")}
          autoFocus
          label={t("dialogs.changeEmailDialog.label")}
          errorMessage={formState.errors?.email?.message as string}
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
