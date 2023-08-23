import { useState } from "react";

import movies from "../mock/movies.json";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { enqueueSnack } from "../store/useSnackbarStore";

import type { FetchResponseEvents } from "../core";
import type { DataRow, UseRequestReturn } from "../core/types";
import type { AxiosResponse } from "axios";

type LibraryDataResponse = {
  items: DataRow[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

// WIP
export const useLibraryItemsGetRequest = (): UseRequestReturn<void, LibraryDataResponse> => {
  const { columns, rows, total, setTotal, setRows, sort, setSort, columnOptions } = useLibraryTableStore();
  const { page, setPage, rowsPerPage, setRowsPerPage } = useLibraryTableStore();

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<LibraryDataResponse>) => {
      const { items, pagination } = response.data;
      // setLibrary(id, title, fields);
      enqueueSnack({
        type: "success",
        message: "loaded",
      });
    },
  });

  const origDataRows: Omit<DataRow, "id">[] = Array.from(movies);
  const dataRows: DataRow[] = [];
  const rowsLength = rowsPerPage > 0 ? rowsPerPage / 5 : 10000;

  for (let i = 0; i < rowsLength; i++) {
    origDataRows.forEach((item, index) => {
      dataRows.push({
        id: index + 1 + i * origDataRows.length,
        ...item,
        "Movie Title": `${index + 1 + i * origDataRows.length} ${item["Movie Title"]}`,
        "Origin Title": `${index + 1 + i * origDataRows.length} ${item["Origin Title"]}`,
        "IMDB URL": `${index + 1 + i * origDataRows.length} ${item["IMDB URL"]}`,
        Description: `${index + 1 + i * origDataRows.length} ${item["Description"]}`,
      });
    });
  }

  const libraryDataResponse: LibraryDataResponse = {
    items: dataRows,
    pagination: {
      currentPage: page,
      perPage: rowsPerPage,
      lastPage: 50000 / rowsPerPage,
      total: 50000,
    },
  };

  const status = "IDLE";
  const fetch = async (data: void): Promise<LibraryDataResponse | void> =>
    await new Promise<LibraryDataResponse>((resolve) => {
      setTimeout(() => {
        resolve(libraryDataResponse);
      }, 1000);
    }).then((response) => responseEvents.onSuccess?.(response as unknown as AxiosResponse<LibraryDataResponse>));
  const abort = () => false;

  return { status, fetch, abort, setResponseEvents };
};
