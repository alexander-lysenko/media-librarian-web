import { create } from 'zustand';

interface LibraryCreateFormState {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  titleUniqueProcessing: boolean;
  setTitleUniqueProcessing: (state: boolean) => void;
}

export const useLibraryCreateFormStore = create<LibraryCreateFormState>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false, titleUniqueProcessing: false }),
  titleUniqueProcessing: false,
  setTitleUniqueProcessing: (state) => set({ titleUniqueProcessing: state }),
}));
