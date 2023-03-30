import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React, { CSSProperties, forwardRef, Fragment, ReactNode, useRef } from "react";

import {
  DataColumn,
  DataRow,
  DataTableBaseProps,
  DataTableEventsProps,
  DataTablePaginationProps,
  DataTableSelectedItemState,
  DataTableSortingState,
  DataTableStyleProps,
} from "../../core/types";
import { DataTablePagination } from "./DataTablePagination";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, FixedSizeList, ListItemKeySelector } from "react-window";
import { SxProps } from "@mui/system";
import { LoadingOverlayInner } from "../ui/LoadingOverlayInner";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { TableTypeMap } from "@mui/material/Table/Table";

type DataTableProps = DataTableBaseProps &
  DataTableStyleProps &
  DataTableSelectedItemState & {
    sorting: DataTableSortingState;
    pagination: DataTablePaginationProps;
    loading: boolean;
  };

type TableContentsProps = DataTableBaseProps &
  Pick<DataTableSelectedItemState, "selectedItem"> &
  Pick<DataTableSortingState, "sort"> &
  Pick<DataTableStyleProps, "tableSx"> &
  DataTableEventsProps;

type TableBodyProps = Omit<TableContentsProps, "tableSx" | "sort" | "onSort">;

type TableHeadRowProps = {
  columns: DataColumn[];
  sort?: DataTableSortingState["sort"];
  onSort?: DataTableEventsProps["onSort"];
};

type TableBodyRowProps = {
  row: DataRow;
  columns: DataColumn[];
  selected?: boolean | false;
  onRowClick?: (event: React.MouseEvent<unknown>) => void;
  sx?: SxProps;
  style?: CSSProperties;
};

/**
 * Data Table component, displays Library items
 * @see https://codesandbox.io/s/material-ui-react-window-virtualized-table-example-forked-uptljm?file=/ReactWindowTable/TableColumns.jsx
 * @see https://github.com/bvaughn/react-window
 */
export const DataTableWindowed = (props: DataTableProps) => {
  const { columns, rows, sorting, pagination, loading, selectedItem, setSelectedItem, containerSx, tableSx } = props;
  const { sort, setSort } = sorting;
  const { page, rowsPerPage, setPage, setRowsPerPage } = pagination;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    event?.preventDefault();

    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleSorting = (columnId: string) => (event: React.MouseEvent<unknown>) => {
    event.preventDefault();
    if (columnId === sort?.column) {
      const direction = sort?.direction;
      setSort && setSort({ column: columnId, direction: direction === "asc" ? "desc" : "asc" });
    } else {
      setSort && setSort({ column: columnId, direction: "asc" });
    }
  };
  const handleSelectItem = (rowId: string | number) => (event: React.MouseEvent<unknown>) => {
    event.preventDefault();
    setSelectedItem && setSelectedItem(selectedItem === (rowId as number) ? null : (rowId as number));
  };

  return (
    <>
      <TableContainer sx={{ ...containerSx, position: "relative" }}>
        {loading ? (
          <LoadingOverlayInner />
        ) : (
          <TableContents
            tableSx={tableSx}
            columns={columns}
            rows={rows}
            sort={sort}
            selectedItem={selectedItem}
            onSort={handleSorting}
            onRowClick={handleSelectItem}
          />
        )}
      </TableContainer>
      <DataTablePagination
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

const TableContents2 = (props: TableContentsProps) => {
  const { tableSx, columns, rows, sort, selectedItem, onSort, onRowClick } = props;

  return (
    <Table stickyHeader size="small" sx={{ height: "100%", ...tableSx }}>
      <TableHeadRow columns={columns} sort={sort} onSort={onSort} />
      <TableBodyWindowed rows={rows} columns={columns} onRowClick={onRowClick} selectedItem={selectedItem} />
    </Table>
  );
};

const TableContents = (props: TableContentsProps) => {
  const { tableSx, columns, rows, sort, selectedItem, onSort, onRowClick } = props;
  const itemKey: ListItemKeySelector<DataRow[]> = (index, data) => {
    return (data[index].id as number | undefined) || index;
  };

  const Wrapper = ({ children, ...props }: any) => {
    console.log(props);
    return (
      <Table stickyHeader size="small" sx={{ height: "100%", ...tableSx }} {...props}>
        <TableHeadRow columns={columns} sort={sort} onSort={onSort} />
        {children}
      </Table>
    );
  };

  return (
    <AutoSizer id="auto-sizer">
      {({ height, width }) => (
        <FixedSizeList
          height={height as number}
          width={width as number}
          outerElementType={Wrapper}
          innerElementType={TableBody}
          itemCount={rows.length}
          itemSize={28}
          itemKey={itemKey}
          itemData={rows}
        >
          {({ index, data, style }) => (
            <TableBodyRow
              key={index}
              row={data[index]}
              columns={columns}
              selected={index === selectedItem}
              onRowClick={onRowClick(index)}
              style={style}
            />
          )}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

const TableHeadRow = ({ columns, sort, onSort }: TableHeadRowProps) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => {
          const isSortActive = sort?.column === column.id;
          const sortDirection = sort?.column === column.id ? sort?.direction : "asc";

          return (
            <TableCell key={column.id} sx={column.headerCellSx} sortDirection={sortDirection}>
              <TableSortLabel active={isSortActive} direction={sortDirection} onClick={onSort?.(column.id)}>
                <Typography variant="subtitle2" noWrap children={column.label} />
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const TableBodyWindowed = ({ rows, columns, selectedItem, onRowClick }: TableBodyProps) => {
  const itemKey: ListItemKeySelector<DataRow[]> = (index, data) => {
    return (data[index].id as number | undefined) || index;
  };

  return (
    <TableBody>
      <AutoSizer id={"autosizer"}>
        {({ height, width }) => {
          return (
            <FixedSizeList
              height={height as number}
              width={width as number}
              itemCount={rows.length}
              itemSize={28}
              itemKey={itemKey}
              itemData={rows}
            >
              {({ index, data, style }) => (
                <TableBodyRow
                  key={index}
                  row={data[index]}
                  columns={columns}
                  selected={index === selectedItem}
                  onRowClick={onRowClick(index)}
                  sx={style}
                />
              )}
            </FixedSizeList>
          );
        }}
      </AutoSizer>
    </TableBody>
  );
};

const TableBodyRow = ({ row, columns, selected, onRowClick, sx, style }: TableBodyRowProps) => {
  return (
    <TableRow hover selected={selected} onClick={onRowClick} sx={sx} style={style} component="tr">
      {columns.map((column) => (
        <TableCell key={column.id} sx={{ py: 0.25, px: 1, ...column.contentCellSx }}>
          {column.component
            ? column.component(row[column.id] as never)
            : ((value) => <Typography variant="body2" noWrap children={value} />)(row[column.id] as never)}
        </TableCell>
      ))}
    </TableRow>
  );
};
