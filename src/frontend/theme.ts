import { red, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
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
  },
});

export default theme;
