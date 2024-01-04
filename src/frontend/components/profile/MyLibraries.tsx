import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { confirmDialog } from "../../core/actions";
import {
  useLibrariesGetRequest,
  useLibraryCleanupRequest,
  useLibraryDeleteRequest,
} from "../../requests/useLibraryRequests";
import { useLibraryListStore } from "../../store/library/useLibraryListStore";
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
  const libraries = useLibraryListStore((state) => state.libraries);

  const dataFetchedRef = useRef(false);

  const { fetch: getLibraries, status } = useLibrariesGetRequest();
  const { fetch: deleteLibrary } = useLibraryDeleteRequest();
  const { fetch: cleanupLibrary } = useLibraryCleanupRequest();

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      void getLibraries();
    }
  }, [getLibraries]);

  const handleOpenLibraryDialog = () => setLibraryDialogOpen(true);
  const handleClearLibrary =
    (id: number, name: string): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      confirmDialog({
        message: t("confirm.cleanupLibrary"),
        subjectItem: name,
        onConfirm: async () => {
          await cleanupLibrary(undefined, { id }).then(() => getLibraries());
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
          await deleteLibrary(undefined, { id }).then(() => getLibraries());
        },
      });
    };

  if (status === "LOADING") {
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
          primaryTypographyProps={{ noWrap: true, textTransform: "uppercase" }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItemButton>
      {libraries.map((library) => {
        const columnsToDisplay = Object.keys(library.fields).join(", ");

        return (
          <ListItem key={library.id} divider sx={{ pr: 12 }}>
            <ListItemIcon children={<CollectionsOutlined />} />
            <ListItemText
              primary={library.title}
              secondary={columnsToDisplay}
              primaryTypographyProps={{ noWrap: true }}
              secondaryTypographyProps={{ noWrap: true, title: columnsToDisplay }}
            />
            <ListItemSecondaryAction>
              <TooltipWrapper title={t("myLibraries.cleanupThisLibrary")} placement={"top"}>
                <IconButton size="small" aria-label="clear" onClick={handleClearLibrary(library.id, library.title)}>
                  <CleaningServicesOutlined />
                </IconButton>
              </TooltipWrapper>
              <TooltipWrapper title={t("myLibraries.deleteThisLibrary")} placement={"top"}>
                <IconButton size="small" aria-label="delete" onClick={handleDeleteLibrary(library.id, library.title)}>
                  <DeleteForeverOutlined />
                </IconButton>
              </TooltipWrapper>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};
