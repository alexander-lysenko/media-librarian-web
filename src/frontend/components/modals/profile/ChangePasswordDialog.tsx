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
import { useProfileChangePasswordRequest } from "../../../requests/profileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { DoneOutlined } from "../../icons";
import { PasswordInput } from "../../inputs/PasswordInput";

import type { DialogProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";

/**
 * Profile - Dialog - Change Account's Password
 */
export const ChangePasswordDialog = () => {
  const { t } = useTranslation();

  const open = useProfileDialogsStore((state) => state.passwordDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setPasswordDialogOpen);

  const changePasswordRequest = useProfileChangePasswordRequest();
  const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm<FieldValues>({ mode: "onBlur", reValidateMode: "onChange" });
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

    changePasswordRequest.setResponseEvents({
      onSuccess: () => {
        handleClose(event as SyntheticEvent);
        enqueueSnack({ message: t("dialogs.changePasswordDialog.success"), type: "success" });
      },
      onError: (reason) => {
        setError("root.serverError", { message: reason.message });
        if (reason.errors?.["password"]) {
          setError("password", { message: reason.errors?.["password"][0] });
        }
        if (reason.errors?.["newPassword"]) {
          setError("newPassword", { message: reason.errors?.["newPassword"][0] });
        }
        if (reason.errors?.["repeatPassword"]) {
          setError("repeatPassword", { message: reason.errors?.["repeatPassword"][0] });
        }
      },
      onComplete: () => {
        setLoading(false);
      },
    });

    void changePasswordRequest.fetch({
      password: data.password,
      newPassword: data.newPassword,
      repeatPassword: data.repeatPassword,
    });
  };

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    maxWidth: "xs",
    disableRestoreFocus: true,
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
      <DialogTitle variant={"h5"}>{t("dialogs.changePasswordDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("dialogs.changePasswordDialog.subtitle")}</DialogContentText>
        <Collapse in={!!formState.errors.root?.serverError} unmountOnExit>
          <Alert variant="filled" severity="error" onClose={() => clearErrors("root")} sx={{ my: 2 }}>
            {formState.errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <PasswordInput
          {...registerField("password")}
          label={t("dialogs.changePasswordDialog.passwordLabel")}
          helperText={t("dialogs.changePasswordDialog.passwordHint") as string}
          errorMessage={formState.errors.password?.message as string}
        />
        <PasswordInput
          {...registerField("newPassword")}
          label={t("dialogs.changePasswordDialog.newPasswordLabel")}
          helperText={t("dialogs.changePasswordDialog.newPasswordHint") as string}
          errorMessage={formState.errors.newPassword?.message as string}
        />
        <PasswordInput
          {...registerField("repeatPassword")}
          label={t("dialogs.changePasswordDialog.repeatPasswordLabel")}
          helperText={t("dialogs.changePasswordDialog.repeatPasswordHint") as string}
          errorMessage={formState.errors.repeatPassword?.message as string}
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
