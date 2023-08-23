import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { PaletteMode } from "@mui/material";

type ColorOptions = string;

export interface ThemeState {
  mode: PaletteMode;
  color: ColorOptions;
  setMode: (mode: PaletteMode) => void;
  setColor: (color: ColorOptions) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: get()?.mode || "dark",
      color: get()?.color || "teal",
      setMode: (mode: PaletteMode) => set(() => ({ mode })),
      setColor: (color: ColorOptions) => set(() => ({ color })),
    }),
    {
      name: "uiThemePreferences", // unique name
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
