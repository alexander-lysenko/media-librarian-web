import { Box, Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { AppNavbar } from "../components";
import { DataTable } from "../components/tables/DataTable";
import { DataTablePagination } from "../components/tables/DataTablePagination";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";

export const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore();

  const { columns, rows, columnsOptions, sort, setSort, page, setPage, rowsPerPage, setRowsPerPage } =
    useLibraryTableStore((state) => state);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Typography variant="h4" paragraph>
          Movies
        </Typography>
        <Paper elevation={3}>
          <Box sx={{ width: "100%" }}>
            <DataTableVirtualized
              loading={loading}
              rows={rows}
              columns={columns}
              columnsOptions={columnsOptions}
              sort={sort}
              setSort={setSort}
              containerSx={{ height: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 206px)" } }}
            />
            <DataTablePagination
              total={rows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
};
