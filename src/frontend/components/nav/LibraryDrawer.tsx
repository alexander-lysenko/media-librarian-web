import { CloseOutlined } from "@mui/icons-material";
import { Container, DialogTitle, Divider, Drawer, IconButton } from "@mui/material";
import { MouseEventHandler } from "react";

import { useLibraryDrawerStore } from "../../store/useLibraryDrawerStore";
import { useLibraryTableStore } from "../../store/useLibraryTableStore";

export const LibraryDrawer = () => {
  const { open, setOpen, selectedItem } = useLibraryDrawerStore();
  const { rows } = useLibraryTableStore();

  const responsiveSx = {
    width: { xs: "100%", sm: 360, md: 480, xl: 720 },
    // background: "rgba(0,0,0,0.5)",
  };

  const handleClose = (event: KeyboardEvent | MouseEvent) => {
    if (event.type === "keydown" && ["Tab", "Shift"].includes((event as KeyboardEvent).key)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor="right"
      hideBackdrop
      sx={{ width: 0 }}
      PaperProps={{ sx: responsiveSx }}
      container={window.document.body}
      onClose={handleClose}
    >
      <DialogTitle>
        {"Hello"}
        <CloseButton onClose={handleClose as unknown as MouseEventHandler} />
      </DialogTitle>
      <Divider />
      <Container>
        <pre>
          {JSON.stringify(
            rows.find((row) => row.id === selectedItem),
            null,
            2,
          )}
        </pre>
      </Container>
    </Drawer>
  );
};

const CloseButton = ({ onClose }: { onClose: MouseEventHandler }) => (
  <IconButton
    aria-label="close"
    onClick={onClose}
    sx={{ position: "absolute", right: 8, top: 12, color: (theme) => theme.palette.grey[500] }}
    children={<CloseOutlined />}
  />
);
