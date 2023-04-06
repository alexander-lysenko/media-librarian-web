import { create } from "zustand";

interface LibraryCreateFormState {
  titleUniqueProcessing: boolean;
  setTitleUniqueProcessing: (state: boolean) => void;
}

export const useLibraryCreateFormStore = create<LibraryCreateFormState>((set) => ({
  titleUniqueProcessing: false,
  setTitleUniqueProcessing: (state) => set({ titleUniqueProcessing: state }),
}));
