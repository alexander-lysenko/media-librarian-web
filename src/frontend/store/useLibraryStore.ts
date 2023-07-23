import dayjs from "dayjs";
import { create } from "zustand";

import { FormDefaultValues, LibraryElement, LibraryFields } from "../core/types";

type LibraryState = {
  id?: number;
  title: string;
  fields: LibraryFields;
  setLibrary: (id: number, name: string, schema: LibraryFields) => void;
  getInitialValues: () => FormDefaultValues;
};

/**
 * Store for library schema
 */
export const useLibraryStore = create<LibraryState>((set, get) => ({
  id: undefined,
  title: "",
  fields: {},
  setLibrary: (id, title, fields) => set({ id, title, fields }),
  getInitialValues: () => {
    const columns = get().fields;
    const defaultValues: Record<LibraryElement, () => string | number | boolean> = {
      line: () => "",
      text: () => "",
      url: () => "",
      checkmark: () => false,
      priority: () => 0,
      date: () => dayjs().format("YYYY-MM-DD"),
      datetime: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),
      rating5: () => 0,
      rating5precision: () => 0,
      rating10: () => 0,
      rating10precision: () => 0,
    };

    return Object.entries(columns).reduce((acc: FormDefaultValues, [column, type]: [string, LibraryElement]) => {
      acc[column] = defaultValues[type]();
      return acc;
    }, {});
  },
}));
