import { Box, Grid, Theme, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * To get this component worked properly (i.e. real sticky footer experience), you must set the height
 * (actual or minimal) of parent component as 100vh using the 'sx' prop.
 * The parent component should use CSS Flex Box as well.
 *
 * Examples:
 * <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
 *   <StickyFooter/>{content}<StickyFooter>
 * </Box>
 * // or
 * <Grid container component="main" sx={{ height: "100vh" }}>
 *   <StickyFooter/>{content}<StickyFooter>
 * </Grid>
 */
export const StickyFooter = ({ children }: Props) => {
  return (
    <FooterWrapper>
      <Grid container justifyContent="center" maxWidth="xs">
        <Typography component="div" color="text.secondary">
          {children}
        </Typography>
      </Grid>
    </FooterWrapper>
  );
};

const FooterWrapper = ({ children }: Props) => {
  const backgroundColor = (theme: Theme) =>
    theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800];

  return <Box component="footer" sx={{ py: 3, px: 2, mt: "auto", backgroundColor }} children={children} />;
};
