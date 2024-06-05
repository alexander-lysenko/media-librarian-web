import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { confirmDialog, enqueueSnack } from "../core/actions";
import { useLibraryItemDeleteRequest, useLibraryItemGetRequest } from "../requests/useLibraryItemRequests";
import { usePreviewDrawerStore } from "../store/app/usePreviewDrawerStore";
import { useSelectedLibraryStore } from "../store/library/useLibrariesStore";
import { useLibraryItemFormStore } from "../store/useLibraryItemFormStore";

/**
 * Set of actions with a Library item.
 * These actions can be imported into a component to create event handlers and bind them to hotkeys.
 * TODO: WIP
 */
export const useLibraryItemActions = () => {
  const { t } = useTranslation();

  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);
  const selectedItemId = usePreviewDrawerStore((state) => state.selectedItemId);

  // todo: remove
  const openItemDialog = useLibraryItemFormStore((state) => state.handleOpen);

  const requestItem = useLibraryItemGetRequest();
  const deleteItemRequest = useLibraryItemDeleteRequest();

  useEffect(() => {
    deleteItemRequest.setResponseEvents({
      onSuccess: () => alert("getItems()"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Launch LibraryItemDialog to create a Library item
   */
  const handleItemCreate = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId) {
      return false;
    }

    openItemDialog(selectedLibraryId);
  }, [getSelectedLibrary, openItemDialog]);

  /**
   * Launch LibraryItemDialog to update a Library item
   */
  const handleItemEdit = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId || !selectedItemId) {
      return false;
    }

    requestItem.setResponseEvents({
      onSuccess: (response) => {
        console.log("libraryItem", response.data.item);
        openItemDialog(selectedLibraryId, response.data.item);
      },
    });

    void requestItem.fetch(undefined, { id: selectedLibraryId, item: selectedItemId });
  }, [getSelectedLibrary, openItemDialog, requestItem, selectedItemId]);

  /**
   * Launch confirm dialog and initiate a request to delete a Library item
   */
  const handleItemDelete = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId || !selectedItemId) {
      return false;
    }

    confirmDialog({
      message: t("confirm.deleteLibraryItem"),
      // subjectItem: item?.[columns[0].label] as string,
      onConfirm: async () => {
        await deleteItemRequest.fetch(undefined, { id: selectedLibraryId, item: selectedItemId }).then(() =>
          enqueueSnack({
            type: "success",
            message: t("notifications.libraryItemDeleted", { title: "555" }),
          }),
        );
      },
    });
  }, [deleteItemRequest, getSelectedLibrary, selectedItemId, t]);

  return {
    handleItemCreate,
    handleItemEdit,
    handleItemDelete,
  };
};
