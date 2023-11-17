import { create } from "zustand";

type LibraryItemFormState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
