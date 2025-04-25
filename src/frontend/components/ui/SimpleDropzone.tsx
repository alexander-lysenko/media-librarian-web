import { Box, Paper, styled, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { CloudUploadOutlined } from "../icons";

import type { PaperProps } from "@mui/material";
import type { DragEvent, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export const SimpleDropzone = ({ children, onDrop, ...paperProps }: Props & PaperProps) => {
  const { t } = useTranslation();

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.querySelector("#dropzone-overlay")?.classList.remove("d-none");
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    if ((event.target as HTMLDivElement).closest("#dropzone-overlay") === null) {
      return;
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if ((event.target as HTMLDivElement).closest("#dropzone-overlay") === null) {
      return;
    }
    event.currentTarget.querySelector("#dropzone-overlay")?.classList.add("d-none");
  };

  const handleDropEvent = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.querySelector("#dropzone-overlay")?.classList.add("d-none");

    onDrop?.(event);
  };

  return (
    <StyledDropzone
      {...paperProps}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropEvent}
    >
      <DropzoneOverlay elevation={12} square={false} id="dropzone-overlay" className="d-none">
        <CloudUploadOutlined sx={{ fontSize: 48 }} />
        <Typography variant="h5" textAlign="center">
          {t("fileUpload.dropFileHere")}
        </Typography>
      </DropzoneOverlay>
      <DropzoneArea id="dropzone-area">{children}</DropzoneArea>
    </StyledDropzone>
  );
};

const StyledDropzone = styled(Paper)({
  position: "relative",
  backgroundColor: "transparent",
  backgroundImage: "none",
  padding: "8px 16px",
  overflow: "hidden",
});

const DropzoneOverlay = styled(Paper)({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "2px dashed",
  "& *": {
    pointerEvents: "none",
  },
  "&.d-none": {
    display: "none",
  },
});

const DropzoneArea = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  // maxHeight: 162,
});
