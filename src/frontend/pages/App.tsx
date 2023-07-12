import { Box, Container, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { AppNavbar } from "../components";
import { DataTable } from "../components/tables/DataTable";
import { DataTablePagination } from "../components/tables/DataTablePagination";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { LoadingOverlayInner } from "../components/ui/LoadingOverlayInner";
import { DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";

export const App = () => {
  const [columns, rows, total, setTotal, setRows] = useLibraryTableStore(
    (state) => [state.columns, state.rows, state.total, state.setTotal, state.setRows],
    shallow,
  );
  const [sort, setSort, columnOptions] = useLibraryTableStore(
    (state) => [state.sort, state.setSort, state.columnOptions],
    shallow,
  );
  const [page, setPage, rowsPerPage, setRowsPerPage] = useLibraryTableStore(
    (state) => [state.page, state.setPage, state.rowsPerPage, state.setRowsPerPage],
    shallow,
  );

  const [loading, setLoading] = useState<boolean>(true);
  // const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore();

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
        <Typography variant="h4" paragraph>
          Movies
        </Typography>
        <Paper elevation={3}>
          {loading ? (
            <LoadingOverlayInner sx={{ height: { xs: "calc(100vh - 148px)", sm: "calc(100vh - 160px)" } }} />
          ) : (
            <Box sx={{ width: "100%" }}>
              <DataTableVirtualized
                rows={rows}
                columns={columns}
                columnOptions={columnOptions}
                sort={sort}
                setSort={setSort}
                containerSx={{ height: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 206px)" } }}
              />
              <DataTablePagination
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
              />
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};
