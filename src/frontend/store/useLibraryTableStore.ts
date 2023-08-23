import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { dataColumnPropsByType } from "../core";

import type { DataColumn, DataColumnPropsByType, DataRow } from "../core/types";

type SortDirection = "asc" | "desc";

type SortOptions = {
  column: string;
  direction: SortDirection;
};

type LibraryTableState = {
  columnOptions: DataColumnPropsByType;
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

  setColumns: (columns: DataColumn[]) => void;
  setRows: (rows: DataRow[]) => void;
};

export const useLibraryTableStore = create(
  subscribeWithSelector<LibraryTableState>((set) => ({
    columnOptions: dataColumnPropsByType,
    columns: [],
    rows: [],
    page: 0,
    rowsPerPage: -1,
    total: 0,
    sort: undefined,
    setPage: (page) => set({ page }),
    setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
    setTotal: (total: number) => set({ total }),
    setSort: (sort) => set({ sort }),
    setColumns: (columns) => set({ columns }),
    setRows: (rows) => set({ rows }),
  })),
);
