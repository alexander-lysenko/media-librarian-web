import { CloseOutlined, DoneOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 *
 * @constructor
 */
export const ConfirmDialog = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Dialog open={false} fullWidth maxWidth={"xs"} TransitionComponent={Grow} transitionDuration={120}>
      <DialogTitle variant={"h5"}>{t("confirm.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("confirm.deleteItem")}</DialogContentText>
        <DialogContentText>{t("confirm.cannotBeUndone")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="text" onClick={() => false} startIcon={<CloseOutlined />}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" variant="contained" color="error" endIcon={<DoneOutlined />}>
          {t("common.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
