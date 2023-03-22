import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TablePaginationProps,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import {
  DataTableBaseProps,
  DataTableEventsProps,
  DataTablePaginationProps,
  DataTableStyleProps,
} from "../../core/types";

type RowsPerPageOptions = Array<number | { label: string; value: number }> | [];

type DataTableProps = DataTableBaseProps &
  DataTableStyleProps &
  DataTablePaginationProps & {
    loading: boolean;
  };

type TableContentsProps = Pick<DataTableBaseProps, "columns" | "rows" | "sort" | "selectedItem"> &
  Pick<DataTableStyleProps, "tableSx"> &
  DataTableEventsProps;

type CustomTablePaginationProps = Pick<
  TablePaginationProps,
  "count" | "page" | "rowsPerPage" | "onPageChange" | "onRowsPerPageChange"
>;

const detectAvailableRowsPerPageOptions = (len: number, labelForAll?: string): RowsPerPageOptions => {
  const rPpOpts: RowsPerPageOptions = [];
  len > 10 && rPpOpts.push({ label: "10", value: 10 } as never);
  len > 25 && rPpOpts.push({ label: "25", value: 25 } as never);
  len > 50 && rPpOpts.push({ label: "50", value: 50 } as never);
  len > 100 && rPpOpts.push({ label: "100", value: 100 } as never);
  labelForAll && rPpOpts.push({ label: labelForAll, value: -1 } as never);

  return rPpOpts;
};

const LoadingOverlay = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress disableShrink />
    </Box>
  );
};

const DataTablePagination = (props: CustomTablePaginationProps) => {
  const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } = props;
  const { t } = useTranslation();

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={detectAvailableRowsPerPageOptions(count, t("common.all") as string)}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      SelectProps={{ inputProps: { sx: { py: 2 } } }}
      labelRowsPerPage={t("dataTable.rowsPerPage")}
      labelDisplayedRows={({ from, to, count, page }) =>
        t("dataTable.viewingEntries", {
          from,
          to,
          total: count !== -1 ? count : `> ${to}`,
          page: page + 1,
        })
      }
      getItemAriaLabel={(type) => type}
    />
  );
};

const TableContents = (props: TableContentsProps) => {
  const { tableSx, columns, rows, sort, selectedItem, onSort, onRowClick } = props;
  return (
    <Table stickyHeader size="small" sx={tableSx}>
      <TableHead>
        <TableRow>
          {columns.map((column) => {
            return (
              <TableCell key={column.id} sx={column.headerCellSx} sortDirection="asc">
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
        {rows.map((row, index) => {
          return (
            <TableRow
              key={index}
              hover
              selected={index === selectedItem}
              onClick={onRowClick(index)}
              children={columns.map((column) => (
                <TableCell key={column.id} sx={{ py: 0.25, px: 1, ...column.contentCellSx }}>
                  {column.component
                    ? column.component(row[column.id] as never)
                    : ((value) => (
                        <Typography variant="body2" noWrap>
                          {value}
                        </Typography>
                      ))(row[column.id] as never)}
                </TableCell>
              ))}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

/**
 * Data Table component, displays Library items
 */
export const DataTable = (props: DataTableProps) => {
  const {
    columns,
    rows,
    sort,
    page,
    rowsPerPage,
    loading,
    selectedItem,
    setSelectedItem,
    setPage,
    setRowsPerPage,
    setSort,
    containerSx,
    tableSx,
  } = props;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    event?.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          count={2000}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
