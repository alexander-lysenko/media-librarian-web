import dayjs from "dayjs";
import { create } from "zustand";

import { LibraryElementEnum } from "../core/enums";

type LibraryElements = keyof typeof LibraryElementEnum;
type LibrarySchema = Record<string, LibraryElements>;
type DefaultValues = Record<string, string | number | boolean>;

type LibraryState = {
  schema: LibrarySchema;
  setSchema: (schema: LibrarySchema) => void;
  getInitialValues: () => DefaultValues;
};

/**
 * Store for library schema
 */
export const useLibraryStore = create<LibraryState>((set, get) => ({
  // todo: empty by default
  schema: {
    "Movie Title": "line",
    "Origin Title": "line",
    "Release Date": "date",
    Description: "text",
    "IMDB URL": "url",
    "IMDB Rating": "rating10",
    "My Rating": "rating5",
    Watched: "switch",
    "Watched At": "datetime",
    "Chance to Advice": "priority",
  },
  setSchema: (schema: LibrarySchema) => set({ schema }),
  getInitialValues: () => {
    const columns = get().schema;
    const defaultValues: Record<LibraryElements, () => string | number | boolean> = {
      line: () => "",
      text: () => "",
      url: () => "",
      switch: () => false,
      priority: () => 0,
      date: () => dayjs().format("YYYY-MM-DD"),
      datetime: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),
      rating5: () => 0,
      rating5precision: () => 0,
      rating10: () => 0,
      rating10precision: () => 0,
    };

    return Object.entries(columns).reduce((acc: DefaultValues, [column, type]: [string, LibraryElements]) => {
      acc[column] = defaultValues[type]();
      return acc;
    }, {});
  },
}));
