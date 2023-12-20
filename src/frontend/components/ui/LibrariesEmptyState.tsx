import { InboxOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";

export const LibrariesEmptyState = () => {
  const { t } = useTranslation();
  const setLibraryDialogOpen = useLibraryCreateFormStore((state) => state.setOpen);
  const handleOpenLibraryDialog = () => setLibraryDialogOpen(true);

  return (
    <Box p={2} height="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <InboxOutlined sx={{ fontSize: 96 }} />
      <Typography paragraph variant="body2" textAlign="center">
        {t("myLibraries.noLibraries")}
      </Typography>
      <Button variant="outlined" children={t("myLibraries.createLibrary")} onClick={handleOpenLibraryDialog} />
    </Box>
  );
};
