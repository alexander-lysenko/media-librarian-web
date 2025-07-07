// noinspection IdentifierGrammar

import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';

import type { LibrarySchema } from '../../core/types';

interface LibraryState {
  libraries: LibrarySchema[];
  setLibraries: (libraries: LibrarySchema[]) => void;
  appendLibrary: (library: LibrarySchema) => void;
}

interface SelectedLibraryState {
  selectedLibraryId: number;
  setSelectedLibraryId: (selectedLibraryId: number) => void;

  getSelectedLibrary: () => LibrarySchema | undefined;
}

/**
 * Store for the list of all user's Libraries.
 */
export const useLibrariesStore = create<LibraryState>((set) => ({
  libraries: [],
  setLibraries: (libraries) => set({ libraries }),
  appendLibrary: (library) =>
    set((state) => {
      return { libraries: [...state.libraries, library] };
    }),
}));

/**
 * Store for the Library that is selected.
 * Includes the payload to store/restore the ID of the selected Library using local storage
 */
export const useSelectedLibraryStore = create<SelectedLibraryState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        selectedLibraryId: 0,
        setSelectedLibraryId: (selectedLibraryId) => {
          set({ selectedLibraryId });
        },

        getSelectedLibrary: (): LibrarySchema | undefined => {
          const libraries = useLibrariesStore.getState().libraries;
          const selectedId = get().selectedLibraryId;

          if (libraries.length === 0) return undefined;

          const library = libraries.find((item: LibrarySchema): boolean => item.id === selectedId) ?? libraries[0];
          if (libraries.length && !!selectedId && library.id !== selectedId) {
            // eslint-disable-next-line no-console
            console.warn('Previously selected library was not found, so the first one has been selected.');

            // set({ selectedLibraryId: library.id });
          }

          return library;
        },
      }),
      {
        name: 'selectedLibrary', // unique name
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
