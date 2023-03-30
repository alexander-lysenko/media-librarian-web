import { LabelDisplayedRowsArgs, TablePagination, TablePaginationProps, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { detectRowsPerPageOptions } from "../../core";

type CustomTablePaginationProps = Pick<
  TablePaginationProps,
  "count" | "page" | "rowsPerPage" | "onPageChange" | "onRowsPerPageChange"
>;

export const DataTablePagination = (props: CustomTablePaginationProps) => {
  const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeViewport = useMediaQuery(theme.breakpoints.up("sm"));

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
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={detectRowsPerPageOptions(count, t("common.all") as string)}
      labelRowsPerPage={isLargeViewport ? t("dataTable.rowsPerPage") : null}
      labelDisplayedRows={labelDisplayedRows}
    />
  );
};
