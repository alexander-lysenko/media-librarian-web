import { Alert, Slide, Snackbar } from "@mui/material";
import { SyntheticEvent } from "react";
import { shallow } from "zustand/shallow";

import { useGlobalSnackbarStore } from "../../store/useGlobalSnackbarStore";

/**
 * Snackbar - Global Component
 * Recommended to be placed into a higher or main component.
 * The data source is powered by a store. A snackbar can be pushed from any place of code
 *  using enqueueSnack() imported from useGlobalSnackbarStore.
 * Snacks can be queued, but the components prints the only snack at once
 *
 * @see enqueueSnack
 * @see useGlobalSnackbarStore
 * @constructor
 */
export const GlobalSnackbar = () => {
  const { open, setOpen, snacks, removeSnack } = useGlobalSnackbarStore((state) => state, shallow);
  const snack = snacks[0];

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      event.preventDefault();
      return false;
    }

    setOpen(false);
    setTimeout(() => {
      removeSnack();
      // If there are snacks in queue, triggers to open them after the current one was closed.
      // The trigger is delayed to get animations worked properly
      snacks.length > 0 && setOpen(true);
    }, 200);
  };

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