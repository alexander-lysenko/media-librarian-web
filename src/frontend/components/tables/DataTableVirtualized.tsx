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
import { forwardRef, memo, MouseEvent, MouseEventHandler, useCallback, useRef } from "react";
import { TableComponents, TableVirtuoso, VirtuosoHandle } from "react-virtuoso";

import { DataRow, DataTableEventsProps, DataTableHeaderProps, DataTableStyleProps } from "../../core/types";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";
import { DataTablePagination } from "./DataTablePagination";
import { LibraryItemRow } from "./LibraryItemRow";

type ContextProps = {
  tableContainer?: TableContainerProps;
  table?: TableProps;
  tableHead?: TableHeadProps;
  tableRow?: TableRowProps;
  tableBody?: TableBodyProps;
};

type TableVirtualizedProps = DataTableStyleProps & {
  loading: boolean;
  componentProps?: ContextProps;
};

type TableHeaderProps = DataTableHeaderProps & Pick<DataTableEventsProps, "onSort">;

/**
 * Data Table component with virtualization
 * @see https://github.com/petyosi/react-virtuoso/issues/609
 * @see https://github.com/petyosi/react-virtuoso/issues/204
 */
export const DataTableVirtualized = (props: TableVirtualizedProps) => {
  const { loading, containerSx, componentProps } = props;

  const { columns, rows, columnsOptions } = useLibraryTableStore((state) => state);
  const { sort, setSort, selectedItem, setSelectedItem } = useLibraryTableStore((state) => state);

  const ref = useRef<VirtuosoHandle>(null);
  const listRef = useRef<HTMLElement | Window | null>(null);

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

  const handleSelectItem: MouseEventHandler<HTMLTableRowElement> = (event: MouseEvent) => {
    console.log(event);
    event.preventDefault();
    // setSelectedItem && setSelectedItem(selectedItem === (rowId as number) ? null : (rowId as number));
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let nextIndex: number | null = null;

      if (event.code === "ArrowUp") {
        nextIndex = Number(selectedItem) - 1;
      } else if (event.code === "ArrowDown") {
        nextIndex = Number(selectedItem) + 1;
      }

      if (nextIndex !== null) {
        ref.current?.scrollIntoView({
          index: nextIndex,
          behavior: "auto",
          done: () => {
            setSelectedItem(Number(nextIndex));
          },
        });
        event.preventDefault();
      }
    },
    [selectedItem, ref, setSelectedItem],
  );

  const scrollerRef = useCallback(
    (element: HTMLElement | Window | null) => {
      if (element) {
        element.addEventListener("keydown", handleKeyDown as EventListener);
        listRef.current = element;
      } else {
        listRef.current?.removeEventListener("keydown", handleKeyDown as EventListener);
      }
    },
    [handleKeyDown],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ ...containerSx, position: "relative" }}>
        <TableVirtuoso
          ref={ref}
          scrollerRef={scrollerRef}
          data={rows}
          initialItemCount={50}
          // increaseViewportBy={320}
          fixedItemHeight={33}
          overscan={30}
          style={{ height: "100%" }}
          components={virtuosoTableComponents}
          fixedHeaderContent={() => <FixedHeaderContent columns={columns} sort={sort} onSort={handleSorting} />}
          itemContent={(index, row) => (
            <LibraryItemRow key={index + 1} row={row} columns={columns} columnsOptions={columnsOptions} />
          )}
          context={{
            tableRow: {
              onClick: handleSelectItem,
              // selected: index === selectedItem,
            },
            ...componentProps,
          }}
        />
      </TableContainer>
      <DataTablePagination count={rows.length} />
    </Box>
  );
};

const virtuosoTableComponents: TableComponents<DataRow, ContextProps> = {
  // Scroller: forwardRef(({ context, ...props }, ref) => {
  //   return <TableContainer component={Paper} {...context?.tableContainer} {...props} ref={ref} />;
  // }),
  Table: ({ context, children, style }) => {
    return <Table size="small" style={style} {...context?.table} children={children} />;
  },
  TableHead: forwardRef(({ context, ...props }, ref) => {
    return <StyledTableHead {...props} {...context?.tableHead} ref={ref} />;
  }),
  TableBody: forwardRef(({ context, children }, ref) => {
    return <TableBody {...context?.tableBody} children={children} ref={ref} />;
  }),
  TableRow: memo(({ item: _item, context, ...props }) => {
    return <TableRow {...props} {...context?.tableRow} />;
  }),
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
