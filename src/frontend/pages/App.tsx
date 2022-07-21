import { Grid } from "@mui/material";
import React from "react";

import { SidebarDrawer } from "../components/SidebarDrawer";

export const App = () => {
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <SidebarDrawer />
    </Grid>
  );
};
