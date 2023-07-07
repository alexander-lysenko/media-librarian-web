import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import { TableCell, Typography } from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { memo, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { ratingColorByValue } from "../../core";
import { LibraryElementEnum } from "../../core/enums";
import { DataColumn, DataColumnPropsByType, DataRow } from "../../core/types";
import { useLanguageStore } from "../../store/useTranslationStore";

type LibraryCellContentProps = {
  type: keyof typeof LibraryElementEnum;
  value: never;
};

type RowContentsProps = {
  columns: DataColumn[];
  row: DataRow;
  columnsOptions: DataColumnPropsByType;
};

type DateFieldProps = {
  format: "date" | "datetime";
  value: string;
};

type RatingProps = {
  size: 5 | 10;
  value: number;
};

/**
 *
 * @param {DataRow} row
 * @param {DataColumn[]} columns
 * @constructor
 */
export const LibraryItemRow = memo(({ row, columns, columnsOptions }: RowContentsProps) => {
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
});

const CellContents = memo(({ type, value }: LibraryCellContentProps) => {
  switch (type) {
    case "line":
    case "text":
      return <Typography variant="body2" noWrap title={value} children={value} />;
    case "url":
      return <Typography variant="body2" noWrap children={value} />;
    case "date":
    case "datetime":
      return <DateField format={type} value={value} />;
    case "rating5":
    case "rating5precision":
      return <RatingField value={value} size={5} />;
    case "rating10":
    case "rating10precision":
      return <RatingField value={value} size={10} />;
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
    datetime: "ll LTS",
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

const RatingField = memo(({ size, value }: RatingProps) => {
  const stars: ReactElement[] = [];

  new Array(size).fill(0).forEach((_, index) => {
    switch (true) {
      case value >= index + 1:
        stars.push(<Star key={index} fontSize="small" />);
        break;
      case value % 1 > 0 && value > index && value < index + 1:
        stars.push(<StarHalf key={index} fontSize="small" />);
        break;
      default:
        stars.push(<StarBorder key={index} fontSize="small" color={"disabled"} />);
        break;
    }
  });

  return (
    <Typography variant="body2" lineHeight={0} noWrap color={ratingColorByValue(value, size)}>
      {stars.concat()}
    </Typography>
  );
});
