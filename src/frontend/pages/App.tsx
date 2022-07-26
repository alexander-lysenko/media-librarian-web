import { MenuOpenOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import React from "react";

import { NavbarProfiler } from "../components/NavbarProfiler";
import { SidebarDrawer } from "../components/SidebarDrawer";
import { ColoredRating } from "../components/tables/ColoredRating";
import { DataTable } from "../components/tables/DataTable";
import { DataColumn, DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
// import { SidebarDrawer } from "../components/SidebarDrawer";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";

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
    component: (value: number) => <ColoredRating readOnly size={5} value={value} />,
  },
  {
    id: "Отзыв",
    label: "Отзыв",
    contentCellSx: { maxWidth: 250 },
  },
];

const dataRows: DataRow[] = movies;
export const App = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore();
  const libStore = useLibraryTableStore();

  console.log(libStore);
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
          rows={dataRows.concat(dataRows, dataRows, dataRows, dataRows, dataRows, dataRows, dataRows, dataRows)}
          containerSx={{ height: "80vh" }}
          loading={loading}
          page={libStore.page}
          rowsPerPage={libStore.rowsPerPage}
          selectedItem={libStore.selectedItem}
          setPage={libStore.setPage}
          setRowsPerPage={libStore.setRowsPerPage}
          setSelectedItem={libStore.setSelectedItem}
          setSort={libStore.setSort}
          sort={libStore.sort}
          total={libStore.total}
        />
      </Box>
    </Box>
  );
};
