import { PaletteMode } from "@mui/material";
import create, { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type ColorOptions = string;

export interface ThemeState {
  mode: PaletteMode;
  color: ColorOptions;
  setMode: (mode: PaletteMode) => void;
  setColor: (color: ColorOptions) => void;
}

type StorePersistFix = (
  config: StateCreator<ThemeState>,
  options: PersistOptions<ThemeState>,
) => StateCreator<ThemeState>;

export const useThemeStore = create<ThemeState>(
  (persist as unknown as StorePersistFix)(
    (set, get) => ({
      mode: get()?.mode || "dark",
      color: get()?.color || "teal",
      setMode: (mode: PaletteMode) => set(() => ({ mode })),
      setColor: (color: ColorOptions) => set(() => ({ color })),
    }),
    {
      name: "uiThemePreferences",
      getStorage: () => localStorage,
    },
  ),
);
