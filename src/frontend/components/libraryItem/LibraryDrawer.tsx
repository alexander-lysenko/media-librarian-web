import { CloseOutlined } from "@mui/icons-material";
import { Box, Button, Container, Divider, Drawer, IconButton, SxProps, Theme, Typography } from "@mui/material";
import { MouseEventHandler, ReactNode, useEffect } from "react";

import { DataRow } from "../../core/types";
import { useLibraryDrawerStore } from "../../store/useLibraryDrawerStore";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";
import { PosterBox } from "./PosterBox";

/**
 *
 * @constructor
 */
export const LibraryDrawer = () => {
  const { open, setOpen, selectedItem } = useLibraryDrawerStore();
  const item: DataRow | undefined = useLibraryTableStore((state) =>
    state.rows.find((dataRow) => dataRow.id === selectedItem),
  );

  const responsiveSx: SxProps<Theme> = {
    width: { xs: "100%", sm: 360, md: 480, xl: 720 },
    background: (theme) => theme.palette.background.paper,
  };

  const handleClose = (event: KeyboardEvent | MouseEvent) => {
    if (event.type === "keydown" && ["Tab", "Shift"].includes((event as KeyboardEvent).key)) {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const handleEscapeClose = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEscapeClose);

    return () => window.removeEventListener("keydown", handleEscapeClose);
  }, [setOpen]);

  return (
    <Drawer
      open={open}
      variant="persistent"
      anchor="right"
      hideBackdrop
      sx={{ width: 0 }}
      PaperProps={{ sx: responsiveSx }}
      onClose={handleClose}
    >
      <CloseButton onClose={handleClose as unknown as MouseEventHandler} />
      <Box sx={{ overflowY: "auto" }}>
        <PosterBox title={item?.["Movie Title"] as string} src="https://source.unsplash.com/wMkaMXTJjlQ" height={360} />
        <Divider />
        <Container>
          <DrawerContent item={item} />
        </Container>
      </Box>
      {/*<DialogTitle>{"Hello"}</DialogTitle>*/}
      {/*<PosterBox src="" height={360} />*/}
      <Divider sx={{ mt: "auto" }} />
      <Box component="footer" sx={{ py: 2, px: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Button type="button" variant="contained">
          Edit
        </Button>
        <Button type="button" variant="contained">
          Delete
        </Button>
        <Box flex="1 0 auto" />
        <Button type="button" variant="contained">
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

const CloseButton = ({ onClose }: { onClose: MouseEventHandler }) => (
  <IconButton
    aria-label="close"
    onClick={onClose}
    sx={{ position: "absolute", right: 16, top: 8, color: (theme) => theme.palette.grey[200], zIndex: 1 }}
    children={<CloseOutlined />}
  />
);

const DrawerContent = ({ item }: { item: DataRow | undefined }) => {
  return (
    <Box>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
      <Typography variant={"h5"} noWrap>
        {item?.["Movie Title"] as ReactNode}
      </Typography>
    </Box>
  );
};
