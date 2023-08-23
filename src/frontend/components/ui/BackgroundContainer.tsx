import { Grid } from "@mui/material";

import type { Theme } from "@mui/material";

/**
 * The component can be used as a Container with background-image taken randomly from Unsplash.
 * @constructor
 */
export const BackgroundContainer = () => (
  <Grid
    item
    xs={false}
    sm={4}
    md={7}
    xl={8}
    sx={{
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundImage: "url(https://source.unsplash.com/random?movie-posters)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
);
