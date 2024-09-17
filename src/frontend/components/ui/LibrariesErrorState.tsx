import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ErrorOutlined } from "../icons";

export const LibrariesErrorState = () => {
  const { t } = useTranslation();

  return (
    <Box p={2} height="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <ErrorOutlined sx={{ fontSize: 96 }} />
      <Typography component="p" variant="body2" textAlign="center">
        {t("app.errorOccurred")}
      </Typography>
    </Box>
  );
};
