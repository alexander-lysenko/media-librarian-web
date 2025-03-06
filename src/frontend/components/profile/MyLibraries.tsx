import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { confirmDialog } from "../../core/actions";
import {
  useLibrariesGetRequest,
  useLibraryCleanupRequest,
  useLibraryDeleteRequest,
} from "../../requests/useLibraryRequests";
import { useLibrariesStore } from "../../store/library/useLibrariesStore";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import {
  CleaningServicesOutlined,
  CollectionsOutlined,
  CreateNewFolderOutlined,
  DeleteForeverOutlined,
} from "../icons";
import { LibrariesEmptyState } from "../ui/LibrariesEmptyState";
import { LoadingOverlayInner } from "../ui/LoadingOverlayInner";
import { TooltipWrapper } from "../ui/TooltipWrapper";

import type { MouseEventHandler } from "react";

export const MyLibraries = () => {
  const { t } = useTranslation();
  const setLibraryDialogOpen = useLibraryCreateFormStore((state) => state.setOpen);
  const libraries = useLibrariesStore((state) => state.libraries);

  const getLibrariesRequest = useLibrariesGetRequest();
  const libraryDeleteRequest = useLibraryDeleteRequest();
  const libraryCleanupRequest = useLibraryCleanupRequest();

  useEffect(() => {
    void getLibrariesRequest.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenLibraryDialog = () => setLibraryDialogOpen(true);
  const handleCleanupLibrary =
    (id: number, name: string): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      confirmDialog({
        message: t("confirm.cleanupLibrary"),
        subjectItem: name,
        onConfirm: async () => {
          await libraryCleanupRequest.fetch(undefined, { id }).then(() => {
            return getLibrariesRequest.fetch();
          });
        },
      });
    };
  const handleDeleteLibrary =
    (id: number, name: string): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      confirmDialog({
        message: t("confirm.deleteLibrary"),
        subjectItem: name,
        onConfirm: async () => {
          await libraryDeleteRequest.fetch(undefined, { id }).then(() => {
            return getLibrariesRequest.fetch();
          });
        },
      });
    };

  if (getLibrariesRequest.status === "LOADING") {
    return <LoadingOverlayInner sx={{ height: 180 }} />;
  }
  if (libraries.length === 0) {
    return <LibrariesEmptyState />;
  }
  return (
    <List dense disablePadding component="div">
      <ListItemButton divider onClick={handleOpenLibraryDialog}>
        <ListItemIcon children={<CreateNewFolderOutlined />} />
        <ListItemText
          primary={t("myLibraries.createLibrary")}
          secondary={t("myLibraries.useLibraryWizard")}
          slotProps={{
            primary: { noWrap: true },
            secondary: { noWrap: true },
          }}
        />
      </ListItemButton>
      {libraries.map((library) => {
        const columnsToDisplay = Object.keys(library.fields).join(", ");
        const listItemSecondaryActions = (
          <>
            <TooltipWrapper title={t("myLibraries.cleanupThisLibrary")} placement={"top"}>
              <IconButton size="small" onClick={handleCleanupLibrary(library.id, library.title)}>
                <CleaningServicesOutlined />
              </IconButton>
            </TooltipWrapper>
            <TooltipWrapper title={t("myLibraries.deleteThisLibrary")} placement={"top"}>
              <IconButton size="small" onClick={handleDeleteLibrary(library.id, library.title)}>
                <DeleteForeverOutlined />
              </IconButton>
            </TooltipWrapper>
          </>
        );

        return (
          <ListItem key={library.id} divider sx={{ pr: 12 }} secondaryAction={listItemSecondaryActions}>
            <ListItemIcon children={<CollectionsOutlined />} />
            <ListItemText
              primary={library.title}
              secondary={columnsToDisplay}
              slotProps={{
                primary: { noWrap: true },
                secondary: { noWrap: true, title: columnsToDisplay },
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};
