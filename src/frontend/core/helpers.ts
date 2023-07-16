import { AvatarProps } from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";

import { DataColumnPropsByType } from "./types";

type RowsPerPageOptions = Array<number | { label: string; value: number }> | [];

/**
 * Match Library DataTable column styles by its type
 */
export const dataColumnPropsByType: DataColumnPropsByType = {
  line: {
    contentCellStyle: { maxWidth: 250 },
  },
  text: {
    contentCellStyle: { maxWidth: 350 },
  },
  url: {
    contentCellStyle: { maxWidth: 150 },
  },
  date: {
    headerCellStyle: { textAlign: "right", maxWidth: 150 },
    contentCellStyle: { textAlign: "right", maxWidth: 150 },
  },
  datetime: {
    headerCellStyle: { textAlign: "right", maxWidth: 200 },
    contentCellStyle: { textAlign: "right", maxWidth: 200 },
  },
  rating5: {
    contentCellStyle: { maxWidth: 150 },
  },
  rating5precision: {
    contentCellStyle: { maxWidth: 150 },
  },
  rating10: {
    contentCellStyle: { maxWidth: 250 },
  },
  rating10precision: {
    contentCellStyle: { maxWidth: 250 },
  },
  checkmark: {
    contentCellStyle: { maxWidth: 100 },
  },
  priority: {
    contentCellStyle: { maxWidth: 150 },
  },
};

/**
 * Combine rows-per-page options for DataTablePagination depending on total number of entries
 * @param total
 * @param labelForAll
 */
export const detectRowsPerPageOptions = (total: number, labelForAll?: string): RowsPerPageOptions => {
  const rPpOpts: RowsPerPageOptions = [];
  total >= 10 && rPpOpts.push({ label: "10", value: 10 } as never);
  total >= 25 && rPpOpts.push({ label: "25", value: 25 } as never);
  total >= 50 && rPpOpts.push({ label: "50", value: 50 } as never);
  total >= 100 && rPpOpts.push({ label: "100", value: 100 } as never);
  labelForAll && rPpOpts.push({ label: labelForAll, value: -1 } as never);

  return rPpOpts;
};

/**
 * Calculates rating ratio for ColoredRating component by a value and size and matches it with a color:
 * - Grey - value is "0" or null,
 * - Red - value ratio is under 0.5 (i.e. 1-2 out of 5, 1-4 out of 10),
 * - Orange - value ratio is between 0.5-0.89 (i.e. 3-4 out of 5, 5-8 out of 10),
 * - Green - value ratio is 0.9 and up (i.e. 5 out of 5, 9-10 out of 10),
 * @param value
 * @param size
 */
export const ratingColorByValue = (value: number | null, size: number) => {
  const ratio = (value as number) / size;
  switch (true) {
    case ratio <= 0:
      return grey.A200;
    case ratio > 0 && ratio < 0.5:
      return red.A200;
    case ratio >= 0.9:
      return green.A400;
    default:
      return orange.A200;
  }
};

/**
 * Calculates background color for avatar by a string representing username
 * @param string
 */
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

/**
 * When a user's avatar is empty, fill it with its initials and a color calculated from its username
 * @param name
 */
export const stringAvatar = (name: string): AvatarProps => ({
  sx: {
    backgroundColor: stringToColor(name),
  },
  children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
});

/**
 * Create a slug-like text from a string. Useful for attribute "id" provided to inputs
 * @param string
 * @param separator
 */
// noinspection JSUnusedGlobalSymbols
export const slugify = (string: string, separator = "-") => {
  return string
    .normalize("NFD") // split an accented letter in the base letter and the ascent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-zА-я0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, separator);
};
