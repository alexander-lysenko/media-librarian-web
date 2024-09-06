import { Button, styled, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import { InboxOutlined } from "../icons";

export const LibrariesEmptyState = () => {
  const { t } = useTranslation();
  const setLibraryDialogOpen = useLibraryCreateFormStore((state) => state.setOpen);
  const handleOpenLibraryDialog = () => setLibraryDialogOpen(true);

  return (
    <Wrapper sx={{ p: 2 }}>
      <InboxOutlined sx={{ fontSize: 96 }} />
      <Typography variant="body2" textAlign="center" sx={{ mb: 1.5 }}>
        {t("myLibraries.noLibraries")}
      </Typography>
      <Button variant="outlined" children={t("myLibraries.createLibrary")} onClick={handleOpenLibraryDialog} />
    </Wrapper>
  );
};

const Wrapper = styled("div")({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
});
