import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { AlertColor } from "@mui/material";
import type { ReactNode } from "react";

type SnackOptions = {
  message: ReactNode;
  type: AlertColor;
  enableCloseButton?: boolean;
};

type SnackbarStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  snacks: SnackOptions[];
  enqueueSnack: (snackOptions: SnackOptions) => void;
  removeSnack: () => void;
  clear: () => void;
};

/**
 * Store for queued snack notifications
 */
export const useSnackbarStore = createWithEqualityFn<SnackbarStore>(
  (set, get) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
    snacks: [],
    enqueueSnack: (snackOptions) => {
      const snacks = get().snacks;
      snacks.push(snackOptions);
      set({ snacks: snacks, open: true });
    },
    removeSnack: () => {
      const alerts = get().snacks;
      alerts.shift();
      set({ snacks: alerts });
    },
    clear: () => set({ snacks: [], open: false }),
  }),
  shallow,
);

/**
 * A shortcut to push a snack notification from everywhere in the code
 */
export const enqueueSnack = useSnackbarStore.getState().enqueueSnack;
