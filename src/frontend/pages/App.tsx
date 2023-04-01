import { Container, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

import { AppNavbar } from "../components";
import { ColoredRating } from "../components/tables/ColoredRating";
import { DataTableVirtualized } from "../components/tables/DataTableVirtualized";
import { DataColumn, DataRow } from "../core/types";
import movies from "../mock/movies.json";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { useSidebarDrawerOpenStore } from "../store/useSidebarDrawerOpenStore";

const columns: DataColumn[] = [
  {
    id: "Название",
    label: "Название",
    contentCellSx: { maxWidth: 150 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Описание",
    label: "Описание",
    contentCellSx: { maxWidth: 250 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Дата выхода",
    label: "Дата выхода Дата выхода",
    headerCellSx: { textAlign: "right", maxWidth: 150 },
    contentCellSx: { textAlign: "right", maxWidth: 150 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Дата просмотра",
    label: "Дата просмотра",
    contentCellSx: { maxWidth: 150 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Оценка",
    label: "Оценка",
    component: ({ value }: { value: number }) => <ColoredRating readOnly size={5} value={value} />,
    contentCellSx: { maxWidth: 150 },
  },
  {
    id: "Отзыв",
    label: "Отзыв",
    contentCellSx: { maxWidth: 250 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  //
  {
    id: "Название",
    label: "Название",
    contentCellSx: { maxWidth: 150 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Описание",
    label: "Описание",
    contentCellSx: { maxWidth: 250 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Дата выхода",
    label: "Дата выхода Дата выхода",
    headerCellSx: { textAlign: "right", maxWidth: 150 },
    contentCellSx: { textAlign: "right", maxWidth: 150 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Дата просмотра",
    label: "Дата просмотра",
    contentCellSx: { maxWidth: 150 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
  {
    id: "Оценка",
    label: "Оценка",
    component: ({ value }: { value: number }) => <ColoredRating readOnly size={5} value={value} />,
    contentCellSx: { maxWidth: 150 },
  },
  {
    id: "Отзыв",
    label: "Отзыв",
    contentCellSx: { maxWidth: 250 },
    component: ({ value }: { value: string }) => (
      <Typography variant="body2" noWrap>
        {value}
      </Typography>
    ),
  },
];

const dataRows: DataRow[] = Array.from(movies);

for (let i = 1; i < 1000; i++) {
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
        </Paper>
      </Container>
    </>
  );
};
