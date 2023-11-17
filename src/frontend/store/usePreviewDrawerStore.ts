import { create } from "zustand";

interface DrawerOpenState {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItemId: number | null;
  setSelectedItemId: (selectedItem: number | null) => void;
}

export const usePreviewDrawerStore = create<DrawerOpenState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
  selectedItemId: null,
  setSelectedItemId: (selectedItemId: number | null) => set({ selectedItemId, open: !!selectedItemId }),
}));
