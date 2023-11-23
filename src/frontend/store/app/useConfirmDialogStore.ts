import { create } from "zustand";

import type { ConfirmDialogProps } from "../../core/types";

type DialogOpenState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type InitState = {
  init: (state: ConfirmDialogProps) => void;
};

export const useConfirmDialogStore = create<InitState & DialogOpenState & ConfirmDialogProps>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  type: "question",
  message: 'Click "OK" to confirm',
  onConfirm: (event) => {
    event.preventDefault();
  },
  onCancel: (event) => {
    event.preventDefault();
  },
  init: (state) => set({ ...state }),
}));
