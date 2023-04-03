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
import React from "react";

import {
  DataTableBaseProps,
  DataTableEventsProps,
  DataTablePaginationProps,
  DataTableSelectedItemState,
  DataTableSortingState,
  DataTableStyleProps,
} from "../../core/types";
import { DataTablePagination } from "./DataTablePagination";
import { LibraryInlineComponents } from "../library/InlineComponents";

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

const LoadingOverlay = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress disableShrink />
    </Box>
  );
};

const TableContents = (props: TableContentsProps) => {
  const { tableSx, columns, rows, sort, selectedItem, onSort, onRowClick } = props;

  return (
    <Table stickyHeader size="small" sx={tableSx}>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => {
            return (
              <TableCell key={column.id + index} sx={{ px: 1, ...column.headerCellStyle }} sortDirection="asc">
                <TableSortLabel
                  active={sort?.column === column.id}
                  direction={sort?.column === column.id ? sort?.direction : "asc"}
                  onClick={onSort(column.id)}
                  children={
                    <Typography variant="subtitle2" noWrap>
                      {column.label}
                    </Typography>
                  }
                />
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={index}
            hover
            selected={index === selectedItem}
            onClick={onRowClick(index)}
            children={columns.map((column, index) => {
              const LibraryComponent = LibraryInlineComponents[column.component];
              return (
                <TableCell key={column.id + index} sx={{ py: 0.25, px: 1, ...column.contentCellStyle }}>
                  <LibraryComponent value={row[column.id] as never} truncate />
                </TableCell>
              );
            })}
          />
        ))}
      </TableBody>
    </Table>
  );
};

/**
 * Data Table component, displays Library items
 */
export const DataTable = (props: DataTableProps) => {
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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ ...containerSx, position: "relative" }}>
          {loading ? (
            <LoadingOverlay />
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
      </Paper>
    </Box>
  );
};
