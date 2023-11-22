import { AddCircleOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, styled, Typography } from "@mui/material";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { AppNavbar } from "../components";
import { LibraryDrawer } from "../components/libraryItemPrint";
import { LibraryItemDialog } from "../components/modals";
import { DataTablePagination } from "../components/tables/DataTablePagination";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { useLibraryAllItemsGetRequest } from "../requests/useLibraryItemRequests";
import { useLibrariesGetRequest } from "../requests/useLibraryRequests";
import { usePreviewDrawerStore } from "../store/app/usePreviewDrawerStore";
import { useLibraryListStore } from "../store/library/useLibraryListStore";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";

export const App = () => {
  const { t } = useTranslation();
  const dataFetchedRef = useRef(false);

  const getSelectedLibrary = useLibraryListStore((state) => state.getSelectedLibrary);
  const { columns, rows, total, sort, setSort, columnOptions } = useLibraryTableStore();
  const { page, setPage, rowsPerPage, applyRowsPerPage } = useLibraryTableStore();

  const { selectedItemId, setSelectedItemId } = usePreviewDrawerStore();
  const openItemDialog = useLibraryItemFormStore((state) => state.setOpen);

  const dataTableProps = { rows, columns, columnOptions, sort, setSort, selectedItemId, setSelectedItemId };
  const paginationProps = { total, page, rowsPerPage, setPage, setRowsPerPage: applyRowsPerPage };

  const { fetch: getLibraries, status: libraryListLoadingStatus } = useLibrariesGetRequest();
  const { fetch: fetchItems, status: itemsLoadingStatus } = useLibraryAllItemsGetRequest();

  const getItems = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    console.log(selectedLibraryId);
    if (selectedLibraryId) {
      void fetchItems(undefined, { id: selectedLibraryId });
    }
  }, [fetchItems, getSelectedLibrary]);

  useLayoutEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      getLibraries().then(getItems);
    }

    return useLibraryTableStore.subscribe((state) => [state.sort, state.page, state.rowsPerPage], getItems, {
      equalityFn: shallow,
      // fireImmediately: false,
    });
  }, [getItems, getLibraries]);

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <StyledHeaderBox>
          <Typography variant="h4" noWrap children={getSelectedLibrary()?.title} />
          <Button
            type="button"
            variant="contained"
            startIcon={<AddCircleOutlined />}
            onClick={() => openItemDialog(true)}
            children={t("libraryItem.title.create")}
          />
        </StyledHeaderBox>
        <Paper elevation={3} sx={{ height: { xs: "calc(100vh - 148px)", sm: "calc(100vh - 160px)" } }}>
          {libraryListLoadingStatus === "LOADING" || itemsLoadingStatus === "LOADING" ? (
            <LoadingOverlayInner />
          ) : (
            <StyledTableBox>
              <DataTableVirtualized {...dataTableProps} />
              <DataTablePagination {...paginationProps} />
            </StyledTableBox>
          )}
        </Paper>
      </Container>
      <LibraryDrawer />
      <LibraryItemDialog selectedItemId={selectedItemId} />
    </>
  );
};

const StyledHeaderBox = styled(Box)({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  paddingBottom: 16,
});

const StyledTableBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});
