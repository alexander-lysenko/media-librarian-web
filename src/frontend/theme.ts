import { PaletteMode } from "@mui/material";
import { red, yellow } from "@mui/material/colors";

const lightPalette = {
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

const darkPalette = {
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

const typography = {};

// Compose a theme instance.
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light" ? lightPalette : darkPalette),
    // ...typography,
  },
});
