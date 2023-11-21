import { create } from "zustand";

type LibraryItemFormState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  close: () => void;
};

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  close: () => set({ isOpen: false }),
}));
