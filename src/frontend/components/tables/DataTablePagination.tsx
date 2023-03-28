import { TablePagination, TablePaginationProps } from "@mui/material";
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

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={detectRowsPerPageOptions(count, t("common.all") as string)}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      SelectProps={{ inputProps: { sx: { py: 2 } } }}
      labelRowsPerPage={t("dataTable.rowsPerPage")}
      labelDisplayedRows={({ from, to, count, page }) =>
        t("dataTable.viewingEntries", {
          from,
          to,
          total: count !== -1 ? count : `> ${to}`,
          page: page + 1,
        })
      }
      getItemAriaLabel={(type) => type}
    />
  );
};
