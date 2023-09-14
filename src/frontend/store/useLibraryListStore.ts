import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { LibrarySchema } from "../core/types";

type LibraryState = {
  libraries: LibrarySchema[];
  setLibraries: (libraries: LibrarySchema[]) => void;
  getSelectedLibrary: () => LibrarySchema | undefined;
  getSelectedLibraryId: () => number;
  setSelectedLibraryId: (selectedLibraryId: number) => void;
};

type SelectedLibraryState = {
  selectedLibraryId: number;
  setSelectedLibraryId: (selectedLibraryId: number) => void;
};

/**
 * Store for the list of all user's Libraries.
 * Includes the payload to store/restore the ID of selected Library using local storage
 */
export const useLibraryListStore = createWithEqualityFn<LibraryState>(
  (set, get) => ({
    libraries: [],
    setLibraries: (libraries) => set({ libraries }),
    getSelectedLibrary: (): LibrarySchema | undefined => {
      const libraries = get().libraries;
      const selectedId = get().getSelectedLibraryId();

      return libraries.find((item: LibrarySchema): boolean => item.id === selectedId) || libraries[0];
    },
    getSelectedLibraryId: () => {
      const libraries = get().libraries;
      const storedId = useSelectedLibraryStore.getState().selectedLibraryId;

      return libraries.find((item: LibrarySchema): boolean => item.id === storedId)?.id ?? libraries[0]?.id ?? 0;
    },
    setSelectedLibraryId: (selectedLibraryId) => useSelectedLibraryStore.setState({ selectedLibraryId }),
  }),
  shallow,
);

const useSelectedLibraryStore = create<SelectedLibraryState>()(
  persist(
    (set) => ({
      selectedLibraryId: 0,
      setSelectedLibraryId: (selectedLibraryId) => set({ selectedLibraryId }),
    }),
    {
      name: "selectedLibrary", // unique name
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
