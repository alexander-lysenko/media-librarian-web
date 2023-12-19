import { create } from "zustand";

import type { LibraryItem } from "../core/types";

type LibraryItemFormState = {
  isOpen: boolean;
  isEditMode: boolean;
  selectedLibraryId: number | null;
  selectedItem: LibraryItem | null;
  poster: string | null;
  setPoster: (poster: string | null) => void;
  handleOpen: (selectedLibraryId: number, selectedItem?: LibraryItem) => void;
  handleClose: () => void;
};

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  isOpen: false,
  isEditMode: false,
  selectedLibraryId: null,
  selectedItem: null,
  poster: null,
  setPoster: (poster) => set({ poster }),
  handleOpen: (selectedLibraryId, selectedItem = undefined) =>
    set({
      isOpen: true,
      selectedLibraryId,
      selectedItem: selectedItem ?? null,
      isEditMode: !!selectedItem,
    }),
  handleClose: () =>
    set({
      isOpen: false,
      selectedLibraryId: null,
      poster: null,
      selectedItem: null,
      isEditMode: false,
    }),
}));
