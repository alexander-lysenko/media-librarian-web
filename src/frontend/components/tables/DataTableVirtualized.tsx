import {
  Box,
  Paper,
  SxProps,
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableHeadProps,
  TableProps,
  TableRow,
  TableRowProps,
  TableSortLabel,
  Typography,
  useTheme,
} from "@mui/material";
import React, { forwardRef, memo } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";

import {
  DataColumn,
  DataRow,
  DataTableBaseProps,
  DataTableEventsProps,
  DataTableHeaderProps,
  DataTablePaginationProps,
  DataTableSelectedItemState,
  DataTableSortingState,
  DataTableStyleProps,
} from "../../core/types";
import { DataTablePagination } from "./DataTablePagination";

type ContextProps = {
  tableContainer?: TableContainerProps;
  table?: TableProps;
  tableHead?: TableHeadProps;
  tableRow?: TableRowProps;
  tableBody?: TableBodyProps;
};

type DataTableProps = DataTableBaseProps &
  DataTableStyleProps &
  DataTableSelectedItemState & {
    componentProps: ContextProps;
    sorting: DataTableSortingState;
    pagination: DataTablePaginationProps;
    loading: boolean;
  };

type TableHeaderProps = DataTableHeaderProps & Pick<DataTableEventsProps, "onSort">;

/**
 * Data Table component with virtualization
 * @see https://github.com/petyosi/react-virtuoso/issues/609
 * @see https://github.com/petyosi/react-virtuoso/issues/204
 */
export const DataTableVirtualized = (props: DataTableProps) => {
  // noinspection DuplicatedCode
  const { columns, rows, sorting, pagination, selectedItem, setSelectedItem, componentProps, containerSx } = props;
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
      <TableContainer sx={{ ...containerSx, position: "relative" }}>
        <TableVirtuoso
          style={{ height: "100%" }}
          data={rows}
          overscan={10}
          increaseViewportBy={10}
          context={componentProps}
          components={virtuosoTableComponents}
          fixedHeaderContent={() => <FixedHeaderContent columns={columns} sort={sort} onSort={handleSorting} />}
          itemContent={(index, row) => <RowContent row={row} key={index} columns={columns} />}
        />
      </TableContainer>
      <DataTablePagination
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

const virtuosoTableComponents: TableComponents<DataRow, ContextProps> = {
  Scroller: forwardRef(({ context, ...props }, ref) => {
    return <TableContainer component={Paper} {...context?.tableContainer} {...props} ref={ref} />;
  }),
  TableHead: forwardRef(({ context, ...props }, ref) => {
    const theme = useTheme();
    return (
      <TableHead
        {...context?.tableHead}
        {...props}
        sx={{ backgroundColor: theme.palette.background.paper, ...context?.tableHead?.sx }}
        ref={ref}
      />
    );
  }),
  TableBody: forwardRef(({ context, children }, ref) => {
    return <TableBody {...context?.tableBody} children={children} ref={ref} />;
  }),
  Table: memo(({ context, children, style }) => {
    return <Table {...context?.table} children={children} style={style} />;
  }),
  TableRow: ({ item: _item, context, ...props }) => {
    return <TableRow {...context?.tableRow} {...props} style={{ height: 29 }} />;
  },
  FillerRow: ({ height }) => {
    return <tr children={<td colSpan={2} style={{ height }} />} />;
  },
};

const FixedHeaderContent = ({ columns, sort, onSort }: TableHeaderProps) => {
  return (
    <TableRow>
      {columns.map((column, index) => (
        <TableCell key={column.id + index} sx={{ px: 1, ...column.headerCellSx }} sortDirection={sort?.direction}>
          <TableSortLabel
            active={sort?.column === column.id}
            direction={sort?.column === column.id ? sort?.direction : "asc"}
            onClick={onSort(column.id)}
            hideSortIcon
            sx={{ width: "100%" }}
            children={
              <Typography variant="subtitle2" noWrap paragraph={false}>
                {column.label}
              </Typography>
            }
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

const RowContent = ({ row, columns }: { row: DataRow; columns: DataColumn[] }) => {
  return (
    <>
      {columns.map((column, index) => {
        return (
          <TableCell key={column.id + index} sx={{ py: 0.25, px: 1, ...column.contentCellSx }}>
            <column.component value={row[column.id] as never} />
          </TableCell>
        );
      })}
    </>
  );
};
