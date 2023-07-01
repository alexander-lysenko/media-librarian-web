import { Alert, Slide, Snackbar } from "@mui/material";
import { SyntheticEvent } from "react";
import { shallow } from "zustand/shallow";

import { useGlobalSnackbarStore } from "../../store/useGlobalSnackbarStore";

export const GlobalSnackbar = () => {
  const { open, setOpen, snacks, removeSnack } = useGlobalSnackbarStore((state) => state, shallow);

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      event.preventDefault();
      return false;
    }

    setOpen(false);
    setTimeout(() => {
      removeSnack();
      snacks.length > 0 && setOpen(true);
    }, 200);
  };

  const snack = snacks[0];

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      TransitionComponent={Slide}
      transitionDuration={200}
      onClose={handleClose}
      sx={{ minWidth: 360 }}
      children={
        <Alert
          variant="filled"
          severity={snack?.type}
          sx={{ width: "100%" }}
          onClose={snack?.enableCloseButton ?? true ? handleClose : undefined}
          children={snack?.message}
        />
      }
    />
  );
};
