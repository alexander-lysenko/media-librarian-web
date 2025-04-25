import { Box, Button, CardMedia, Grid, LinearProgress, Paper, styled, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { axiosFetch } from "../../core";
import { enqueueSnack } from "../../core/actions";
import { CloudUploadOutlined, ContentPasteOutlined, UploadFileOutlined } from "../icons";
import { SimpleDropzone } from "./SimpleDropzone";

import type { FetchRequestConfig } from "../../core";
import type { SxProps } from "@mui/system";
import type { ChangeEvent, ClipboardEvent, DragEvent, SyntheticEvent } from "react";

export const PosterUploadInputBox = () => {
  const { t } = useTranslation();
  const [blobImage, setBlobImage] = useState<Blob | null>(null);
  const [isUploading, setUploading] = useState<boolean>(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const urlTextInput = useRef<HTMLInputElement>(null);

  const handleDropEvent = (event: DragEvent<HTMLDivElement>) => {
    const file = event.dataTransfer.files[0] || event.nativeEvent.dataTransfer?.files[0];
    // console.log(event.dataTransfer, file);
    // console.log(event.target);
    uploadFile(file);
  };

  const handleBrowseClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileBrowse = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    uploadFile(file);
  };

  const handleFromClipboard = async (event: ClipboardEvent<HTMLInputElement>) => {
    const item = event.clipboardData?.items[0];
    console.log(item);
    if (!item) {
      return;
    }
    if (item.type.indexOf("image") === 0) {
      event.preventDefault();
      const file = item.getAsFile() as File;
      uploadFile(file);
    }
    if (item.type === "text/plain") {
      item.getAsString((text) => {
        try {
          const url = new URL(text);
          ["http:", "https:", "ftp:", "file:"].includes(url.protocol) && downloadByUrl(url.toString());
        } catch (e) {
          console.error(e);
          return;
        }
      });
    }
  };

  const handlePasteBtnClick = (event: SyntheticEvent) => {
    urlTextInput.current?.focus();
    urlTextInput.current?.dispatchEvent(
      new KeyboardEvent("keydown", {
        ctrlKey: true,
        code: "KeyV",
      }),
    );
  };

  const uploadFile = (file?: Blob) => {
    if (!file) {
      return;
    }

    const isFormatSupported = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    const isSizeUnderLimit = file.size / 1024 / 1024 < 2;

    switch (false) {
      case isFormatSupported:
        enqueueSnack({ type: "error", message: t("fileUpload.unsupportedFormat") });
        return;
      case isSizeUnderLimit:
        enqueueSnack({ type: "error", message: t("fileUpload.fileSizeExceed", { n: 2 }) });
        return;
    }

    setBlobImage(file);
  };

  // todo: rework that and fix CORS issue
  const downloadByUrl = async (url: string) => {
    const config: FetchRequestConfig<undefined> = { url, method: "GET", responseType: "blob", withCredentials: false };
    const file = await axiosFetch<undefined, Blob>(config, {
      onSuccess: (response) => {
        console.log(response);
        return response;
      },
      onError: (error) => {
        console.log(error);
      },
    });

    if (file) {
      console.log("File Downloaded");
      console.log(file);
      setBlobImage(file as Blob);
    }
  };

  // const handleFromClipboard = async (event: SyntheticEvent) => {
  //   const clipboardItems = await navigator.clipboard.read();
  //   const items: ClipboardItems = [].slice.call(clipboardItems).filter((item: ClipboardItem) => {
  //     return item !== null && (item.types.includes("image/png") || item.types.includes("text/plain"));
  //   });
  //
  //   if (items.length === 0) {
  //     event.preventDefault();
  //     return;
  //   }
  //
  //   if (items[0].types.includes("text/plain")) {
  //     const url = await (await items[0].getType("text/plain")).text();
  //     const response = await fetch("/" + url);
  //     const data = await response.blob();
  //     setBlobImage(data);
  //     // const metadata = { type: data.type };
  //     // const filename = url.replace(/\?.+/, "").split("/").pop() as string;
  //     // return new File([data], filename, metadata);
  //   }
  //
  //   console.log(items[0]);
  //   // setBlobImage(items[0]);
  // };

  // const handleChange = (event: SyntheticEvent, newValue: number) => {
  //   setTab(newValue);
  // };

  // useEffect(() => {
  //   const urlTextInputTarget = urlTextInput.current;
  //   urlTextInputTarget?.addEventListener("paste", handleFromClipboard);
  //   return () => {
  //     urlTextInputTarget?.removeEventListener("paste", handleFromClipboard);
  //   };
  // }, []);

  // const startAdornment = (
  //   <InputAdornment position="start" sx={{ cursor: "pointer" }}>
  //     <Tooltip title={"Choose File"} placement="top" arrow>
  //       <IconButton size="small" onClick={() => true}>
  //         <AttachFileOutlined fontSize="small" />
  //       </IconButton>
  //     </Tooltip>
  //   </InputAdornment>
  // );

  const cardMediaSx: SxProps = {
    height: 178,
    width: 178,
    backgroundSize: "contain",
    filter: "blur(2px)",
  };

  const posterUrl = [
    "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/2weak2slow2/phpza5oxW.jpeg",
    "https://i-a.d-cd.net/PX_ZUBJvag0Kncb8wxahJl8UAKY-1920.jpg",
  ][1];

  return (
    <Grid container spacing={1} flexGrow={1} height={180}>
      <Grid size={"auto"} component={StyledPosterPreviewPaper} square={false} variant="outlined">
        <CardMedia sx={cardMediaSx} image={blobImage ? URL.createObjectURL(blobImage) : posterUrl} />
        <StyledLinearProgress variant="determinate" value={67} />
      </Grid>
      <Grid size={"grow"} component={SimpleDropzone} square={false} variant="outlined" onDrop={handleDropEvent}>
        <DropFileBanner>
          <CloudUploadOutlined sx={{ fontSize: 48, mr: 2 }} />
          <Box display="flex" flexDirection="column">
            <Typography variant="body1" fontSize="1.25rem" lineHeight={1.3}>
              {t("fileUpload.dragDropFileHere")}
            </Typography>
            <Typography variant="subtitle2" textAlign="center">
              {t("commonEmbed.or")}
            </Typography>
          </Box>
        </DropFileBanner>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            children={t("fileUpload.browse")}
            startIcon={<UploadFileOutlined />}
            onClick={handleBrowseClick}
          />
          <HiddenFileInput type="file" ref={hiddenFileInput} onChange={handleFileBrowse} />
          <Button
            variant="outlined"
            children={t("fileUpload.paste")}
            endIcon={<ContentPasteOutlined />}
            onClick={handlePasteBtnClick}
          />
        </Box>
        <TextField
          inputRef={urlTextInput}
          size="small"
          margin="dense"
          fullWidth
          placeholder={"Paste URL or image content"}
          error
          helperText={
            "Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused "
          }
          slotProps={{
            inputLabel: { shrink: true },
            formHelperText: {
              title: "asdasdfsdfghdfgjkgfdsafhg",
              sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            },
          }}
          onPaste={handleFromClipboard}
        />
      </Grid>
    </Grid>
  );
};

const StyledPosterPreviewPaper = styled(Paper)({
  backgroundColor: "transparent",
  backgroundImage: "radial-gradient(transparent, transparent, rgba(0, 0, 0, .05))",
  position: "relative",
});

const StyledLinearProgress = styled(LinearProgress)({
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: 8,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
});

const DropFileBanner = styled(Box)(({ theme }) => ({
  display: "flex",
  // flexDirection: "column",
  justifyContent: "center",
  marginBottom: 8,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
  "@media(hover: none)": {
    display: "none",
  },
}));

const HiddenFileInput = styled("input")({
  display: "none",
  visibility: "hidden",
});
