import { Box, Container, Divider, Drawer, IconButton, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { usePreviewDrawerStore } from "../../store/app/usePreviewDrawerStore";
import { useLibraryTableStore } from "../../store/library/useLibraryTableStore";
import { CloseOutlined, DeleteOutlined, EditNoteOutlined } from "../icons";
import { PosterBox } from "./PosterBox";
import { PrintDate } from "./PrintDate";
import { PrintPriority } from "./PrintPriority";
import { PrintRating } from "./PrintRating";
import { PrintSwitch } from "./PrintSwitch";

import type { LibraryElement } from "../../core/types";
import type { SxProps, Theme } from "@mui/material";
import type { MouseEventHandler, ReactElement } from "react";

type Props = {
  handleItemEdit: MouseEventHandler;
  handleItemDelete: MouseEventHandler;
};

/**
 * A right-side drawer displaying the entire item selected from a Library
 * @constructor
 */
export const LibraryDrawer = ({ handleItemEdit, handleItemDelete }: Props) => {
  const { t } = useTranslation();

  const { open, setOpen, selectedItemId, setSelectedItemId } = usePreviewDrawerStore();
  const [item, columns] = useLibraryTableStore((state) => [
    state.rows.find((dataRow) => dataRow.id === selectedItemId),
    state.columns,
  ]);

  const responsiveSx: SxProps<Theme> = {
    width: { xs: "100%", sm: 480, md: 480, xl: 480 },
    background: (theme) => theme.palette.background.paper,
  };

  const handleClose = (event: KeyboardEvent | MouseEvent) => {
    if (event.type === "keydown" && ["Tab", "Shift"].includes((event as KeyboardEvent).key)) {
      return;
    }

    setOpen(false);
    setSelectedItemId(null);
  };

  useEffect(() => {
    const handleEscapeClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSelectedItemId(null);
      }
    };
    window.addEventListener("keydown", handleEscapeClose);

    return () => window.removeEventListener("keydown", handleEscapeClose);
  }, [setOpen, setSelectedItemId]);

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
        <PosterBox
          title={item?.[columns[0].label] as string}
          src="https://source.unsplash.com/wMkaMXTJjlQ"
          height={360}
        />
        <Divider />
        <Container>
          <List dense disablePadding>
            {columns.slice(1).map((column) => (
              <ListItem key={column.label} disableGutters>
                <ListItemText
                  primary={column.label}
                  secondary={<ItemCellContents type={column.type} value={item?.[column.label] as never} />}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>
      <Divider sx={{ mt: "auto" }} />
      <Box component="footer" sx={{ py: 1, px: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Tooltip arrow title={t("libraryItem.updateThisEntry")}>
          <IconButton type="button" color="info" children={<EditNoteOutlined />} onClick={handleItemEdit} />
        </Tooltip>
        <Tooltip arrow title={t("libraryItem.deleteThisEntry")}>
          <IconButton type="button" color="error" children={<DeleteOutlined />} onClick={handleItemDelete} />
        </Tooltip>
        <Box flex="1 0 auto" />
        <Tooltip arrow title={t("common.close")}>
          <IconButton type="button" onClick={handleClose as unknown as MouseEventHandler}>
            <CloseOutlined color="disabled" />
          </IconButton>
        </Tooltip>
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

const ItemCellContents = memo(({ type, value }: { type: LibraryElement; value: never }) => {
  switch (type) {
    case "line":
    case "text":
      return (value ?? "...") as ReactElement;
    case "url":
      return value ? <a href={value} children={value} target="_blank" rel="noreferrer" /> : "...";
    case "date":
    case "datetime":
      return value ? <PrintDate format={type} value={value} /> : "...";
    case "rating5":
    case "rating5precision":
      return <PrintRating value={value ?? 0} size={5} />;
    case "rating10":
    case "rating10precision":
      return <PrintRating value={value ?? 0} size={10} />;
    case "priority":
      return <PrintPriority value={(value ?? 0) as number} />;
    case "checkmark":
      return <PrintSwitch asText value={value as boolean} />;
  }
});
