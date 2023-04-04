// noinspection DuplicatedCode

import {
  Box,
  styled,
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
} from "@mui/material";
import React, { forwardRef, useRef } from "react";
import { TableComponents, TableVirtuoso, VirtuosoHandle } from "react-virtuoso";

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
import { LibraryInlineComponents } from "../library/InlineComponents";
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
  const { columns, rows, sorting, pagination, selectedItem, setSelectedItem, componentProps, containerSx } = props;
  const { sort, setSort } = sorting;
  const { page, rowsPerPage, setPage, setRowsPerPage } = pagination;
  const ref = useRef<VirtuosoHandle>(null);

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
          initialItemCount={25}
          ref={ref}
          // increaseViewportBy={100}
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
  // Scroller: forwardRef(({ context, ...props }, ref) => {
  //   return <TableContainer component={Paper} {...context?.tableContainer} {...props} ref={ref} />;
  // }),
  TableHead: forwardRef(({ context, ...props }, ref) => {
    return <StyledTableHead {...context?.tableHead} {...props} ref={ref} />;
  }),
  TableBody: forwardRef(({ context, children }, ref) => {
    return <TableBody {...context?.tableBody} children={children} ref={ref} />;
  }),
  Table: ({ context, children, style }) => {
    return <Table {...context?.table} children={children} style={style} />;
  },
  TableRow: ({ item: _item, context, ...props }) => {
    return <TableRow {...context?.tableRow} {...props} />;
  },
  FillerRow: ({ height }) => {
    return <tr children={<td colSpan={2} style={{ height }} />} />;
  },
};

const FixedHeaderContent = ({ columns, sort, onSort }: TableHeaderProps) => {
  return (
    <TableRow>
      {columns.map((column, index) => (
        <StyledHeaderCell key={column.id + index} style={column.headerCellStyle} sortDirection={sort?.direction}>
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
        </StyledHeaderCell>
      ))}
    </TableRow>
  );
};

const RowContent = ({ row, columns }: { row: DataRow; columns: DataColumn[] }) => {
  return (
    <>
      {columns.map((column, index) => {
        const LibraryComponent = LibraryInlineComponents[column.component];
        return (
          <StyledBodyCell key={column.id + index} style={column.contentCellStyle}>
            <LibraryComponent value={row[column.id] as never} truncate />
          </StyledBodyCell>
        );
      })}
    </>
  );
};

const StyledHeaderCell = styled(TableCell)`
  //padding: 4px 8px;
`;

const StyledBodyCell = styled(TableCell)`
  //padding: 4px 8px;
`;

const StyledTableHead = styled(TableHead)<TableHeadProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));
