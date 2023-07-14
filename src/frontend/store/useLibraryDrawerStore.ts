import { create } from "zustand";

interface DrawerOpenState {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: number | null;
  setSelectedItem: (selectedItem: number | null) => void;
}

export const useLibraryDrawerStore = create<DrawerOpenState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
  selectedItem: null,
  setSelectedItem: (selectedItem: number | null) => set({ selectedItem, open: !!selectedItem }),
}));
