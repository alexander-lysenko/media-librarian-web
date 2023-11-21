import { Alert, Slide, Snackbar } from "@mui/material";

import { useSnackbarStore } from "../../store/system/useSnackbarStore";

import type { SyntheticEvent } from "react";

/**
 * Snackbar - Global Component
 * Recommended to be placed into a higher or main component.
 * The data source is powered by a store. A snackbar can be pushed from any place of code
 *  using enqueueSnack() imported from useGlobalSnackbarStore.
 * Snacks can be queued, but the components print the only snack at once
 *
 * @see enqueueSnack
 * @see useSnackbarStore
 * @constructor
 */
export const GlobalSnackbar = () => {
  const { open, setOpen, snacks, removeSnack } = useSnackbarStore((state) => state);
  const snack = snacks[0];

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      event.preventDefault();
      return false;
    }

    setOpen(false);
    setTimeout(() => {
      removeSnack();
      // If there are snacks in the queue, triggers to open them after the current one was closed.
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
