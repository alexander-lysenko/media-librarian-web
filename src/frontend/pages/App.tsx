import { Button, Container, Paper, styled, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
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
import { useLibraryAllItemsGetRequest } from "../requests/libraryItemRequests";
import { useLibrariesGetRequest } from "../requests/libraryRequests";
import { useLibrariesStore, useSelectedLibraryStore } from "../store/library/useLibrariesStore";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";

export const App = () => {
  const { t } = useTranslation();

  const libraries = useLibrariesStore((state) => state.libraries);
  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);
  const openItemDialog = useLibraryItemFormStore((state) => state.handleOpen);

  const requestLibraries = useLibrariesGetRequest();
  const requestItems = useLibraryAllItemsGetRequest();

  const handleItemCreate = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId) {
      return false;
    }

    openItemDialog(selectedLibraryId);
  }, [getSelectedLibrary, openItemDialog]);

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
      <AppNavbar />
      <Container maxWidth="xl">
        <StyledHeaderBox>
          <Typography variant="h4" noWrap children={getSelectedLibrary()?.title} />
          {"STATUS:" + requestLibraries.status + " " + requestItems.status}
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
          {requestLibraries.status === "pending" || requestItems.status === "pending" ? (
            <LoadingOverlayInner />
          ) : requestLibraries.status === "error" || requestItems.status === "error" ? (
            <LibrariesErrorState />
          ) : requestLibraries.status === "success" && requestItems.status === "success" && !libraries.length ? (
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
