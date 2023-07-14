import { SxProps, TableBodyProps, TableContainerProps, TableHeadProps, TableProps, TableRowProps } from "@mui/material";
import { CSSProperties, MouseEvent } from "react";

import { LibraryElement } from "./_library";

export type SortDirection = "asc" | "desc";

export type DataRow = { id: number } & Record<string, unknown>;

export type DataColumn = {
  label: string;
  type: LibraryElement;
};

export type DataColumnStyleProps = {
  headerCellStyle?: CSSProperties;
  contentCellStyle?: CSSProperties;
};

export type DataColumnPropsByType = Record<LibraryElement, DataColumnStyleProps>;

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
  setSelectedItem?: (selectedItem: number | null) => void;
};

export type DataTableSortingState = {
  sort?: SortOptions | undefined;
  setSort?: (sort?: SortOptions) => void;
};

export type DataTablePaginationProps = {
  total: number;
  page: number;
  rowsPerPage: number;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
};

export type DataTableHeaderProps = DataTableSortingState & {
  columns: DataColumn[];
  columnOptions: DataColumnPropsByType;
};

export type DataTableStyleProps = {
  containerSx?: SxProps;
  tableSx?: SxProps;
};

export type DataTableEventsProps = {
  onSort: (columnId: string) => (event: MouseEvent) => void;
  onRowClick: (rowId: string | number) => (event: MouseEvent) => void;
};

export type VirtuosoContextProps = {
  tableContainer?: TableContainerProps;
  table?: TableProps;
  tableHead?: TableHeadProps;
  tableRow?: TableRowProps;
  tableBody?: TableBodyProps;
};

export type DataTableComponentProps = DataTableBaseProps & DataTableStyleProps & DataTableHeaderProps;

export type DataTableVirtualizedProps = DataTableComponentProps &
  DataTableSelectedItemState & {
    componentProps?: VirtuosoContextProps;
  };
