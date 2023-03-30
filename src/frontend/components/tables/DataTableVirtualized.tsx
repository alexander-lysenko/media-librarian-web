import {
  Box,
  Paper,
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
import React, { ComponentType, forwardRef, memo, useMemo } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";

import {
  DataRow,
  DataTableBaseProps,
  DataTableContentsProps,
  DataTableEventsProps,
  DataTableHeaderProps,
  DataTablePaginationProps,
  DataTableSelectedItemState,
  DataTableSortingState,
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
  DataTableSelectedItemState & {
    componentProps: ContextProps;
    sorting: DataTableSortingState;
    pagination: DataTablePaginationProps;
    loading: boolean;
  };

type TableHeaderProps = DataTableHeaderProps & Pick<DataTableEventsProps, "onSort">;
type TableContentsProps = DataTableContentsProps & TableRowProps & Pick<DataTableEventsProps, "onRowClick">;

/**
 * Data Table component with virtualization
 * @see https://github.com/petyosi/react-virtuoso/issues/609
 */
export const DataTableVirtualized = (props: DataTableProps) => {
  // noinspection DuplicatedCode
  const { columns, rows, sorting, pagination, selectedItem, setSelectedItem, componentProps } = props;
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
      <TableVirtuoso
        style={{ height: "70vh" }}
        data={rows}
        overscan={1}
        increaseViewportBy={1}
        context={componentProps}
        components={virtuosoTableComponents}
        fixedHeaderContent={() => <FixedHeaderContent columns={columns} sort={sort} onSort={handleSorting} />}
        itemContent={(index, row) => (
          <>
            {columns.map((column) => (
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
            {/*<RowContent*/}
            {/*  row={row}*/}
            {/*  index={index}*/}
            {/*  columns={columns}*/}
            {/*  selectedItem={selectedItem}*/}
            {/*  onRowClick={handleSelectItem}*/}
            {/*/>*/}
          </>
        )}
      />
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
  Table: ({ context, children, style }) => {
    return <Table {...context?.table} children={children} style={style} />;
  },
  TableRow: ({ item: _item, context, ...props }) => {
    return <TableRow {...context?.tableRow} {...props} style={{ height: 29 }} />;
  },
  FillerRow: ({ height }) => {
    return <tr children={<td colSpan={6} style={{ height }} />} />;
  },
};

const FixedHeaderContent = ({ columns, sort, onSort }: TableHeaderProps) => {
  return (
    <TableRow>
      {columns.map((column) => {
        return (
          <TableCell key={column.id} sx={column.headerCellSx} sortDirection="asc">
            <TableSortLabel
              active={sort?.column === column.id}
              direction={sort?.column === column.id ? sort?.direction : "asc"}
              onClick={onSort(column.id)}
              children={
                <Typography variant="subtitle2" noWrap paragraph={false}>
                  {column.label}
                </Typography>
              }
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const RowContent = (props: TableContentsProps) => {
  const { index, row, selectedItem, columns, onRowClick } = props;

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
};
