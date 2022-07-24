import { MenuOpenOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Box, IconButton, Rating, Toolbar, Typography } from "@mui/material";
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
    component: (value) => <ColoredRating size={5} value={value} />,
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

  return (
    <Box>
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
        <Toolbar />
        <DataTable columns={columns} rows={dataRows} onRowClick={(e, i) => console.log(e, i)} />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
          velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu
          scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
          lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
          ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
        </Typography>
      </Box>
    </Box>
  );
};
