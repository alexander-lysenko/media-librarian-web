import { create } from 'zustand';

import type { LibraryItem } from '../core/types';

interface LibraryItemFormState {
  open: boolean;
  isEditMode: boolean;
  selectedLibraryId: number | null;
  selectedItem: LibraryItem | null;
  poster: string | null;
  setPoster: (poster: string | null) => void;
  titleUniqueProcessing: boolean;
  setTitleUniqueProcessing: (value: boolean) => void;
  handleOpen: (selectedLibraryId: number, selectedItem?: LibraryItem) => void;
  handleClose: VoidFunction;
}

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  open: false,
  isEditMode: false,
  selectedLibraryId: null,
  selectedItem: null,
  poster: null,
  setPoster: (poster) => set({ poster }),
  titleUniqueProcessing: false,
  setTitleUniqueProcessing: (value: boolean) => set({ titleUniqueProcessing: value }),
  handleOpen: (selectedLibraryId, selectedItem = undefined) =>
    set({
      open: true,
      selectedLibraryId,
      selectedItem: selectedItem ?? null,
      isEditMode: !!selectedItem,
    }),
  handleClose: () =>
    set({
      open: false,
      selectedLibraryId: null,
      poster: null,
      selectedItem: null,
      isEditMode: false,
    }),
}));
