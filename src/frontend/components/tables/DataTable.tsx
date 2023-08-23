import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { LibraryItemRow } from "./LibraryItemRow";

import type { DataTableComponentProps, DataTableEventsProps } from "../../core/types";
import type { MouseEventHandler } from "react";

type TableContentsProps = Omit<DataTableComponentProps, "loading"> &
  DataTableEventsProps & {
    selectedItem: number | null;
  };

/**
 * Standalone Data Table component to display Library items.
 * Non-virtualized
 * Becomes incredibly slow on a large set of data
 */
export const DataTable = (props: DataTableComponentProps) => {
  const { rows, columns, columnOptions, sort, setSort } = props;

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
      if ((event.target as HTMLElement).hasAttribute("href")) {
        return true;
      }
      event.preventDefault();
      setSelectedItem(selectedItem === (rowId as number) ? null : (rowId as number));
    };

  return (
    <StyledTableContainer>
      <TableContents
        columns={columns}
        rows={rows}
        columnOptions={columnOptions}
        sort={sort}
        selectedItem={selectedItem}
        onSort={handleSorting}
        onRowClick={handleSelectItem}
      />
    </StyledTableContainer>
  );
};

const TableContents = (props: TableContentsProps) => {
  const { columns, columnOptions, rows, sort, selectedItem, onSort, onRowClick } = props;

  return (
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          {columns.map((column, index) => {
            const headerStyle = columnOptions[column.type].headerCellStyle;

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
            <LibraryItemRow key={index + 1} row={row} columns={columns} columnOptions={columnOptions} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const StyledTableContainer = styled(TableContainer)({
  flex: "1 0 auto",
  position: "relative",
});
