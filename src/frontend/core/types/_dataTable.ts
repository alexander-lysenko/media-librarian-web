import type { LibraryElement } from './_library';
import type { TableBodyProps, TableContainerProps, TableHeadProps, TableProps, TableRowProps } from '@mui/material';
import type { CSSProperties, MouseEvent } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface DataRow extends Record<string, unknown> {
  id: number;
}

export interface DataColumn {
  label: string;
  type: LibraryElement;
}

export interface DataColumnStyleProps {
  headerCellStyle?: CSSProperties;
  contentCellStyle?: CSSProperties;
}

export type DataColumnPropsByType = Record<LibraryElement, DataColumnStyleProps>;

export interface SortOptions {
  column: string;
  direction: SortDirection;
}

export type RowsPerPageListOptions = (number | { label: string; value: number })[] | [];

export interface DataTableBaseProps {
  columns: DataColumn[];
  rows: DataRow[];
}

export interface DataTableSelectedItemState {
  selectedItemId?: number | null;
  setSelectedItemId?: (selectedItem: number | null) => void;
}

export interface DataTableSortingState {
  sort?: SortOptions | undefined;
  setSort?: (sort?: SortOptions) => void;
}

export interface DataTablePaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
}

export interface DataTableHeaderProps extends DataTableSortingState {
  columns: DataColumn[];
  columnOptions: DataColumnPropsByType;
}

export interface DataTableEventsProps {
  onSort: (columnId: string) => (event: MouseEvent) => void;
  onRowClick: (rowId: string | number) => (event: MouseEvent) => void;
}

export interface VirtuosoContextProps {
  tableContainer?: TableContainerProps;
  table?: TableProps;
  tableHead?: TableHeadProps;
  tableRow?: TableRowProps;
  tableBody?: TableBodyProps;
}

export type DataTableComponentProps = DataTableBaseProps & DataTableHeaderProps;

export interface DataTableVirtualizedProps extends DataTableComponentProps, DataTableSelectedItemState {
  componentProps?: VirtuosoContextProps;
}
