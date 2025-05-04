import { Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../../../core/actions";
import { useFormValidation } from "../../../hooks";
import { useProfilePatchRequest } from "../../../requests/profileRequests";
import { useProfileDialogsStore } from "../../../store/app/useProfileDialogsStore";
import { useProfileStore } from "../../../store/useProfileStore";
import { BadgeOutlined, DoneOutlined } from "../../icons";
import { TextInput } from "../../inputs/TextInput";
import { FormDialog } from "../../ui/modals/FormDialog";

import type { FormDialogProps } from "../../ui/modals/FormDialog";
import type { SyntheticEvent } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

/**
 * Profile - Dialog - Change Account's Username
 */
export const ChangeUsernameDialog = () => {
  const { t } = useTranslation();

  const profile = useProfileStore((state) => state.profile);

  const open = useProfileDialogsStore((state) => state.usernameDialogOpen);
  const setOpen = useProfileDialogsStore((state) => state.setUsernameDialogOpen);

  const profileUpdateRequest = useProfilePatchRequest();
  const loading = profileUpdateRequest.status === "pending";

  const useHookForm = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    values: { username: profile.user.name },
  });
  const { registerField } = useFormValidation("profile", useHookForm);
  const { formState, reset, handleSubmit } = useHookForm;

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
      { name: data.username },
      {
        onSuccess: (response) => {
          enqueueSnack({
            message: t("dialogs.changeUsernameDialog.success", { username: response.user.name }),
            type: "success",
          });
        },
        onSettled: () => {
          handleClose(event as SyntheticEvent);
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
      <FormDialog.Title>{t("dialogs.changeUsernameDialog.title")}</FormDialog.Title>
      <FormDialog.Content>
        <FormDialog.Subtitle>{t("dialogs.changeUsernameDialog.subtitle")}</FormDialog.Subtitle>
        <TextInput
          {...registerField("username")}
          autoFocus
          autoComplete="name"
          label={t("dialogs.changeUsernameDialog.label")}
          errorMessage={formState.errors?.username?.message as string}
          icon={<BadgeOutlined />}
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
