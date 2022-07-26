import { SxProps } from "@mui/material";
import React from "react";

export type Anchor = "top" | "left" | "bottom" | "right";

export type SortDirection = "asc" | "desc";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type DataRow = Record<string, unknown>;

export type DataColumn = {
  id: string;
  label?: string;
  component?: (props: never) => React.ReactNode;
  headerCellSx?: SxProps;
  contentCellSx?: SxProps;
};

export type SortOptions = {
  column: string;
  direction: SortDirection;
};

export type DataTablePaginationProps = {
  page: number;
  rowsPerPage: number;
  total: number;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setTotal?: (total: number) => void;
};

export type DataTableBaseProps = {
  columns: DataColumn[];
  rows: DataRow[];

  sort: SortOptions | undefined;
  selectedItem: number | null;

  setSort?: (sort?: SortOptions) => void;
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
