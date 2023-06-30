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
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SimpleDialogProps } from "../../../core/types";
import { useFormValidation } from "../../../hooks";
import { TextInput } from "../../inputs/TextInput";

/**
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

  const handleClose = (event: SyntheticEvent<Element, Event>) => {
    reset();
    onClose(event);
  };

  const onValidSubmit = () => false;
  const onInvalidSubmit = () => false;

  return (
    <Dialog open={open} fullWidth TransitionComponent={Grow} transitionDuration={120} onClose={handleClose}>
      <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <DialogTitle variant={"h5"}>{t("dialogs.changeUsernameDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("dialogs.changeUsernameDialog.subtitle")}</DialogContentText>
          <TextInput
            {...registerField("username")}
            autoFocus
            autocomplete={"name"}
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
