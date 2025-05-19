import { green, grey, orange, red } from '@mui/material/colors';

export * from './_cropImage';
export * from './_dataTable';
export * from './_formatters';

export const emailValidationPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const urlValidationPattern =
  /^(ht|f)tps?:\/\/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,9}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/i;

/**
 * Calculates rating ratio for ColoredRating component by a value and size and matches it with a color:
 * - Grey - value is "0" or null,
 * - Red - value ratio is under 0.5 (i.e. 1-2 out of 5, 1-4 out of 10),
 * - Orange - value ratio is between 0.5-0.89 (i.e. 3-4 out of 5, 5-8 out of 10),
 * - Green - value ratio is 0.9 and up (i.e. 5 out of 5, 9-10 out of 10),
 * @param {number | null} value - from 0.0 to 1.0 with step 0.1
 * @param {number} size - either 5 or 10 in common
 *
 * @return string
 */
export const ratingColorByValue = (value: number | null, size: 5 | 10): string => {
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
 * Bind a collection of params to a parametrized string
 * @param {string} source
 * @param {Record<string, string | number>} params
 *
 * @return string
 */
export const bindPathParams = (source: string, params?: Record<string, string | number>): string => {
  const reducer = (path: string, [param, value]: [string, string | number]) => {
    return path.replace(`{${param}}`, value.toString());
  };

  return !params ? source : Object.entries(params).reduce<string>(reducer, source);
};
