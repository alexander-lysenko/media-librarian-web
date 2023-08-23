import { blue, red, yellow } from "@mui/material/colors";

import type { PaletteMode, PaletteOptions, ThemeOptions } from "@mui/material";
import type { TypographyOptions } from "@mui/material/styles/createTypography";

const lightPalette: PaletteOptions = {
  primary: {
    main: blue["A400"],
  },
  secondary: {
    main: blue["400"],
  },
  warning: {
    main: yellow["A400"],
  },
  error: {
    main: red["A400"],
  },
};

const darkPalette: PaletteOptions = {
  primary: {
    main: blue["700"],
  },
  secondary: {
    main: blue["400"],
  },
  warning: {
    main: yellow["A400"],
  },
  error: {
    main: red["A400"],
  },
};

const typography: TypographyOptions = {};

// Compose a theme instance.
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light" ? lightPalette : darkPalette),
  },
  typography,
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          "& .MuiTablePagination-toolbar": {
            height: 48,
            minHeight: 48,
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        spacing: {
          padding: "16px 24px",
        },
      },
    },
  },
});
