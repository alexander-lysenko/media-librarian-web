import create from "zustand";

interface DrawerOpenState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useSidebarDrawerOpenStore = create<DrawerOpenState>((set, get) => ({
  open: get()?.open || false,
  setOpen: (open: boolean) => set(() => ({ open })),
}));
