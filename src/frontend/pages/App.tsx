import { Container, Paper } from "@mui/material";
import React, { useState } from "react";

import { AppNavbar } from "../components";
import { ColoredRating } from "../components/tables/ColoredRating";
import { DataTable } from "../components/tables/DataTable";
import { DataColumn, DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";

const columns: DataColumn[] = [
  {
    id: "Название",
    label: "Название",
    contentCellSx: { maxWidth: 150 },
  },
  {
    id: "Описание",
    label: "Описание",
    contentCellSx: { maxWidth: 250 },
  },
  {
    id: "Дата выхода",
    label: "Дата выхода Дата выхода",
    headerCellSx: { textAlign: "right", maxWidth: 50 },
    contentCellSx: { textAlign: "right" },
  },
  {
    id: "Дата просмотра",
    label: "Дата просмотра",
    contentCellSx: { maxWidth: 150 },
  },
  {
    id: "Оценка",
    label: "Оценка",
    component: (value: number) => <ColoredRating readOnly size={5} value={value} />,
    contentCellSx: { maxWidth: 50 },
  },
  {
    id: "Отзыв",
    label: "Отзыв",
    contentCellSx: { maxWidth: 250 },
  },
];

const dataRows: DataRow[] = Array.from(movies);

for (let i = 0; i <= 50; i++) {
  dataRows.push(...Array.from(movies));
}

export const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore();
  const libStore = useLibraryTableStore();

  console.log(libStore);
  console.log(dataRows);
  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Paper elevation={1}>
          <DataTableVirtualized
            columns={columns}
            rows={dataRows}
            loading={loading}
            selectedItem={libStore.selectedItem}
            setSelectedItem={libStore.setSelectedItem}
            sorting={{
              sort: libStore.sort,
              setSort: libStore.setSort,
            }}
            pagination={{
              page: libStore.page,
              rowsPerPage: libStore.rowsPerPage,
              total: libStore.total,
              setPage: libStore.setPage,
              setRowsPerPage: libStore.setRowsPerPage,
            }}
            componentProps={{
              table: {
                size: "small",
                sx: { height: 400 },
              },
              tableContainer: {
                sx: { height: 400 },
              },
            }}
          />
        </Paper>
      </Container>
    </>
  );
};
