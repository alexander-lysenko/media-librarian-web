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
import { createContext, forwardRef, memo, useCallback, useContext, useRef } from "react";
import { TableVirtuoso } from "react-virtuoso";

import { LibraryItemRow } from "./LibraryItemRow";

import type { DataRow, DataTableVirtualizedProps, VirtuosoContextProps } from "../../core/types";
import type { TableHeadProps } from "@mui/material";
import type { MouseEvent, MouseEventHandler } from "react";
import type { TableComponents, VirtuosoHandle } from "react-virtuoso";

type TableHeaderProps = Pick<DataTableVirtualizedProps, "columns" | "columnOptions" | "sort" | "setSort">;
type SelectedItemContextValue = {
  selectedItemId: number | null;
  handleItemClick: (itemId: number) => (event: MouseEvent) => void;
};

const SelectedItemContext = createContext<SelectedItemContextValue>({
  selectedItemId: null,
  handleItemClick: () => () => false,
});

/**
 * Standalone Data Table component to display Library items, virtualized.
 * Powered by react-virtuoso.
 * @see https://github.com/petyosi/react-virtuoso/issues/609
 * @see https://github.com/petyosi/react-virtuoso/issues/204
 */
export const DataTableVirtualized = memo((props: DataTableVirtualizedProps) => {
  const { componentProps, selectedItemId, setSelectedItemId } = props;
  const { rows, columns, columnOptions, sort, setSort } = props;

  const ref = useRef<VirtuosoHandle>(null);
  const listRef = useRef<HTMLElement | Window | null>(null);

  const handleItemClick = useCallback(
    (itemId: number) => (event: MouseEvent) => {
      if ((event.target as HTMLElement).hasAttribute("href")) {
        return true;
      }
      event.preventDefault();
      setSelectedItemId && setSelectedItemId(selectedItemId === itemId ? null : itemId);
    },
    [selectedItemId, setSelectedItemId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let nextIndex: number | null = null;

      if (event.code === "ArrowUp") {
        nextIndex = Number(selectedItemId) - 1;
      } else if (event.code === "ArrowDown") {
        nextIndex = Number(selectedItemId) + 1;
      }

      if (nextIndex !== null) {
        ref.current?.scrollIntoView({
          index: nextIndex,
          behavior: "auto",
          done: () => {
            setSelectedItemId && setSelectedItemId(Number(nextIndex));
          },
        });
        event.preventDefault();
      }
    },
    [selectedItemId, ref, setSelectedItemId],
  );

  const scroller = useCallback(
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
    <StyledTableContainer>
      <SelectedItemContext.Provider value={{ selectedItemId: selectedItemId as number | null, handleItemClick }}>
        <TableVirtuoso
          ref={ref}
          scrollerRef={scroller}
          data={rows}
          totalCount={rows.length}
          fixedItemHeight={33}
          style={{ height: "100%" }}
          components={virtuosoTableComponents}
          context={componentProps}
          fixedHeaderContent={() => (
            <FixedHeaderContent columns={columns} columnOptions={columnOptions} sort={sort} setSort={setSort} />
          )}
          itemContent={(index, row) => (
            <LibraryItemRow key={index + 1} row={row} columns={columns} columnOptions={columnOptions} />
          )}
        />
      </SelectedItemContext.Provider>
    </StyledTableContainer>
  );
});

const virtuosoTableComponents: TableComponents<DataRow, VirtuosoContextProps> = {
  // Scroller: forwardRef(({ context, ...props }, ref) => {
  //   return <TableContainer component={Paper} {...context?.tableContainer} {...props} ref={ref} />;
  // }),
  Table: memo(({ context, children, style }) => {
    return <Table size="small" style={style} {...context?.table} children={children} />;
  }),
  FillerRow: memo(({ height }) => {
    return <tr children={<td colSpan={2} style={{ height }} />} />;
  }),
  TableHead: forwardRef(({ context, ...props }, ref) => {
    return <StyledTableHead ref={ref} {...props} {...context?.tableHead} />;
  }),
  TableBody: forwardRef(({ context, children }, ref) => {
    return <TableBody ref={ref} {...context?.tableBody} children={children} />;
  }),
  TableRow: memo(({ item, context, ...props }) => {
    const { selectedItemId, handleItemClick } = useContext(SelectedItemContext);
    const selected = selectedItemId === item.id;

    return <TableRow hover selected={selected} onClick={handleItemClick(item.id)} {...props} {...context?.tableRow} />;
  }),
};

const FixedHeaderContent = memo(({ columns, columnOptions, sort, setSort }: TableHeaderProps) => {
  const handleSorting = useCallback(
    (columnId: string): MouseEventHandler =>
      (event) => {
        event.preventDefault();
        if (columnId === sort?.column) {
          const direction = sort?.direction;
          setSort && setSort({ column: columnId, direction: direction === "asc" ? "desc" : "asc" });
        } else {
          setSort && setSort({ column: columnId, direction: "asc" });
        }
      },
    [setSort, sort?.column, sort?.direction],
  );

  return (
    <TableRow>
      {columns.map((column, index) => {
        const headerStyle = columnOptions[column.type].headerCellStyle;

        return (
          <TableCell key={column.label + index} sx={{ px: 1, ...headerStyle }} sortDirection={sort?.direction}>
            <TableSortLabel
              hideSortIcon
              active={sort?.column === column.label}
              direction={sort?.column === column.label ? sort?.direction : "asc"}
              sx={{ width: "100%" }}
              onClick={handleSorting(column.label)}
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
  );
});

const StyledTableContainer = styled(TableContainer)({
  flex: "1 0 auto",
  position: "relative",
});

const StyledTableHead = styled(TableHead)<TableHeadProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));
