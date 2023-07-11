import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { MouseEventHandler, useState } from "react";

import { DataTableComponentProps, DataTableEventsProps } from "../../core/types";
import { LibraryItemRow } from "./LibraryItemRow";

type TableContentsProps = Omit<DataTableComponentProps, "loading"> &
  DataTableEventsProps & {
    selectedItem: number | null;
  };

/**
 * Data Table component, displays Library items
 */
export const DataTable = (props: DataTableComponentProps) => {
  const { loading, containerSx, tableSx } = props;
  const { rows, columns, columnsOptions, sort, setSort } = props;

  const [selectedItem, setSelectedItem] = useState<number | null>(null);

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
      setSelectedItem(selectedItem === (rowId as number) ? null : (rowId as number));
    };

  return (
    <TableContainer sx={{ ...containerSx, position: "relative" }}>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <TableContents
          tableSx={tableSx}
          columns={columns}
          rows={rows}
          columnsOptions={columnsOptions}
          sort={sort}
          selectedItem={selectedItem}
          onSort={handleSorting}
          onRowClick={handleSelectItem}
        />
      )}
    </TableContainer>
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
  const { tableSx, columns, columnsOptions, rows, sort, selectedItem, onSort, onRowClick } = props;

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
            <LibraryItemRow key={index + 1} row={row} columns={columns} columnsOptions={columnsOptions} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
