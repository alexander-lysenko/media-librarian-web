import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Skeleton,
  SxProps,
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

import { useTranslation } from "../../hooks/useTranslation";

export type DataColumn = {
  id: string;
  label?: string;
  component?: (props: never) => React.ReactNode;
  headerCellSx?: SxProps;
  contentCellSx?: SxProps;
};

export type DataRow = Record<string, unknown>;

type RowsPerPageOptions = Array<number | { label: string; value: number }> | [];
type SortDirection = "asc" | "desc";

type SortOptions = {
  column: string;
  direction: SortDirection;
};

type TableContentsProps = {
  columns: DataColumn[];
  rows: DataRow[];
  sort: SortOptions | undefined;
  selectedItem: number | null;
  sx?: SxProps;
  onSort: (columnId: string) => (event: React.MouseEvent<unknown>) => void;
  onItemSelect: (event: React.MouseEvent<unknown>, name: string | number) => void;
};

type DataTableProps = {
  columns: DataColumn[];
  rows: DataRow[];
  onRowClick: (event: React.MouseEvent<unknown>, name: string | number) => void;
  containerSx?: SxProps;
  tableSx?: SxProps;
};

type DataTablePaginationProps = Pick<
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

const DataTablePagination = (props: DataTablePaginationProps) => {
  const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } = props;
  const { t } = useTranslation();

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={detectAvailableRowsPerPageOptions(count, t("common.all"))}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      SelectProps={{ inputProps: { sx: { py: 2 } } }}
      labelRowsPerPage={t("dataTable.rowsPerPage")}
      labelDisplayedRows={({ from, to, count }) =>
        t("dataTable.viewingEntries", { from, to, count: count !== -1 ? count : `> ${to}` })
      }
      getItemAriaLabel={(type) => type}
    />
  );
};

const TableContents = (props: TableContentsProps) => {
  const { columns, rows, sort, selectedItem, sx, onSort, onItemSelect } = props;
  return (
    <Table stickyHeader size="small" sx={sx}>
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
              onClick={(event) => {
                onItemSelect(event, index);
              }}
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
  const { columns, rows, onRowClick, containerSx, tableSx } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<number>(-1);
  const [sortDirection, setSortDirection] = React.useState<SortOptions | undefined>(undefined);

  const [page, setPage] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

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
    if (columnId === sortDirection?.column) {
      const direction = sortDirection?.direction;
      setSortDirection({ column: columnId, direction: direction === "asc" ? "desc" : "asc" });
    } else {
      setSortDirection({ column: columnId, direction: "asc" });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ ...containerSx, position: "relative" }}>
          {!loading && <LoadingOverlay />}
          <TableContents
            columns={columns}
            rows={rows}
            sort={sortDirection}
            selectedItem={selectedItem}
            onSort={handleSorting}
            onItemSelect={(event, index) => {
              setSelectedItem(index as number);
              onRowClick(event, index);
            }}
          />
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
