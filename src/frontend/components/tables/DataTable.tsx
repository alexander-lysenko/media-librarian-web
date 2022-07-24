import {
  Box,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React from "react";

import { useTranslation } from "../../hooks/useTranslation";

type RowsPerPageOptions = Array<number | { label: string; value: number }> | [];
type SortDirection = "asc" | "desc";

type SortOptions = {
  column: string;
  direction: SortDirection;
};

export type DataColumn = {
  id: string;
  label?: string;
  component?: (props: never) => React.ReactNode;
  headerCellSx?: SxProps;
  contentCellSx?: SxProps;
};

export type DataRow = Record<string, unknown>;

type DataTableProps = {
  columns: DataColumn[];
  rows: DataRow[];
  onRowClick: (event: React.MouseEvent<unknown>, name: string | number) => void;
};

const detectAvailableRowsPerPageOptions = (len: number, labelForAll?: string): RowsPerPageOptions => {
  const rPpOpts: RowsPerPageOptions = [];
  len > 10 && rPpOpts.push({ label: "10", value: 10 } as never);
  len > 25 && rPpOpts.push({ label: "25", value: 25 } as never);
  len > 50 && rPpOpts.push({ label: "50", value: 50 } as never);
  len > 100 && rPpOpts.push({ label: "100", value: 100 } as never);
  labelForAll && rPpOpts.push({ label: labelForAll, value: -1 } as never);

  return rPpOpts;
};

/**
 * Data Table component, displays Library items
 */
export const DataTable = ({ columns, rows, onRowClick }: DataTableProps) => {
  const [page, setPage] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [selectedItem, setSelectedItem] = React.useState<number>(-1);
  const [sortDirection, setSortDirection] = React.useState<SortOptions | undefined>(undefined);

  const { t } = useTranslation();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    event?.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSortHandler = (columnId: string) => (event: React.MouseEvent<unknown>) => {
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
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader size="small" sx={{ minWidth: 750 }} aria-label="library table">
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  return (
                    <TableCell key={column.id} sx={column.headerCellSx} sortDirection="asc">
                      <TableSortLabel
                        active={sortDirection?.column === column.id}
                        direction={sortDirection?.column === column.id ? sortDirection?.direction : "asc"}
                        onClick={createSortHandler(column.id)}
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
                      setSelectedItem(index);
                      onRowClick(event, index);
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
        </TableContainer>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={detectAvailableRowsPerPageOptions(rows.length, t("common.all"))}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          SelectProps={{ inputProps: { sx: { py: 2 } } }}
          labelRowsPerPage={t("dataTable.rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
        />
      </Paper>
    </Box>
  );
};
