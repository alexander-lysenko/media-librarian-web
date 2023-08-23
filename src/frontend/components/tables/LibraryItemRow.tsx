import { TableCell, Typography } from "@mui/material";
import { memo } from "react";

import { PrintDate, PrintPriority, PrintRating, PrintSwitch } from "../libraryItemPrint";

import type { DataColumn, DataColumnPropsByType, DataRow, LibraryElement } from "../../core/types";

type LibraryCellContentProps = {
  type: LibraryElement;
  value: never;
};

type RowContentsProps = {
  columns: DataColumn[];
  row: DataRow;
  columnOptions: DataColumnPropsByType;
};

/**
 * Generative DataTable row.
 * Combines a table data row by columns' configuration and related data set.
 * @param {DataRow} row
 * @param {DataColumn[]} columns
 * @constructor
 */
export const LibraryItemRow = memo(({ row, columns, columnOptions }: RowContentsProps) => {
  return (
    <>
      {columns.map((column) => {
        const value = row[column.label] as never;
        const columnStyle = columnOptions[column.type].contentCellStyle;

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
      return (
        <Typography variant="body2" noWrap>
          <a href={value} title={value} target="_blank" rel="noreferrer" children={value} />
        </Typography>
      );
    case "date":
    case "datetime":
      return (
        <Typography variant="body2" noWrap>
          <PrintDate format={type} value={value} />
        </Typography>
      );
    case "rating5":
    case "rating5precision":
      return (
        <Typography variant="body2" lineHeight={0} noWrap>
          <PrintRating value={value} size={5} />
        </Typography>
      );
    case "rating10":
    case "rating10precision":
      return (
        <Typography variant="body2" lineHeight={0} noWrap>
          <PrintRating value={value} size={10} />
        </Typography>
      );
    case "priority":
      return (
        <Typography variant="body2" noWrap>
          <PrintPriority value={value as number} />
        </Typography>
      );
    case "checkmark":
      return (
        <Typography variant="body2" noWrap>
          <PrintSwitch asText value={value as boolean} />
        </Typography>
      );
  }
});
