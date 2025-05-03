import { blue, red, yellow } from "@mui/material/colors";

import type { CssVarsThemeOptions, PaletteMode, PaletteOptions, ThemeOptions } from "@mui/material";
import type { TypographyVariantsOptions } from "@mui/material/styles";

type DesignTokensOptions = Omit<ThemeOptions, "components"> &
  Pick<CssVarsThemeOptions, "defaultColorScheme" | "colorSchemes" | "components">;

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

const typography: TypographyVariantsOptions = {};

// Compose a theme instance.
export const getDesignTokens = (mode: PaletteMode): DesignTokensOptions => ({
  // colorSchemes: {
  //   dark: true,
  //   light: true,
  // },
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
    // MuiDialog: {
    //   styleOverrides: {
    //     container: {
    //       minWidth: 360,
    //     },
    //   },
    // },
    MuiDialogActions: {
      styleOverrides: {
        spacing: {
          padding: "16px 24px",
        },
      },
    },
  },
});
