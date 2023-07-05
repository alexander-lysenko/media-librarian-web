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
import { ChangeEvent, forwardRef, MouseEvent, MouseEventHandler, useRef } from "react";
import { TableComponents, TableVirtuoso, VirtuosoHandle } from "react-virtuoso";

import {
  DataRow,
  DataTableBaseProps,
  DataTableEventsProps,
  DataTableHeaderProps,
  DataTablePaginationProps,
  DataTableSelectedItemState,
  DataTableSortingState,
  DataTableStyleProps,
} from "../../core/types";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";
import { LibraryItemRow } from "../library/LibraryItemRow";
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

type TableVirtualizedProps = DataTableStyleProps & {
  componentProps: ContextProps;
  loading: boolean;
};

type TableHeaderProps = DataTableHeaderProps & Pick<DataTableEventsProps, "onSort">;

/**
 * Data Table component with virtualization
 * @see https://github.com/petyosi/react-virtuoso/issues/609
 * @see https://github.com/petyosi/react-virtuoso/issues/204
 */
export const DataTableVirtualized = (props: TableVirtualizedProps) => {
  const { loading, containerSx, componentProps } = props;

  const { columns, rows } = useLibraryTableStore((state) => state);
  const { sort, setSort, page, setPage, rowsPerPage, setRowsPerPage, selectedItem, setSelectedItem } =
    useLibraryTableStore((state) => state);

  const ref = useRef<VirtuosoHandle>(null);

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
      <TableContainer sx={{ ...containerSx, position: "relative" }}>
        <TableVirtuoso
          style={{ height: "100%" }}
          data={rows}
          initialItemCount={50}
          ref={ref}
          // increaseViewportBy={320}
          fixedItemHeight={33}
          context={componentProps}
          components={virtuosoTableComponents}
          overscan={30}
          fixedHeaderContent={() => <FixedHeaderContent columns={columns} sort={sort} onSort={handleSorting} />}
          itemContent={(index, row) => <LibraryItemRow key={index + 1} row={row} columns={columns} />}
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
    return <StyledTableHead {...props} {...context?.tableHead} ref={ref} />;
  }),
  TableBody: forwardRef(({ context, children }, ref) => {
    return <TableBody {...context?.tableBody} children={children} ref={ref} />;
  }),
  Table: ({ context, children, style }) => {
    return <Table size="small" style={style} {...context?.table} children={children} />;
  },
  TableRow: ({ item: _item, context, ...props }) => {
    return <TableRow {...props} {...context?.tableRow} />;
  },
  FillerRow: ({ height }) => {
    return <tr children={<td colSpan={2} style={{ height }} />} />;
  },
};

const FixedHeaderContent = ({ columns, sort, onSort }: TableHeaderProps) => {
  const columnsOptions = useLibraryTableStore((state) => state.columnsOptions);
  return (
    <TableRow>
      {columns.map((column, index) => {
        const headerStyle = columnsOptions[column.type].headerCellStyle;
        return (
          <TableCell key={column.label + index} sx={{ px: 1, ...headerStyle }} sortDirection={sort?.direction}>
            <TableSortLabel
              active={sort?.column === column.label}
              direction={sort?.column === column.label ? sort?.direction : "asc"}
              onClick={onSort(column.label)}
              hideSortIcon
              sx={{ width: "100%" }}
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

const StyledTableHead = styled(TableHead)<TableHeadProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));
