import create from "zustand";

type SortDirection = "asc" | "desc";

type SortOptions = {
  column: string;
  direction: SortDirection;
};

type LibraryTableState = {
  columns: any;
  rows: any;
  page: number;
  rowsPerPage: number;
  total: number;
  sort: SortOptions | undefined;
  selectedItem: number | null;

  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setTotal: (total: number) => void;
  setSort: (sort?: SortOptions) => void;
  setSelectedItem: (item: number | null) => void;

  columnsAction: () => void;
  rowsAction: () => void;
};

export const useLibraryTableStore = create<LibraryTableState>((set, get) => ({
  columns: [],
  rows: [],
  page: 0,
  rowsPerPage: -1,
  total: 0,
  sort: undefined,
  selectedItem: null,
  setPage: (page) => set(() => ({ page })),
  setRowsPerPage: (rowsPerPage) => set(() => ({ rowsPerPage })),
  setTotal: (total) => set(() => ({ total })),
  setSort: (sort) => set(() => ({ sort })),
  setSelectedItem: (item) => set(() => ({ selectedItem: item })),
  columnsAction: () => {
    console.log("columnsAction");
  },
  rowsAction: () => {
    console.log("rowsAction");
  },
}));
