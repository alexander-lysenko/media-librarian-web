import { create } from "zustand";

interface LibraryCreateFormState {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleUniqueProcessing: boolean;
  setTitleUniqueProcessing: (state: boolean) => void;
}

export const useLibraryCreateFormStore = create<LibraryCreateFormState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  titleUniqueProcessing: false,
  setTitleUniqueProcessing: (state) => set({ titleUniqueProcessing: state }),
}));
