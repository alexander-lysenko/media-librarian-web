import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useLibraryActions } from "../../hooks/useLibraryActions";
import { useLibrariesGetRequest } from "../../requests/libraryRequests";
import { useLibrariesStore } from "../../store/library/useLibrariesStore";
import {
  CleaningServicesOutlined,
  CollectionsOutlined,
  CreateNewFolderOutlined,
  DeleteForeverOutlined,
} from "../icons";
import { LibrariesEmptyState } from "../ui/LibrariesEmptyState";
import { LoadingOverlayInner } from "../ui/LoadingOverlayInner";
import { TooltipWrapper } from "../ui/TooltipWrapper";

export const MyLibraries = () => {
  const { t } = useTranslation();
  const libraries = useLibrariesStore((state) => state.libraries);

  const { openLibraryForm, cleanupLibrary, deleteLibrary } = useLibraryActions();
  const getLibrariesRequest = useLibrariesGetRequest();

  if (getLibrariesRequest.status === "pending") {
    return <LoadingOverlayInner sx={{ height: 180 }} />;
  }
  if (libraries.length === 0) {
    return <LibrariesEmptyState />;
  }
  return (
    <List dense disablePadding component="div">
      <ListItemButton divider onClick={openLibraryForm}>
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
              <IconButton size="small" onClick={cleanupLibrary(library.id, library.title)}>
                <CleaningServicesOutlined />
              </IconButton>
            </TooltipWrapper>
            <TooltipWrapper title={t("myLibraries.deleteThisLibrary")} placement={"top"}>
              <IconButton size="small" onClick={deleteLibrary(library.id, library.title)}>
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
