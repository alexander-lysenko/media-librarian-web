import { PaletteMode, PaletteOptions, ThemeOptions } from "@mui/material";
import { red, yellow } from "@mui/material/colors";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const lightPalette: PaletteOptions = {
  primary: {
    main: "#556cd6",
  },
  secondary: {
    main: "#19857b",
  },
  warning: {
    main: yellow.A400,
  },
  error: {
    main: red.A400,
  },
};

const darkPalette: PaletteOptions = {
  primary: {
    main: "#adb7f8",
  },
  secondary: {
    main: "#19857b",
  },
  warning: {
    main: yellow.A400,
  },
  error: {
    main: red.A400,
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
  },
});
