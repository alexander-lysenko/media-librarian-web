import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Slide,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

import { useTranslation } from "../../hooks/useTranslation";
import { AlternateEmailOutlined } from "@mui/icons-material";

type Props = {
  handleClose: () => void;
  open: boolean;
};

const SlideUp = (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => {
  // noinspection RequiredAttributes
  return <Slide direction="up" ref={ref} {...props} />;
};

export const PasswordRecoveryDialog = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} fullWidth onClose={handleClose} TransitionComponent={React.forwardRef(SlideUp)}>
      <DialogTitle sx={{ textAlign: "center" }}>{t("passwordRecovery.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>{t("passwordRecovery.subtitle")}</DialogContentText>
        <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EmailTextField = React.forwardRef((props: any, ref) => {
  return (
    <TextField
      inputRef={ref}
      fullWidth
      size="small"
      margin="normal"
      id="email"
      name="email"
      label={props.label}
      error={!!props.errorMessage}
      helperText={props.errorMessage || props.helperText}
      autoComplete="email"
      onChange={props.onChange}
      onBlur={props.onBlur}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <AlternateEmailOutlined />
          </InputAdornment>
        ),
      }}
    />
  );
});
