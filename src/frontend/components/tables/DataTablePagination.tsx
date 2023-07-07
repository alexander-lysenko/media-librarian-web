import { LabelDisplayedRowsArgs, TablePagination, TablePaginationProps, useMediaQuery, useTheme } from "@mui/material";
import { ChangeEvent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { detectRowsPerPageOptions } from "../../core";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";

type CustomTablePaginationProps = Pick<TablePaginationProps, "count">;

export const DataTablePagination = (props: CustomTablePaginationProps) => {
  const { count } = props;
  const { page, setPage, rowsPerPage, setRowsPerPage } = useLibraryTableStore((state) => state);
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up("sm"));

  const handleChangePage = (event: MouseEvent | null, newPage: number) => {
    event?.preventDefault();
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const labelDisplayedRows = ({ from, to, count, page }: LabelDisplayedRowsArgs) =>
    t("dataTable.viewingEntries", {
      from,
      to,
      total: count !== -1 ? count : `> ${to}`,
      page: page + 1,
    });

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
};
