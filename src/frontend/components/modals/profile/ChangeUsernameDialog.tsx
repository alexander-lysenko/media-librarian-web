import { BadgeOutlined, DoneOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SimpleDialogProps } from "../../../core/types";
import { useFormValidation } from "../../../hooks";
import { TextInput } from "../../inputs/TextInput";
import { enqueueSnack } from "../../../store/useGlobalSnackbarStore";

/**
 * TODO: WIP
 * Profile - Dialog - Change Account's Username
 * @param {boolean} open
 * @param {SyntheticEvent} onClose
 * @param {SyntheticEvent} onSubmit
 * @constructor
 */
export const ChangeUsernameDialog = ({ open, onClose, onSubmit }: SimpleDialogProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const useHookForm = useForm({ mode: "onBlur" || "onTouched", reValidateMode: "onChange" });
  const { registerField } = useFormValidation("profile", useHookForm);
  const { formState, reset, handleSubmit } = useHookForm;

  const handleClose = (event: SyntheticEvent | Event) => {
    reset();
    setLoading(false);
    onClose(event);
  };

  const onInvalidSubmit: SubmitErrorHandler<FieldValues> = (data) => console.log(data);
  const onValidSubmit: SubmitHandler<FieldValues> = (data, event) => {
    console.log("Form is valid", data);
    setLoading(true);

    setTimeout(() => {
      // Submit request
      setLoading(false);
      handleClose(event as SyntheticEvent);
      enqueueSnack({
        message: "Alright. Your name is " + data.username,
        type: "success",
        enableCloseButton: true,
      });
    }, 2000);
  };

  return (
    <Dialog open={open} disableRestoreFocus fullWidth TransitionComponent={Grow} onClose={handleClose}>
      <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <DialogTitle variant={"h5"}>{t("dialogs.changeUsernameDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText mb={1}>{t("dialogs.changeUsernameDialog.subtitle")}</DialogContentText>
          <TextInput
            {...registerField("username")}
            autoFocus
            autoComplete={"name"}
            label={t("dialogs.changeUsernameDialog.whatIsYourName")}
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
      </Box>
    </Dialog>
  );
};
