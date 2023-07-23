import { AddCircleOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, styled, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { AppNavbar } from "../components";
import { LibraryDrawer } from "../components/libraryItem";
import { LibraryItemDialog } from "../components/modals";
import { DataTablePagination } from "../components/tables/DataTablePagination";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryItemsGetRequest } from "../requests/useLibraryItemRequests";
import { useLibraryDrawerStore } from "../store/useLibraryDrawerStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";
import { useLibraryStore } from "../store/useLibraryStore";
import { useLibraryTableStore } from "../store/useLibraryTableStore";

export const App = () => {
  const { t } = useTranslation();

  const { id: libraryId, title: libraryName } = useLibraryStore();
  const { columns, rows, total, setTotal, setRows, sort, setSort, columnOptions } = useLibraryTableStore();
  const { page, setPage, rowsPerPage, setRowsPerPage } = useLibraryTableStore();

  const { selectedItem, setSelectedItem } = useLibraryDrawerStore();
  const [itemDialogOpen, setItemDialogOpen] = useLibraryItemFormStore((state) => [state.open, state.setOpen], shallow);

  const [loading, setLoading] = useState<boolean>(true);
  const dataTableProps = { rows, columns, columnOptions, sort, setSort, selectedItem, setSelectedItem };
  const paginationProps = { total, page, rowsPerPage, setPage, setRowsPerPage };

  // const { fetch: request, status } = useLibraryItemsGetRequest();

  const requestData = useCallback(() => {
    // https://github.com/pmndrs/zustand#transient-updates-for-often-occurring-state-changes
    console.log("Requesting data...");
    setLoading(true);

    const origDataRows: Omit<DataRow, "id">[] = Array.from(movies);
    const dataRows: DataRow[] = [];
    const rowsLength = rowsPerPage > 0 ? rowsPerPage / 5 : 10000;

    for (let i = 0; i < rowsLength; i++) {
      origDataRows.forEach((item, index) => {
        dataRows.push({
          id: index + 1 + i * origDataRows.length,
          ...item,
          "Movie Title": `${index + 1 + i * origDataRows.length} ${item["Movie Title"]}`,
          "Origin Title": `${index + 1 + i * origDataRows.length} ${item["Origin Title"]}`,
          "IMDB URL": `${index + 1 + i * origDataRows.length} ${item["IMDB URL"]}`,
          Description: `${index + 1 + i * origDataRows.length} ${item["Description"]}`,
        });
      });
    }
    setTimeout(() => {
      setRows(dataRows);
      setTotal(50000);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    useLibraryTableStore.subscribe((state) => [state.sort, state.page, state.rowsPerPage], requestData, {
      equalityFn: shallow,
      fireImmediately: true,
    });
  }, []);

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <StyledHeaderBox>
          <Typography variant="h4" noWrap children={libraryName} />
          <Button
            type="button"
            variant="contained"
            startIcon={<AddCircleOutlined />}
            onClick={() => setItemDialogOpen(true)}
            children={t("libraryItem.title.create")}
          />
        </StyledHeaderBox>
        <Paper elevation={3} sx={{ height: { xs: "calc(100vh - 148px)", sm: "calc(100vh - 160px)" } }}>
          {loading ? (
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
      <LibraryItemDialog
        open={itemDialogOpen}
        handleClose={() => setItemDialogOpen(false)}
        handleSubmitted={() => false}
      />
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
