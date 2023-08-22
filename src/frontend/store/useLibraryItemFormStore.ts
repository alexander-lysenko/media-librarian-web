import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type LibraryItemFormState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useLibraryItemFormStore = createWithEqualityFn<LibraryItemFormState>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow,
);
