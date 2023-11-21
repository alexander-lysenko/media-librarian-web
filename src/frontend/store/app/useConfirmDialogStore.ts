import { create } from "zustand";

import type { MouseEventHandler, ReactNode } from "react";

type ConfirmDialogProps = {
  message: ReactNode;
  onConfirm: MouseEventHandler | VoidFunction | undefined;
  onCancel?: MouseEventHandler | VoidFunction;
  subjectItem?: string;
  type?: "question" | "warning";
};

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

export const confirmDialog = (props: ConfirmDialogProps) => useConfirmDialogStore.setState({ ...props, open: true });
