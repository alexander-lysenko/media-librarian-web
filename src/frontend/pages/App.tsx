import { MenuOpenOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Box, IconButton, Rating, Toolbar, Typography, useTheme } from "@mui/material";
import React from "react";

import { NavbarProfiler } from "../components/NavbarProfiler";
import { DataColumn, DataRow, DataTable } from "../components/tables/DataTable";
import movies from "../mock/movies.json";
// import { SidebarDrawer } from "../components/SidebarDrawer";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";
import { SidebarDrawer } from "../components/SidebarDrawer";
import { ColoredRating } from "../components/tables/ColoredRating";

const columns: DataColumn[] = [
  {
    id: "Название",
    label: "Название",
  },
  {
    id: "Описание",
    label: "Описание",
    contentCellSx: { maxWidth: 250 },
  },
  {
    id: "Дата выхода",
    label: "Дата выхода",
    headerCellSx: { textAlign: "right" },
  },
  {
    id: "Дата просмотра",
    label: "Дата просмотра",
  },
  {
    id: "Оценка",
    label: "Оценка",
    component: (value) => <ColoredRating readOnly size={5} value={value} />,
  },
  {
    id: "Отзыв",
    label: "Отзыв",
    contentCellSx: { maxWidth: 250 },
  },
];

const dataRows: DataRow[] = movies;
export const App = () => {
  const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore((state) => state);

  const theme = useTheme();
  const viewPort = theme.spacing(8);
  console.log(theme.spacing);

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
      <Box component="nav" sx={{ width: { sm: 300 }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <SidebarDrawer />
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <AppBar component="header" position="fixed">
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer" onClick={() => setDrawerOpen(!isDrawerOpen)}>
              {isDrawerOpen ? <MenuOpenOutlined /> : <MenuOutlined />}
            </IconButton>
            <Box sx={{ flex: "1 0 auto" }}>{"MUI"}</Box>
            <NavbarProfiler />
          </Toolbar>
        </AppBar>
        <DataTable
          columns={columns}
          rows={dataRows}
          containerSx={{ height: "80vh" }}
          onRowClick={(e, i) => console.log(e, i)}
        />
      </Box>
    </Box>
  );
};
