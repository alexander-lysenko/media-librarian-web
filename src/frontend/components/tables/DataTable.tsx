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
import { ChangeEvent, MouseEvent, MouseEventHandler } from "react";

import {
  DataTableBaseProps,
  DataTableEventsProps,
  DataTableSelectedItemState,
  DataTableSortingState,
  DataTableStyleProps,
} from "../../core/types";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";
import { LibraryItemRow } from "../library/LibraryItemRow";
import { DataTablePagination } from "./DataTablePagination";

type DataTableProps = DataTableStyleProps & { loading: boolean };

type TableContentsProps = DataTableBaseProps &
  Pick<DataTableSelectedItemState, "selectedItem"> &
  Pick<DataTableSortingState, "sort"> &
  Pick<DataTableStyleProps, "tableSx"> &
  DataTableEventsProps;

/**
 * Data Table component, displays Library items
 */
export const DataTable = (props: DataTableProps) => {
  const { loading, containerSx, tableSx } = props;

  const { columns, rows } = useLibraryTableStore((state) => state);
  const { sort, setSort, page, setPage, rowsPerPage, setRowsPerPage, selectedItem, setSelectedItem } =
    useLibraryTableStore((state) => state);

  const handleChangePage = (event: MouseEvent | null, newPage: number) => {
    event?.preventDefault();

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSorting =
    (columnId: string): MouseEventHandler =>
    (event) => {
      event.preventDefault();
      if (columnId === sort?.column) {
        const direction = sort?.direction;
        setSort && setSort({ column: columnId, direction: direction === "asc" ? "desc" : "asc" });
      } else {
        setSort && setSort({ column: columnId, direction: "asc" });
      }
    };

  const handleSelectItem =
    (rowId: string | number): MouseEventHandler =>
    (event) => {
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

const LoadingOverlay = () => {
  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress disableShrink />
    </Box>
  );
};

const TableContents = (props: TableContentsProps) => {
  const { tableSx, columns, rows, sort, selectedItem, onSort, onRowClick } = props;
  const columnsOptions = useLibraryTableStore((state) => state.columnsOptions);

  return (
    <Table stickyHeader size="small" sx={tableSx}>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => {
            const headerStyle = columnsOptions[column.type].headerCellStyle;
            return (
              <TableCell key={column.label + index} sx={{ px: 1, ...headerStyle }} sortDirection={sort?.direction}>
                <TableSortLabel
                  active={sort?.column === column.label}
                  direction={sort?.column === column.label ? sort?.direction : "asc"}
                  onClick={onSort(column.label)}
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
          <TableRow key={index} hover selected={index === selectedItem} onClick={onRowClick(index)}>
            <LibraryItemRow key={index + 1} row={row} columns={columns} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
