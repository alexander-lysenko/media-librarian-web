import dayjs from "dayjs";

import type { LibraryElement, LibraryFields, LibraryItemFormValues } from "../core/types";

export const useFormDefaultValues = (fields: LibraryFields | undefined) => {
  const defaultValues: Record<LibraryElement, () => string | number | boolean> = {
    line: () => "",
    text: () => "",
    date: () => dayjs().format("YYYY-MM-DD"),
    datetime: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),
    url: () => "",
    checkmark: () => false,
    rating5: () => 0,
    rating5precision: () => 0,
    rating10: () => 0,
    rating10precision: () => 0,
    priority: () => 0,
  };

  return Object.entries(fields || {}).reduce((acc: LibraryItemFormValues, [column, type]: [string, LibraryElement]) => {
    acc[column] = defaultValues[type]();

    return acc;
  }, {});
};
