import { create } from 'zustand';

import type { LibraryItem } from '../core/types';

interface LibraryItemFormState {
  open: boolean;
  isEditMode: boolean;
  selectedItem: LibraryItem | null;

  poster: string | null;
  setPoster: (poster: string | null) => void;
  showPosterForm: boolean;
  setShowPosterForm: (showPoster: boolean) => void;

  titleUniqueProcessing: boolean;
  setTitleUniqueProcessing: (value: boolean) => void;
  handleOpen: (selectedItem?: LibraryItem) => void;
  handleClose: VoidFunction;
}

export const useLibraryItemFormStore = create<LibraryItemFormState>((set) => ({
  open: false,
  isEditMode: false,
  selectedItem: null,

  poster: null,
  setPoster: (poster) => set({ poster }),
  showPosterForm: false,
  setShowPosterForm: (showPoster) => set({ showPosterForm: showPoster }),

  titleUniqueProcessing: false,
  setTitleUniqueProcessing: (value: boolean) => set({ titleUniqueProcessing: value }),
  handleOpen: (selectedItem = undefined) =>
    set({
      open: true,
      selectedItem: selectedItem ?? null,
      isEditMode: !!selectedItem,
    }),
  handleClose: () =>
    set({
      open: false,
      poster: null,
      isEditMode: false,
      showPosterForm: false,
    }),
}));
