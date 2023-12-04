import { create } from "zustand";

type LibraryItemFormState = {
  isOpen: boolean;
  isEditMode: boolean;
  selectedItemId: number | null;
  handleOpen: (selectedItemId?: number) => void;
  handleClose: () => void;
};

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  isOpen: false,
  isEditMode: false,
  selectedItemId: null,
  handleOpen: (selectedItemId = undefined) =>
    set({
      isOpen: true,
      selectedItemId: selectedItemId ?? null,
      isEditMode: !!selectedItemId,
    }),
  handleClose: () => set({ isOpen: false, selectedItemId: null, isEditMode: false }),
}));
