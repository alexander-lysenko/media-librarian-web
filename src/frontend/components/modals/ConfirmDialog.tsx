import { CloseOutlined, DoneOutlined, NavigateNextOutlined } from "@mui/icons-material";
import {
  Button,
  Chip,
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

import { useConfirmDialogStore } from "../../store/useConfirmDialogStore";

import type { MouseEventHandler } from "react";

/**
 * Confirmation Dialog - Global Component
 * Recommended to be placed into a higher or main component.
 * Only a single instance of the component is strongly required.
 * The confirmation dialog can be opened from any place of code
 *  using confirmDialog() imported from useConfirmDialogStore.
 * This dialog supports asynchronous events onConfirm and onCancel.
 *
 * @see confirmDialog
 * @see useConfirmDialogStore
 * @constructor
 */
export const ConfirmDialog = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const { open, setOpen, message, type, subjectItem, onConfirm, onCancel } = useConfirmDialogStore();

  const handleConfirm: MouseEventHandler = async (event) => {
    setLoading(true);
    await onConfirm?.(event);
    setOpen(false);
    setLoading(false);
  };

  const handleCancel: MouseEventHandler = async (event) => {
    await onCancel?.(event);
    setOpen(false);
  };

  return (
    <Dialog open={open} keepMounted fullWidth maxWidth={"xs"} TransitionComponent={Grow} transitionDuration={120}>
      <DialogTitle variant={"h5"}>{t("confirm.title")}</DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText children={message} paragraph />
        {subjectItem && <Chip label={subjectItem} variant="outlined" icon={<NavigateNextOutlined />} />}
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="text"
          startIcon={<CloseOutlined />}
          onClick={handleCancel}
          children={t("common.cancel")}
        />
        <Button
          type="submit"
          variant="contained"
          color={type === "warning" ? "warning" : "error"}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={14} /> : <DoneOutlined />}
          onClick={handleConfirm}
          children={t("common.ok")}
        />
      </DialogActions>
    </Dialog>
  );
};
