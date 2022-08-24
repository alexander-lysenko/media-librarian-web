import { Alert, Snackbar } from "@mui/material";
import React from "react";

type Props = {
  message: React.ReactNode;
  variant?: "success" | "info" | "warning" | "error";
  enableCloseButton?: boolean;
  autoHideDuration?: number;
};

export const useSnackbar = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      event.preventDefault();
      return false;
    }

    setOpen(false);
  };

  const snackbar = (
    <Snackbar
      open={open}
      autoHideDuration={props.autoHideDuration ?? 5000}
      onClose={handleClose}
      sx={{ minWidth: 360 }}
    >
      <Alert
        variant="filled"
        severity={props.variant}
        sx={{ width: "100%" }}
        onClose={props.enableCloseButton ?? true ? handleClose : undefined}
        children={props.message}
      />
    </Snackbar>
  );

  return {
    close: handleClose,
    open: handleClick,
    component: snackbar,
  };
};
