import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

type SnackbarOptions = {
  enableCloseButton?: boolean;
  autoHideDuration?: number;
};

/**
 * React custom hook for customizable snackbar, a.k.a toast popup.
 * Designed to be used within a component. TODO: Make hook called globally (inter-components)
 *
 * @param {SnackbarOptions} props
 */
export const useSnackbar = (props: SnackbarOptions) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [style, setStyle] = React.useState<AlertColor>("success");
  const [message, setMessage] = React.useState<React.ReactNode>("");

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      event.preventDefault();
      return false;
    }

    setOpen(false);
  };

  const handleShow = (type: AlertColor, message: React.ReactNode) => {
    setStyle(type);
    setMessage(message);
    setOpen(true);
  };

  const render = () => (
    <Snackbar
      open={open}
      autoHideDuration={props.autoHideDuration ?? 5000}
      onClose={handleClose}
      sx={{ minWidth: 360 }}
    >
      <Alert
        variant="filled"
        severity={style}
        sx={{ width: "100%" }}
        onClose={props.enableCloseButton ?? true ? handleClose : undefined}
        children={message}
      />
    </Snackbar>
  );

  return {
    close: handleClose,
    show: handleShow,
    render,
  };
};
