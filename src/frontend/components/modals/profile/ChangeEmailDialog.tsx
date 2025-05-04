import { Alert, Button, CircularProgress, Collapse } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../../core/actions";
import { useFormValidation } from "../../../hooks";
import { useProfilePatchRequest } from "../../../requests/profileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { useProfileStore } from "../../../store/useProfileStore";
import { DoneOutlined } from "../../icons";
import { EmailInput } from "../../inputs/EmailInput";
import { FormDialog, type FormDialogProps } from "../../ui/modals/FormDialog";

import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

/**
 * Profile - Dialog - Change Account's Email Address
 */
export const ChangeEmailDialog = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);
  const open = useProfileDialogsStore((state) => state.emailDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setEmailDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();
  const loading = profileUpdateRequest.status === "pending";

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

  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    void profileUpdateRequest.mutateAsync(
      { email: data.email },
      {
        onSuccess: () => {
          handleClose(event as SyntheticEvent);
          enqueueSnack({ message: t("dialogs.changeEmailDialog.success"), type: "success" });
        },
        onError: (reason) => {
          setError("root.serverError", { message: reason.message });
        },
      },
    );
  };

  const dialogProps: FormDialogProps = {
    open: open,
    maxWidth: "xs",
    fullScreen: false,
    onSubmit: handleSubmit(onValidSubmit),
    onClose: handleClose,
  };

  return (
    <FormDialog {...dialogProps}>
      <FormDialog.Title>{t("dialogs.changeEmailDialog.title")}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t("dialogs.changeEmailDialog.subtitle")}</FormDialog.Subtitle>
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
      </FormDialog.Content>
      <FormDialog.Actions>
        <Button variant="text" onClick={handleClose} children={t("common.cancel")} />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <DoneOutlined />}
          children={t("common.save")}
        />
      </FormDialog.Actions>
    </FormDialog>
  );
};
