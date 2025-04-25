import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogProps,
  DialogTitle,
  Grow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../core/actions";
import { useFormValidation } from "../../hooks";
import { usePasswordResetRequest } from "../../requests/authRequests";
import { AlternateEmailOutlined, LockReset } from "../icons";
import { PasswordInput } from "../inputs/PasswordInput";
import { TextInput } from "../inputs/TextInput";

import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
}

/**
 * Password Reset Dialog
 * TODO: WIP
 * @param { open, handleClose }
 * @constructor
 */
export const PasswordResetDialog = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState<boolean>(false);

  const queryParams = new URLSearchParams(location.search);
  const passwordResetRequest = usePasswordResetRequest();

  const usePasswordResetForm = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      token: queryParams.get("token"),
      email: queryParams.get("email"),
      newPassword: "",
      repeatPassword: "",
      root: "",
    },
  });

  const { registerField } = useFormValidation("passwordRecovery", usePasswordResetForm);
  const { formState, reset, handleSubmit, setError } = usePasswordResetForm;
  const { errors } = formState;

  const handleCloseWithReset = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      event.preventDefault();
      return false;
    }

    reset();
    setLoading(false);
    onClose(event, reason);
  };

  const onValidSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    setLoading(true);

    passwordResetRequest.setResponseEvents({
      onSuccess: () => {
        handleCloseWithReset(event as SyntheticEvent);
        enqueueSnack({ type: "success", message: t("passwordReset.successfullyReset") });
      },
      onError: (reason) => {
        reset({ newPassword: "", repeatPassword: "" });
        setError("root.serverError", { message: reason.message });
      },
      onComplete: () => {
        setLoading(false);
      },
    });

    await passwordResetRequest.fetch(data as never);
  };

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    fullScreen: fullScreen,
    disableRestoreFocus: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 250 },
      paper: {
        component: "form",
        onSubmit: handleSubmit(onValidSubmit),
      },
    },
  };

  return (
    <Dialog {...dialogProps} onClose={handleCloseWithReset}>
      <DialogTitle variant={"h5"}>{t("passwordReset.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ pb: 1 }}>{t("passwordReset.subtitle")}</DialogContentText>
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant="filled" severity="error" onClose={() => reset({ root: "" })} sx={{ my: 2 }}>
            {errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <TextField type={"hidden"} {...registerField("token")} sx={{ visibility: "hidden", display: "none" }} />
        <TextInput
          {...registerField("email")}
          label={t("passwordReset.email") as string}
          helperText={t("passwordReset.emailHint") as string}
          errorMessage={errors.email?.message as string}
          disabled
          icon={<AlternateEmailOutlined />}
        />
        <PasswordInput
          {...registerField("newPassword")}
          label={t("dialogs.changePasswordDialog.newPasswordLabel") as string}
          helperText={t("dialogs.changePasswordDialog.newPasswordHint") as string}
          errorMessage={errors.newPassword?.message as string}
        />
        <PasswordInput
          {...registerField("repeatPassword")}
          label={t("dialogs.changePasswordDialog.repeatPasswordLabel") as string}
          helperText={t("dialogs.changePasswordDialog.repeatPasswordHint") as string}
          errorMessage={errors.repeatPassword?.message as string}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" fullWidth={fullScreen} onClick={handleCloseWithReset}>
          {t("passwordReset.backToSignIn")}
        </Button>
        <Box sx={{ flex: "1" }}></Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth={fullScreen}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <LockReset />}
          children={t("common.save")}
        />
      </DialogActions>
    </Dialog>
  );
};
