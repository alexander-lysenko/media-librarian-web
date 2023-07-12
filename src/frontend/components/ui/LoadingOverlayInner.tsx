import { Box, CircularProgress } from "@mui/material";
import { SxProps } from "@mui/system";

/***
 * Customizable loading overlay, designed to be embedded
 * @param sx
 * @constructor
 */
export const LoadingOverlayInner = ({ sx }: { sx?: SxProps }) => {
  const initialSx: SxProps = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box className="loading-overlay" sx={{ ...initialSx, ...sx }}>
      <CircularProgress disableShrink />
    </Box>
  );
};
