import { DoneOutlined } from "@mui/icons-material";
import {
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

import { SimpleDialogProps } from "../../../core/types";
import { EmailInput } from "../../inputs/EmailInput";

export const ChangeEmailDialog = ({ open, onClose, onSubmit }: SimpleDialogProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Dialog open={open} fullWidth TransitionComponent={Grow} transitionDuration={120} onClose={onClose}>
      <DialogTitle variant={"h5"}>{t("dialogs.changeEmailDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText mb={1}>{t("dialogs.changeEmailDialog.subtitle")}</DialogContentText>
        <EmailInput onBlur={async () => false} name={""} label={""} onChange={async () => false} />
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
