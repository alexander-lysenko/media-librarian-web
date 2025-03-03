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
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DoneOutlined } from "../../icons";
import { PasswordInput } from "../../inputs/PasswordInput";

import type { SimpleDialogProps } from "../../../core/types";
import type { DialogProps } from "@mui/material";

/**
 * TODO: WIP
 * @param open
 * @param onClose
 * @param onSubmit
 * @constructor
 */
export const ChangePasswordDialog = ({ open, onClose, onSubmit }: SimpleDialogProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const dialogProps: DialogProps = {
    open: open,
    fullWidth: true,
    disableRestoreFocus: true,
    slots: { transition: Grow },
    slotProps: {
      transition: { timeout: 120 },
      paper: {
        component: "form",
        // onSubmit: handleSubmit(onValidSubmit, onInvalidSubmit),
      },
    },
  };

  return (
    <Dialog {...dialogProps} onClose={onClose}>
      <DialogTitle variant={"h5"}>{t("dialogs.changePasswordDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("dialogs.changePasswordDialog.subtitle")}</DialogContentText>
        <PasswordInput onChange={async () => false} onBlur={async () => false} name={""} label={"Current Password"} />
        <PasswordInput onChange={async () => false} onBlur={async () => false} name={""} label={"New Password"} />
        <PasswordInput onChange={async () => false} onBlur={async () => false} name={""} label={"Repeat Password"} />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose} children={t("common.cancel")} />
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
