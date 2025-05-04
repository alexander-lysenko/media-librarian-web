import { Alert, Box, Button, CircularProgress, Collapse, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../hooks";
import { usePasswordResetRequest } from "../../requests/authRequests";
import { AlternateEmailOutlined, LockReset } from "../icons";
import { PasswordInput } from "../inputs/PasswordInput";
import { TextInput } from "../inputs/TextInput";
import { FormDialog, type FormDialogProps } from "../ui/modals/FormDialog";

import type { PasswordResetFormData } from "../../core/types";
import type { SyntheticEvent } from "react";
import type { SubmitHandler } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: (event: SyntheticEvent | Event, reason?: string) => void;
}

/**
 * Password Reset Form Dialog
 */
export const PasswordResetDialog = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const queryParams = new URLSearchParams(location.search);
  const passwordResetRequest = usePasswordResetRequest();
  const loading = passwordResetRequest.status === "pending";

  const usePasswordResetForm = useForm<PasswordResetFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      token: queryParams.get("token") ?? undefined,
      email: queryParams.get("email") ?? undefined,
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
    onClose(event, reason);
  };

  const onValidSubmit: SubmitHandler<PasswordResetFormData> = (data, event) => {
    void passwordResetRequest.mutateAsync(data, {
      onSuccess: () => {
        handleCloseWithReset(event as SyntheticEvent);
      },
      onError: (reason) => {
        reset({ newPassword: "", repeatPassword: "" });
        setError("root.serverError", { message: reason.message });
      },
    });
  };

  const dialogProps: FormDialogProps = {
    open: open,
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleCloseWithReset,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t("passwordReset.title")}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t("passwordReset.subtitle")}</FormDialog.Subtitle>
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
      </FormDialog.Content>
      <FormDialog.Actions>
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
      </FormDialog.Actions>
    </FormDialog>
  );
};
