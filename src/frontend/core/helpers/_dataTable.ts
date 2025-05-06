import type { DataColumnPropsByType, RowsPerPageListOptions } from '../types';

/**
 * Match column styles for DataTable by the column type in Library
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
    headerCellStyle: { textAlign: 'right', maxWidth: 150 },
    contentCellStyle: { textAlign: 'right', maxWidth: 150 },
  },
  datetime: {
    headerCellStyle: { textAlign: 'right', maxWidth: 200 },
    contentCellStyle: { textAlign: 'right', maxWidth: 200 },
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
 * @param {number} total
 * @param {?string} labelForAll
 *
 * @return RowsPerPageListOptions
 */
export const detectRowsPerPageOptions = (total: number, labelForAll?: string): RowsPerPageListOptions => {
  const rPpOpts: RowsPerPageListOptions = [];
  total >= 10 && rPpOpts.push({ label: '10', value: 10 } as never);
  total >= 25 && rPpOpts.push({ label: '25', value: 25 } as never);
  total >= 50 && rPpOpts.push({ label: '50', value: 50 } as never);
  total >= 100 && rPpOpts.push({ label: '100', value: 100 } as never);
  labelForAll && rPpOpts.push({ label: labelForAll, value: -1 } as never);

  return rPpOpts;
};
