import { Button, Container, Paper, styled, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { AppNavbar, LoadingOverlayInner } from '../components';
import { AddCircleOutlined } from '../components/icons';
import { LibraryDrawer } from '../components/libraryItemPrint';
import { LibraryCreateDialog, LibraryItemDialog } from '../components/modals';
import { FiltersPopover } from '../components/nav/FiltersPopover';
import { LibrarySelector } from '../components/nav/LibrarySelector';
import { LibraryTable } from '../components/tables/LibraryTable';
import { LibrariesEmptyState } from '../components/ui/LibrariesEmptyState';
import { LibrariesErrorState } from '../components/ui/LibrariesErrorState';
import { enqueueSnack } from '../core/actions';
import { AppRoutes } from '../core/enums';
import { useLibraryAllItemsGetRequest } from '../requests/libraryItemRequests';
import { useLibrariesGetRequest } from '../requests/libraryRequests';
import { useLibrariesStore, useSelectedLibraryStore } from '../store/library/useLibrariesStore';
import { useLibraryTableStore } from '../store/library/useLibraryTableStore';
import { useLibraryItemFormStore } from '../store/useLibraryItemFormStore';

export const Route = createFileRoute(AppRoutes.appHome)({
  component: App,
  // loader: (ctx) => ctx.queryClient.ensureQueryData({ queryKey: ['get', 'profile'], exact: true }),
});

/**
 * Renders the main application content, including the navigation bar, library-related elements, and dialogs.
 * Manages the state of Libraries and Items, handles user interactions for creating Items,
 * and reacts to changes in subscription for table sorting and pagination.
 */
function App() {
  const { t } = useTranslation();

  const libraries = useLibrariesStore((state) => state.libraries);
  const initSelectedLibraryId = useSelectedLibraryStore((state) => state.selectedLibraryId);
  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);

  const openItemDialog = useLibraryItemFormStore((state) => state.handleOpen);

  const requestLibraries = useLibrariesGetRequest();
  const requestItems = useLibraryAllItemsGetRequest();

  useEffect(() => {
    if (initSelectedLibraryId === 0) {
      enqueueSnack({ type: 'warning', message: t('notifications.libraryNotFound') });
    }
  }, [getSelectedLibrary, initSelectedLibraryId, t]);

  useEffect(() => {
    const unsubscribe = useSelectedLibraryStore.subscribe(
      (state) => [state.selectedLibraryId],
      () => {
        const fieldsOfSelectedLibrary = Object.entries(getSelectedLibrary()?.fields || {}) // prettier-ignore
          .map(([label, type]) => ({ label, type }));
        useLibraryTableStore.setState({ columns: fieldsOfSelectedLibrary, page: 0, sort: undefined });
      },
      { equalityFn: shallow },
    );
    return () => {
      unsubscribe();
    };
  }, [getSelectedLibrary]);

  useEffect(() => {
    const unsubscribe = useLibraryTableStore.subscribe(
      (state) => [state.sort, state.page, state.rowsPerPage],
      () => requestItems.refetch(),
      { equalityFn: shallow },
    );
    return () => {
      unsubscribe();
    };
  }, [requestItems]);

  return (
    <>
      <AppNavbar>
        <LibrarySelector />
        <FiltersPopover />
      </AppNavbar>
      <Container maxWidth='xl'>
        <StyledHeaderBox>
          <Typography variant='h4' noWrap children={getSelectedLibrary()?.title} />
          <Button
            type='button'
            variant='contained'
            startIcon={<AddCircleOutlined />}
            onClick={() => openItemDialog()}
            disabled={!getSelectedLibrary()?.id}
            children={t('libraryItem.title.create')}
          />
        </StyledHeaderBox>
        <Paper elevation={3} sx={{ height: { xs: 'calc(100vh - 148px)', sm: 'calc(100vh - 160px)' } }}>
          {requestLibraries.status === 'pending' || requestItems.status === 'pending' ? (
            <LoadingOverlayInner />
          ) : requestLibraries.status === 'error' || requestItems.status === 'error' ? (
            <LibrariesErrorState />
          ) : requestLibraries.status === 'success' && requestItems.status === 'success' && !libraries.length ? (
            <LibrariesEmptyState />
          ) : (
            <LibraryTable />
          )}
        </Paper>
      </Container>
      <LibraryDrawer />
      <LibraryItemDialog />
      <LibraryCreateDialog />
    </>
  );
}

const StyledHeaderBox = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  paddingBottom: 16,
});
