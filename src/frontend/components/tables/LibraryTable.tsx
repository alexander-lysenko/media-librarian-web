import { styled } from '@mui/material';

import { usePreviewDrawerStore } from '../../store/app/usePreviewDrawerStore';
import { useLibraryTableStore } from '../../store/library/useLibraryTableStore';
import { DataTablePagination } from './DataTablePagination';
import { DataTableVirtualized } from './DataTableVirtualized';

export const LibraryTable = () => {
  const { columns, rows, total, sort, setSort, columnOptions } = useLibraryTableStore();
  const { page, setPage, rowsPerPage, applyRowsPerPage } = useLibraryTableStore();

  const { selectedItemId, setSelectedItemId } = usePreviewDrawerStore((state) => state);

  const dataTableProps = { rows, columns, columnOptions, sort, setSort, selectedItemId, setSelectedItemId };
  const paginationProps = { total, page, rowsPerPage, setPage, setRowsPerPage: applyRowsPerPage };

  return (
    <StyledTableBox>
      <DataTableVirtualized {...dataTableProps} />
      <DataTablePagination {...paginationProps} />
    </StyledTableBox>
  );
};

const StyledTableBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});
