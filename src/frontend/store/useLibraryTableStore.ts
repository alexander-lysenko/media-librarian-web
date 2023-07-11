import { create } from "zustand";

import { dataColumnPropsByType } from "../core/helpers/dataColumnPropsByType";
import { DataColumn, DataColumnPropsByType, DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryStore } from "./useLibraryStore";

type SortDirection = "asc" | "desc";

type SortOptions = {
  column: string;
  direction: SortDirection;
};

type LibraryTableState = {
  columnsOptions: DataColumnPropsByType;
  columns: DataColumn[];
  rows: DataRow[];

  page: number;
  rowsPerPage: number;
  total: number;
  sort: SortOptions | undefined;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setTotal: (total: number) => void;
  setSort: (sort?: SortOptions) => void;

  columnsAction: () => void;
  rowsAction: () => void;
};

const origDataRows: Omit<DataRow, "id">[] = Array.from(movies);
const dataRows: DataRow[] = [];

for (let i = 0; i < 10000; i++) {
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

const columns = Object.entries(useLibraryStore.getState().schema).map(([label, type]) => ({
  label,
  type,
}));

export const useLibraryTableStore = create<LibraryTableState>((set) => ({
  columnsOptions: dataColumnPropsByType,
  columns: columns,
  rows: dataRows,
  page: 0,
  rowsPerPage: -1,
  total: 0,
  sort: undefined,
  setPage: (page) => set({ page }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  setTotal: (total) => set({ total }),
  setSort: (sort) => set({ sort }),
  columnsAction: () => {
    console.log("columnsAction");
  },
  rowsAction: () => {
    console.log("rowsAction");
  },
}));
