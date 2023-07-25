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
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useLibrariesGetRequest } from "../../requests/useLibraryRequests";
import { useLibraryCreateFormStore } from "../../store/useLibraryCreateFormStore";
import { TooltipWrapper } from "../ui/TooltipWrapper";
import { useLibraryListStore } from "../../store/useLibraryListStore";

export const MyLibraries = () => {
  const { t } = useTranslation();
  const { fetch: request } = useLibrariesGetRequest();
  const setLibraryDialogOpen = useLibraryCreateFormStore((state) => state.setOpen);
  const libraries = useLibraryListStore((state) => state.libraries);

  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      void request();
    }
  }, [request]);

  const handleOpenLibraryDialog = () => setLibraryDialogOpen(true);

  return (
    <List dense disablePadding component="div">
      <ListItemButton divider onClick={handleOpenLibraryDialog}>
        <ListItemIcon children={<CreateNewFolderOutlined />} />
        <ListItemText
          primary={t("libraryCreate.title")}
          secondary={t("libraryCreate.useLibraryWizard")}
          primaryTypographyProps={{ noWrap: true, textTransform: "uppercase" }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItemButton>
      {libraries.map((library) => {
        const columnsToDisplay = Object.keys(library.fields).join(", ");

        return (
          <ListItem key={library.id} divider>
            <ListItemIcon children={<CollectionsOutlined />} />
            <ListItemText primary={library.title} secondary={columnsToDisplay} />
            <ListItemSecondaryAction>
              <TooltipWrapper title={"Clean this library"} placement={"top"}>
                <IconButton size="small" aria-label="clear">
                  <CleaningServicesOutlined />
                </IconButton>
              </TooltipWrapper>
              <TooltipWrapper title={"Delete this library"} placement={"top"}>
                <IconButton size="small" aria-label="delete">
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
