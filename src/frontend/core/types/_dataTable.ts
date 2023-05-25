import { SxProps } from "@mui/material";
import React from "react";

import { LibraryElementEnum } from "../enums";

export type SortDirection = "asc" | "desc";

export type DataRow = Record<string, unknown>;
export type DataRowNew = { id: string } & Record<string, unknown>;

export type DataColumn = {
  id: string;
  label?: string;
  component: keyof typeof LibraryElementEnum;
  headerCellStyle?: React.CSSProperties;
  contentCellStyle?: React.CSSProperties;
};

export type SortOptions = {
  column: string;
  direction: SortDirection;
};

export type DataTableBaseProps = {
  columns: DataColumn[];
  rows: DataRow[];
};

export type DataTableSelectedItemState = {
  selectedItem?: number | null;
  setSelectedItem?: (item: number | null) => void;
};

export type DataTableSortingState = {
  sort?: SortOptions | undefined;
  setSort?: (sort?: SortOptions) => void;
};

export type DataTablePaginationProps = {
  page: number;
  rowsPerPage: number;
  total: number;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setTotal?: (total: number) => void;
};

export type DataTableHeaderProps = DataTableSortingState & {
  columns: DataColumn[];
};

export type DataTableContentsProps = {
  columns: DataColumn[];
  row: DataRow;
  selectedItem: number | null;
  setSelectedItem?: (item: number | null) => void;
};

export type DataTableStyleProps = {
  containerSx?: SxProps;
  tableSx?: SxProps;
};

export type DataTableEventsProps = {
  onSort: (columnId: string) => (event: React.MouseEvent<unknown>) => void;
  onRowClick: (rowId: string | number) => (event: React.MouseEvent<unknown>) => void;
};
