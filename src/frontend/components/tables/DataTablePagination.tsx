import { LabelDisplayedRowsArgs, TablePagination, useMediaQuery, useTheme } from "@mui/material";
import { ChangeEvent, memo, MouseEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { detectRowsPerPageOptions } from "../../core";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";

export const DataTablePagination = memo(() => {
  const count = useLibraryTableStore((state) => state.rows.length);
  const [page, setPage] = useLibraryTableStore((state) => [state.page, state.setPage], shallow);
  const [rowsPerPage, setRowsPerPage] = useLibraryTableStore(
    (state) => [state.rowsPerPage, state.setRowsPerPage],
    shallow,
  );

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
      setPage(0);
      setRowsPerPage(parseInt(event.target.value, 10));
    },
    [setPage, setRowsPerPage],
  );

  const labelDisplayedRows = useCallback(
    ({ from, to, count, page }: LabelDisplayedRowsArgs) =>
      t("dataTable.viewingEntries", {
        from,
        to,
        total: count !== -1 ? count : `> ${to}`,
        page: page + 1,
      }),
    [t],
  );

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      getItemAriaLabel={(type) => type}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={detectRowsPerPageOptions(count, t("common.all") as string)}
      labelRowsPerPage={isLargeViewport ? t("dataTable.rowsPerPage") : null}
      labelDisplayedRows={labelDisplayedRows}
    />
  );
});
