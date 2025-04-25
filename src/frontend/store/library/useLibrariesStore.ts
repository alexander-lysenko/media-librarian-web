// noinspection IdentifierGrammar

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LibrarySchema } from "../../core/types";

interface LibraryState {
  libraries: LibrarySchema[];
  setLibraries: (libraries: LibrarySchema[]) => void;
}

interface SelectedLibraryState {
  selectedLibraryId: number;
  getSelectedLibrary: () => LibrarySchema | undefined;
  getSelectedLibraryId: () => number;
  setSelectedLibraryId: (selectedLibraryId: number) => void;
}

/**
 * Store for the list of all user's Libraries.
 */
export const useLibrariesStore = create<LibraryState>((set) => ({
  libraries: [],
  setLibraries: (libraries) => set({ libraries }),
}));

/**
 * Store for the Library that is selected.
 * Includes the payload to store/restore the ID of the selected Library using local storage
 */
export const useSelectedLibraryStore = create<SelectedLibraryState>()(
  persist(
    (set, get) => ({
      selectedLibraryId: 0,
      setSelectedLibraryId: (selectedLibraryId) => set({ selectedLibraryId }),

      getSelectedLibraryId: () => {
        const libraries = useLibrariesStore.getState().libraries;
        const storedId = get().selectedLibraryId;

        return libraries.find((item: LibrarySchema): boolean => item.id === storedId)?.id ?? libraries[0]?.id ?? 0;
      },
      getSelectedLibrary: (): LibrarySchema | undefined => {
        const libraries = useLibrariesStore.getState().libraries;
        const selectedId = get().selectedLibraryId;

        return libraries.find((item: LibrarySchema): boolean => item.id === selectedId) ?? libraries[0];
      },
    }),
    {
      name: "selectedLibrary", // unique name
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
