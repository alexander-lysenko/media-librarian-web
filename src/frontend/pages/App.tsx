import { Container, Paper, Typography } from "@mui/material";
import { useState } from "react";

import { AppNavbar } from "../components";
import { DataTable } from "../components/tables/DataTable";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";

export const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
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
            componentProps={{}}
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
