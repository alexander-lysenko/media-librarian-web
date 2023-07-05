import { TableCell, Typography } from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { LibraryElementEnum } from "../../core/enums";
import { DataColumn, DataRow } from "../../core/types";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";
import { ColoredRating } from "./ColoredRating";
import { useLanguageStore } from "../../store/useTranslationStore";

type LibraryCellContentProps = {
  type: keyof typeof LibraryElementEnum;
  value: never;
};

type RowContentsProps = {
  columns: DataColumn[];
  row: DataRow;
};

type DateFieldProps = {
  format: "date" | "dateTime";
  value: string;
};

/**
 *
 * @param {DataRow} row
 * @param {DataColumn[]} columns
 * @constructor
 */
export const LibraryItemRow = ({ row, columns }: RowContentsProps) => {
  const columnsOptions = useLibraryTableStore((state) => state.columnsOptions);

  return (
    <>
      {columns.map((column) => {
        const value = row[column.label] as never;
        const columnStyle = columnsOptions[column.type].contentCellStyle;

        return (
          <TableCell key={column.label + row.id} style={{ ...columnStyle, padding: "6px 8px" }}>
            <CellContents type={column.type} value={value} />
          </TableCell>
        );
      })}
    </>
  );
};

const CellContents = memo(({ type, value }: LibraryCellContentProps) => {
  switch (type) {
    case "line":
      return <Typography variant="body2" noWrap title={value} children={value} />;
    case "text":
      return <Typography variant="body2" noWrap title={value} children={value} />;
    case "url":
      return <Typography variant="body2" noWrap children={value} />;
    case "date":
      return <DateField format="date" value={value} />;
    case "datetime":
      return <DateField format="dateTime" value={value} />;
    case "rating5":
      // return <Typography variant="body2" noWrap children={value as ReactNode} />;
      return <ColoredRating readOnly value={value} size={5} precision={1} />;
    case "rating5precision":
      // return <Typography variant="body2" noWrap children={value as ReactNode} />;
      return <ColoredRating readOnly value={value} size={5} precision={0.5} />;
    case "rating10":
      // return <Typography variant="body2" noWrap children={value as ReactNode} />;
      return <ColoredRating readOnly value={value} size={10} precision={1} />;
    case "rating10precision":
      // return <Typography variant="body2" noWrap children={value as ReactNode} />;
      return <ColoredRating readOnly value={value} size={10} precision={0.5} />;
    case "priority":
      return <PriorityField value={value as number} />;
    case "switch":
      return <SwitchField value={value as boolean} />;
  }
});

const DateField = memo(({ format, value }: DateFieldProps) => {
  const locale = useLanguageStore((state) => state.getLanguage());

  dayjs.extend(localizedFormat, {});
  const outputFormat: Record<DateFieldProps["format"], string> = {
    date: "LL",
    dateTime: "ll LTS",
  };

  return (
    <Typography variant="body2" noWrap>
      {dayjs(value).locale(locale).format(outputFormat[format])}
    </Typography>
  );
});

const PriorityField = memo(({ value }: { value: number }) => {
  const { t } = useTranslation();
  const options: Record<number, string> = {
    "-5": t("priorityOptions.-5"),
    "-4": t("priorityOptions.-4"),
    "-3": t("priorityOptions.-3"),
    "-2": t("priorityOptions.-2"),
    "-1": t("priorityOptions.-1"),
    "0": t("priorityOptions.0"),
    "1": t("priorityOptions.1"),
    "2": t("priorityOptions.2"),
    "3": t("priorityOptions.3"),
    "4": t("priorityOptions.4"),
    "5": t("priorityOptions.5"),
  };

  return <Typography variant="body2" noWrap children={options[value]} />;
});

const SwitchField = memo(({ value }: { value: boolean }) => {
  const { t } = useTranslation();

  return <>{value ? t("common.yes") : t("common.no")}</>;
});
