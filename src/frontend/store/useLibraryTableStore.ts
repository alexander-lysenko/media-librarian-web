import { create } from "zustand";

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
  selectedItem: number | null;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setTotal: (total: number) => void;
  setSort: (sort?: SortOptions) => void;
  setSelectedItem: (item: number | null) => void;

  columnsAction: () => void;
  rowsAction: () => void;
};

const columnsOptions: DataColumnPropsByType = {
  line: {
    contentCellStyle: { maxWidth: 250 },
  },
  text: {
    contentCellStyle: { maxWidth: 350 },
  },
  url: {
    contentCellStyle: { maxWidth: 150 },
  },
  date: {
    headerCellStyle: { textAlign: "right", maxWidth: 150 },
    contentCellStyle: { textAlign: "right", maxWidth: 150 },
  },
  datetime: {
    headerCellStyle: { textAlign: "right", maxWidth: 200 },
    contentCellStyle: { textAlign: "right", maxWidth: 200 },
  },
  rating5: {
    contentCellStyle: { maxWidth: 150 },
  },
  rating5precision: {
    contentCellStyle: { maxWidth: 150 },
  },
  rating10: {
    contentCellStyle: { maxWidth: 250 },
  },
  rating10precision: {
    contentCellStyle: { maxWidth: 250 },
  },
  switch: {
    contentCellStyle: { maxWidth: 100 },
  },
  priority: {
    contentCellStyle: { maxWidth: 150 },
  },
};

const origDataRows: Omit<DataRow, "id">[] = Array.from(movies);
const dataRows: DataRow[] = [];

for (let i = 0; i < 100; i++) {
  origDataRows.forEach((item, index) => {
    dataRows.push({ id: index + 1 + i * origDataRows.length, ...item });
  });
}

const columns = Object.entries(useLibraryStore.getState().schema).map(([label, type]) => ({
  label,
  type,
}));

export const useLibraryTableStore = create<LibraryTableState>((set, get) => ({
  columnsOptions,
  columns: columns,
  rows: dataRows,
  page: 0,
  rowsPerPage: -1,
  total: 0,
  sort: undefined,
  selectedItem: null,
  setPage: (page) => set(() => ({ page })),
  setRowsPerPage: (rowsPerPage) => set(() => ({ rowsPerPage })),
  setTotal: (total) => set(() => ({ total })),
  setSort: (sort) => set(() => ({ sort })),
  setSelectedItem: (item) => set(() => ({ selectedItem: item })),
  columnsAction: () => {
    console.log("columnsAction");
  },
  rowsAction: () => {
    console.log("rowsAction");
  },
}));
