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

  setColumns: (columns: DataColumn[]) => void;
  setRows: (rows: DataRow[]) => void;

  setTotal: (total: number) => void;
  setSort: (sort?: SortOptions) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  applyRowsPerPage: (rowsPerPage: number) => void;
  setPagination: (page: number, rowsPerPage: number, total: number) => void;
};

export const useLibraryTableStore = create(
  subscribeWithSelector<LibraryTableState>((set) => ({
    columnOptions: dataColumnPropsByType,
    columns: [],
    rows: [],
    page: 0,
    rowsPerPage: 50,
    total: 0,
    sort: undefined,
    setColumns: (columns: DataColumn[]) => set({ columns }),
    setRows: (rows: DataRow[]) => set({ rows }),
    setTotal: (total: number) => set({ total }),
    setSort: (sort: SortOptions | undefined) => set({ sort }),
    setPage: (page: number) => set({ page }),
    setRowsPerPage: (rowsPerPage: number) => set({ rowsPerPage }),
    applyRowsPerPage: (rowsPerPage: number) => set({ rowsPerPage, page: 0 }),
    setPagination: (page: number, rowsPerPage: number, total: number) => set({ page, rowsPerPage, total }),
  })),
);
