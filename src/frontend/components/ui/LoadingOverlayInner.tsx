import { Box, CircularProgress } from "@mui/material";
import { SxProps } from "@mui/system";

export const LoadingOverlayInner = () => {
  const sx: SxProps = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box className="loading-overlay" sx={sx}>
      <CircularProgress disableShrink />
    </Box>
  );
};
