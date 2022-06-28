import { Box, Container, Grid, Typography } from "@mui/material";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * To get this component worked properly (i.e. real sticky footer), you must set the height
 * (actual or minimal) of parent component as 100vh using the 'sx' object. The parent component
 * should use flexbox as well. Examples:
 * <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
 * <Grid container component="main" sx={{ height: "100vh" }}>
 */
export const StickyFooter = ({ children }: Props) => {
  return (
    <FooterWrapper>
      <Grid container justifyContent="center" maxWidth="xs">
        <Typography variant="body2" color="text.secondary">
          {children}
        </Typography>
      </Grid>
    </FooterWrapper>
  );
};

const FooterWrapper = ({ children }: Props) => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
      }}
    >
      {children}
    </Box>
  );
};
