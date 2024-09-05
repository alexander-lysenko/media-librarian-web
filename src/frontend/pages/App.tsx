import { Button, Container, Paper, styled, Typography } from "@mui/material";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { AppNavbar } from "../components";
import { AddCircleOutlined } from "../components/icons";
import { LibraryDrawer } from "../components/libraryItemPrint";
import { LibraryCreateDialog, LibraryItemDialog } from "../components/modals";
import { LibraryTable } from "../components/tables/LibraryTable";
import { LibrariesEmptyState } from "../components/ui/LibrariesEmptyState";
import { LibrariesErrorState } from "../components/ui/LibrariesErrorState";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { useLibraryAllItemsGetRequest } from "../requests/useLibraryItemRequests";
import { useLibrariesGetRequest } from "../requests/useLibraryRequests";
import { useLibrariesStore, useSelectedLibraryStore } from "../store/library/useLibrariesStore";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";

export const App = () => {
  const { t } = useTranslation();
  const dataFetchedRef = useRef(false);

  const libraries = useLibrariesStore((state) => state.libraries);
  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);
  const openItemDialog = useLibraryItemFormStore((state) => state.handleOpen);

  const requestLibraries = useLibrariesGetRequest();
  const requestItems = useLibraryAllItemsGetRequest();

  const getItems = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;

    if (selectedLibraryId) {
      void requestItems.fetch(undefined, { id: selectedLibraryId });
    }
  }, [getSelectedLibrary, requestItems]);

  const handleItemCreate = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId) {
      return false;
    }

    openItemDialog(selectedLibraryId);
  }, [getSelectedLibrary, openItemDialog]);

  useLayoutEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      requestLibraries.fetch().then(getItems);
    }

    return useLibraryTableStore.subscribe((state) => [state.sort, state.page, state.rowsPerPage], getItems, {
      equalityFn: shallow,
      // fireImmediately: false,
    });
  }, [getItems, requestLibraries]);

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <StyledHeaderBox>
          <Typography variant="h4" noWrap children={getSelectedLibrary()?.title} />
          {"STATUS:" + requestItems.status}
          <Button
            type="button"
            variant="contained"
            startIcon={<AddCircleOutlined />}
            onClick={handleItemCreate}
            disabled={!getSelectedLibrary()?.id}
            children={t("libraryItem.title.create")}
          />
        </StyledHeaderBox>
        <Paper elevation={3} sx={{ height: { xs: "calc(100vh - 148px)", sm: "calc(100vh - 160px)" } }}>
          {requestLibraries.status === "LOADING" || requestItems.status === "LOADING" ? (
            <LoadingOverlayInner />
          ) : requestLibraries.status === "FAILED" || requestItems.status === "FAILED" ? (
            <LibrariesErrorState />
          ) : requestLibraries.status === "SUCCESS" && requestLibraries.status === "SUCCESS" && !libraries.length ? (
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
};

const StyledHeaderBox = styled("div")({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  paddingBottom: 16,
});
