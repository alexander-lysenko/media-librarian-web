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
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { type SubmitErrorHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../core/actions";
import { useFormValidation } from "../../hooks";
import { AlternateEmailOutlined, LockOutlined, LockReset } from "../icons";

import type { InputCustomProps } from "../../core/types";
import type { TextFieldProps } from "@mui/material";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { TextInput } from "../inputs/TextInput";
import { PasswordInput } from "../inputs/PasswordInput";

type Props = {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
};

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

  const usePasswordResetForm = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      token: queryParams.get("token"),
      email: queryParams.get("email"),
      newPassword: "",
      newPasswordRepeat: "",
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

  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log(data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      handleCloseWithReset(event as SyntheticEvent);
      enqueueSnack({ type: "success", message: t("passwordReset.successfullyReset") });
    }, 2000);
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
        <DialogContentText>{t("passwordReset.subtitle")}</DialogContentText>
        <br />
        <Collapse in={!!errors.root?.serverError} unmountOnExit>
          <Alert variant="filled" severity="error" onClose={() => reset({ root: "" })} sx={{ my: 2 }}>
            {errors.root?.serverError.message as string}
          </Alert>
        </Collapse>
        <TextField type={"hidden"} {...registerField("token")} sx={{ visibility: "hidden", display: "none" }} />
        <TextInput
          {...registerField("email")}
          label={t("passwordReset.email") as string}
          errorMessage={errors.email?.message as string}
          disabled
          icon={<AlternateEmailOutlined />}
        />
        <PasswordInput
          {...registerField("newPassword")}
          label={t("passwordReset.newPassword") as string}
          errorMessage={errors.newPassword?.message as string}
        />
        <PasswordInput
          {...registerField("newPasswordRepeat")}
          label={t("passwordReset.newPasswordRepeat") as string}
          errorMessage={errors.newPasswordRepeat?.message as string}
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
