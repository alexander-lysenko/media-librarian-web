import { TablePagination, useMediaQuery, useTheme } from "@mui/material";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { detectRowsPerPageOptions } from "../../core";

import type { DataTablePaginationProps } from "../../core/types";
import type { LabelDisplayedRowsArgs } from "@mui/material";
import type { ChangeEvent, MouseEvent } from "react";

/**
 * Self-sufficient Pagination component for DataTable.
 * Controls a dedicated store.
 * To get the pagination made effect, use `subscribe` to the store
 */
export const DataTablePagination = memo((props: DataTablePaginationProps) => {
  const { total, page, setPage, rowsPerPage, setRowsPerPage } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up("sm"));

  const handleChangePage = useCallback(
    (event: MouseEvent | null, newPage: number) => {
      event?.preventDefault();
      setPage(newPage);
    },
    [setPage],
  );
  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // NOTE: applyRowsPerPage is used here - the action also resets page number
      setRowsPerPage(parseInt(event.target.value, 10));
    },
    [setRowsPerPage],
  );
  const labelDisplayedRows = useCallback(
    ({ from, to, count, page }: LabelDisplayedRowsArgs) => {
      const total = count !== -1 ? count : `> ${to}`;
      return t("dataTable.viewingEntries", { from, to, total, page: page + 1 });
    },
    [t],
  );

  return (
    <TablePagination
      component="div"
      count={total}
      page={page}
      rowsPerPage={rowsPerPage}
      getItemAriaLabel={(type) => type}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={detectRowsPerPageOptions(total, t("common.all") as string)}
      labelRowsPerPage={isLargeViewport ? t("dataTable.rowsPerPage") : null}
      labelDisplayedRows={labelDisplayedRows}
    />
  );
});
