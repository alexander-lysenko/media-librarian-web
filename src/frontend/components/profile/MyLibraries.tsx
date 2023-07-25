import {
  CleaningServicesOutlined,
  CollectionsOutlined,
  CreateNewFolderOutlined,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { MouseEventHandler, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  useLibrariesGetRequest,
  useLibraryCleanupRequest,
  useLibraryDeleteRequest,
} from "../../requests/useLibraryRequests";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import { TooltipWrapper } from "../ui/TooltipWrapper";
import { useLibraryListStore } from "../../store/useLibraryListStore";
import { confirmDialog } from "../../store/useConfirmDialogStore";

export const MyLibraries = () => {
  const { t } = useTranslation();
  const setLibraryDialogOpen = useLibraryCreateFormStore((state) => state.setOpen);
  const libraries = useLibraryListStore((state) => state.libraries);

  const dataFetchedRef = useRef(false);

  const { fetch: getLibraries } = useLibrariesGetRequest();
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
