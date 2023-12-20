import { AddCircleOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, styled, Typography } from "@mui/material";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { AppNavbar } from "../components";
import { LibraryDrawer } from "../components/libraryItemPrint";
import { LibraryCreateDialog, LibraryItemDialog } from "../components/modals";
import { DataTablePagination } from "../components/tables/DataTablePagination";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { confirmDialog, enqueueSnack } from "../core/actions";
import {
  useLibraryAllItemsGetRequest,
  useLibraryItemDeleteRequest,
  useLibraryItemGetRequest,
} from "../requests/useLibraryItemRequests";
import { useLibrariesGetRequest } from "../requests/useLibraryRequests";
import { usePreviewDrawerStore } from "../store/app/usePreviewDrawerStore";
import { useLibraryListStore } from "../store/library/useLibraryListStore";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";
import { LibrariesEmptyState } from "../components/ui/LibrariesEmptyState";

export const App = () => {
  const { t } = useTranslation();
  const dataFetchedRef = useRef(false);

  const { libraries, getSelectedLibrary } = useLibraryListStore((state) => state);
  const { selectedItemId, setSelectedItemId } = usePreviewDrawerStore((state) => state);

  const { columns, rows, total, sort, setSort, columnOptions } = useLibraryTableStore();
  const { page, setPage, rowsPerPage, applyRowsPerPage } = useLibraryTableStore();

  const openItemDialog = useLibraryItemFormStore((state) => state.handleOpen);
  const setPoster = useLibraryItemFormStore((state) => state.setPoster);

  const dataTableProps = { rows, columns, columnOptions, sort, setSort, selectedItemId, setSelectedItemId };
  const paginationProps = { total, page, rowsPerPage, setPage, setRowsPerPage: applyRowsPerPage };

  const requestLibraries = useLibrariesGetRequest();
  const requestItems = useLibraryAllItemsGetRequest();
  const requestItem = useLibraryItemGetRequest();
  const deleteItemRequest = useLibraryItemDeleteRequest();

  const getItems = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;

    if (selectedLibraryId) {
      void requestItems.fetch(undefined, { id: selectedLibraryId });
    }
  }, [getSelectedLibrary, requestItems]);

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

  const handleItemCreate = () => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId) {
      return false;
    }

    openItemDialog(selectedLibraryId);
  };

  const handleItemEdit = () => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId || !selectedItemId) {
      return false;
    }

    requestItem.setResponseEvents({
      onSuccess: (libraryItem) => {
        console.log("libraryItem", libraryItem.data.item);
        setPoster(libraryItem.data.poster);
        openItemDialog(selectedLibraryId, libraryItem.data.item);
      },
    });

    void requestItem.fetch(undefined, { id: selectedLibraryId, item: selectedItemId });
  };

  const handleItemDelete = () => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId || !selectedItemId) {
      return false;
    }

    confirmDialog({
      message: t("confirm.deleteLibraryItem"),
      // subjectItem: item?.[columns[0].label] as string,
      onConfirm: async () => {
        deleteItemRequest.setResponseEvents({
          onSuccess: () => getItems(),
        });

        await deleteItemRequest.fetch(undefined, { id: selectedLibraryId, item: selectedItemId }).then(() =>
          enqueueSnack({
            type: "success",
            message: t("notifications.libraryItemDeleted", { title: "555" }),
          }),
        );
      },
    });
  };

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
            onClick={handleItemCreate}
            disabled={!getSelectedLibrary()?.id}
            children={t("libraryItem.title.create")}
          />
        </StyledHeaderBox>
        <Paper elevation={3} sx={{ height: { xs: "calc(100vh - 148px)", sm: "calc(100vh - 160px)" } }}>
          {requestLibraries.status === "LOADING" || requestItems.status === "LOADING" ? (
            <LoadingOverlayInner />
          ) : requestLibraries.status === "FAILED" || (requestLibraries.status === "SUCCESS" && !libraries.length) ? (
            <LibrariesEmptyState />
          ) : (
            <StyledTableBox>
              <DataTableVirtualized {...dataTableProps} />
              <DataTablePagination {...paginationProps} />
            </StyledTableBox>
          )}
        </Paper>
      </Container>
      <LibraryDrawer handleItemEdit={handleItemEdit} handleItemDelete={handleItemDelete} />
      <LibraryCreateDialog />
      <LibraryItemDialog />
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
