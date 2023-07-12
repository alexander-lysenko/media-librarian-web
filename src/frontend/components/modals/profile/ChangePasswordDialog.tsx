import { DoneOutlined } from "@mui/icons-material";
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

import { SimpleDialogProps } from "../../../core/types";
import { PasswordInput } from "../../inputs/PasswordInput";

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

  return (
    <Dialog open={open} fullWidth TransitionComponent={Grow} transitionDuration={120} onClose={onClose}>
      <Box component="form" noValidate onSubmit={() => false}>
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
      </Box>
    </Dialog>
  );
};
