import { Container, Paper, Typography } from "@mui/material";
import { useState } from "react";

import { AppNavbar } from "../components";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { DataTableWindowed } from "../components/tables/DataTableWindowed";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";
import { DataTable } from "../components/tables/DataTable";

export const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore();

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Typography variant="h4" paragraph>
          Movies
        </Typography>
        <Paper elevation={3}>
          <DataTableVirtualized
            loading={loading}
            containerSx={{ height: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 206px)" } }}
            componentProps={{
              table: {
                size: "small",
                // sx: { height: 400 },
              },
            }}
          />

          {/*<DataTable*/}
          {/*  loading={loading}*/}
          {/*  containerSx={{ height: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 206px)" } }}*/}
          {/*/>*/}
        </Paper>
      </Container>
    </>
  );
};
