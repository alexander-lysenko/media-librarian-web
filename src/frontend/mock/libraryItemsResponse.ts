import { useLibraryTableStore } from "../store/library/useLibraryTableStore";
import movies from "./movies.json";

import type { DataRow, GetLibraryItemsResponse } from "../core/types";

export const getFakeLibraryItems = (): GetLibraryItemsResponse => {
  const { page, rowsPerPage, total } = useLibraryTableStore.getState();

  const origDataRows: Omit<DataRow, "id">[] = Array.from(movies);
  const dataRows: DataRow[] = [];

  const startItem = page * (rowsPerPage > 0 ? rowsPerPage : total);
  const endItem = startItem + (rowsPerPage > 0 ? rowsPerPage : total);

  for (let i = startItem; i < endItem; i += origDataRows.length) {
    origDataRows.forEach((item, index) => {
      const id = i + index + 1;
      dataRows.push({
        id,
        ...item,
        "Movie Title": `${id} ${item["Movie Title"]}`,
        "Origin Title": `${id} ${item["Origin Title"]}`,
        "IMDB URL": `${id} ${item["IMDB URL"]}`,
        Description: `${id} ${item["Description"]}`,
      });
    });
  }

  return {
    items: dataRows,
    pagination: {
      currentPage: page,
      perPage: rowsPerPage,
      lastPage: 50000 / rowsPerPage,
      total: 50000,
    },
  };
};
