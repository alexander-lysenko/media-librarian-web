import { create } from "zustand";

type LibraryItemFormState = {
  isOpen: boolean;
  isEditMode: boolean;
  handleOpen: (isEditMode?: boolean) => void;
  handleClose: () => void;
};

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  isOpen: false,
  isEditMode: false,
  handleOpen: (isEditMode = false) => set({ isOpen: true, isEditMode }),
  handleClose: () => set({ isOpen: false }),
}));
