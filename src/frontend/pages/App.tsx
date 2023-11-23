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
import { confirmDialog, enqueueSnack } from "../core/actions";

export const App = () => {
  const { t } = useTranslation();
  const dataFetchedRef = useRef(false);

  const getSelectedLibrary = useLibraryListStore((state) => state.getSelectedLibrary);
  const { columns, rows, total, sort, setSort, columnOptions } = useLibraryTableStore();
  const { page, setPage, rowsPerPage, applyRowsPerPage } = useLibraryTableStore();

  const { selectedItemId, setSelectedItemId } = usePreviewDrawerStore();
  const openItemDialog = useLibraryItemFormStore((state) => state.handleOpen);

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

  const handleItemEdit = () => {
    if (!selectedItemId) {
      return false;
    }

    openItemDialog(true);
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
            onClick={() => openItemDialog()}
            children={t("libraryItem.title.create")}
          />
        </StyledHeaderBox>
        <Paper elevation={3} sx={{ height: { xs: "calc(100vh - 148px)", sm: "calc(100vh - 160px)" } }}>
          {requestLibraries.status === "LOADING" || requestItems.status === "LOADING" ? (
            <LoadingOverlayInner />
          ) : (
            <StyledTableBox>
              <DataTableVirtualized {...dataTableProps} />
              <DataTablePagination {...paginationProps} />
            </StyledTableBox>
          )}
        </Paper>
      </Container>
      <LibraryDrawer handleItemEdit={handleItemEdit} handleItemDelete={handleItemDelete} />
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
