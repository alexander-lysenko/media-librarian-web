import { Container, Paper } from "@mui/material";
import React, { useState } from "react";

import { AppNavbar } from "../components";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { DataColumn, DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";
import { DataTable } from "../components/tables/DataTable";

const columns: DataColumn[] = [
  {
    id: "Название",
    label: "Название",
    contentCellStyle: { maxWidth: 150 },
    component: "line",
  },
  {
    id: "Описание",
    label: "Описание",
    contentCellStyle: { maxWidth: 250 },
    component: "text",
  },
  {
    id: "Дата выхода",
    label: "Дата выхода Дата выхода",
    headerCellStyle: { textAlign: "right", maxWidth: 150 },
    contentCellStyle: { textAlign: "right", maxWidth: 150 },
    component: "date",
  },
  {
    id: "Дата просмотра",
    label: "Дата просмотра",
    contentCellStyle: { maxWidth: 150 },
    component: "datetime",
  },
  {
    id: "Оценка",
    label: "Оценка",
    contentCellStyle: { maxWidth: 150 },
    component: "rating5",
    // component: "text",
  },
  {
    id: "Отзыв",
    label: "Отзыв",
    contentCellStyle: { maxWidth: 250 },
    component: "text",
  },
  //
  // {
  //   id: "Название",
  //   label: "Название",
  //   contentCellStyle: { maxWidth: 150 },
  //   component: "line",
  // },
  // {
  //   id: "Описание",
  //   label: "Описание",
  //   contentCellStyle: { maxWidth: 250 },
  //   component: "text",
  // },
  // {
  //   id: "Дата выхода",
  //   label: "Дата выхода Дата выхода",
  //   headerCellStyle: { textAlign: "right", maxWidth: 150 },
  //   contentCellStyle: { textAlign: "right", maxWidth: 150 },
  //   component: "date",
  // },
  // {
  //   id: "Дата просмотра",
  //   label: "Дата просмотра",
  //   contentCellStyle: { maxWidth: 150 },
  //   component: "datetime",
  // },
  // {
  //   id: "Оценка",
  //   label: "Оценка",
  //   contentCellStyle: { maxWidth: 150 },
  //   // component: "rating5",
  //   component: "text",
  // },
  // {
  //   id: "Отзыв",
  //   label: "Отзыв",
  //   contentCellStyle: { maxWidth: 250 },
  //   component: "text",
  // },
];

const dataRows: DataRow[] = Array.from(movies);

for (let i = 1; i < 10000; i++) {
  dataRows.push(...Array.from(movies));
}

export const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open: isDrawerOpen, setOpen: setDrawerOpen } = useSidebarDrawerOpenStore();
  const libStore = useLibraryTableStore();

  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl">
        <Paper elevation={3}>
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
            containerSx={{ height: { xs: "calc(100vh - 140px)", sm: "calc(100vh - 156px)" } }}
            componentProps={{
              table: {
                size: "small",
                // sx: { height: 400 },
              },
              // tableContainer: {
              // sx: { height: 400 },
              // },
            }}
          />
          {/*<DataTable*/}
          {/*  columns={columns}*/}
          {/*  rows={dataRows}*/}
          {/*  loading={loading}*/}
          {/*  selectedItem={libStore.selectedItem}*/}
          {/*  setSelectedItem={libStore.setSelectedItem}*/}
          {/*  sorting={{*/}
          {/*    sort: libStore.sort,*/}
          {/*    setSort: libStore.setSort,*/}
          {/*  }}*/}
          {/*  pagination={{*/}
          {/*    page: libStore.page,*/}
          {/*    rowsPerPage: libStore.rowsPerPage,*/}
          {/*    total: libStore.total,*/}
          {/*    setPage: libStore.setPage,*/}
          {/*    setRowsPerPage: libStore.setRowsPerPage,*/}
          {/*  }}*/}
          {/*  containerSx={{ height: { xs: "calc(100vh - 140px)", sm: "calc(100vh - 156px)" } }}*/}
          {/*/>*/}
        </Paper>
      </Container>
    </>
  );
};
