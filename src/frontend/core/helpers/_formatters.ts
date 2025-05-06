// noinspection JSUnusedGlobalSymbols
/**
 * Creates a slug-like text from a string. Useful for attribute "id" provided to inputs
 * @param {string} sequence
 * @param {string} separator
 *
 * @return string
 */
export const slugify = (sequence: string, separator?: string): string => {
  return sequence
    .normalize('NFD') // split an accented letter in the base letter and the ascent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-zА-я0-9 ]/g, '') // remove all non-word chars (to be replaced)
    .replace(/\s+/g, separator ?? '-');
};

// noinspection JSUnusedGlobalSymbols
/**
 * Calculates background color for avatar by a string representing ID or username
 * @param {string} sequence
 *
 * @return string
 */
export const stringToColor = (sequence: string): string => {
  let hash = 0;
  let i;

  for (i = 0; i < sequence.length; i += 1) {
    hash = sequence.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};
