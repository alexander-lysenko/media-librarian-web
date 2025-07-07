import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { confirmDialog, enqueueSnack } from '../core/actions';
import { useLibraryItemDeleteRequest, useLibraryItemGetRequest } from '../requests/libraryItemRequests';
import { usePreviewDrawerStore } from '../store/app/usePreviewDrawerStore';
import { useSelectedLibraryStore } from '../store/library/useLibrariesStore';
import { useLibraryTableStore } from '../store/library/useLibraryTableStore';
import { useLibraryItemFormStore } from '../store/useLibraryItemFormStore';

/**
 * Set of actions with a Library item.
 * These actions can be imported into a component to create event handlers and bind them to hotkeys.
 * TODO: WIP
 */
export const useLibraryItemActions = () => {
  const { t } = useTranslation();

  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);
  const selectedItemId = usePreviewDrawerStore((state) => state.selectedItemId);

  const requestItem = useLibraryItemGetRequest();
  const deleteItemRequest = useLibraryItemDeleteRequest();

  /**
   * Launch LibraryItemDialog to create a Library item
   */
  const handleItemCreate = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId) {
      return false;
    }

    useLibraryItemFormStore.getState().handleOpen();
  }, [getSelectedLibrary]);

  /**
   * Launch LibraryItemDialog to update a Library item
   */
  const handleItemEdit = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId || !selectedItemId) {
      return false;
    }

    void requestItem.mutateAsync(
      { id: selectedLibraryId, item: selectedItemId },
      {
        onSuccess: (response) => {
          useLibraryItemFormStore.getState().handleOpen(response.item);
        },
      },
    );
  }, [getSelectedLibrary, requestItem, selectedItemId]);

  /**
   * Launch confirmation dialog and initiate a request to delete a Library item
   */
  const handleItemDelete = useCallback(() => {
    const selectedLibraryId = getSelectedLibrary()?.id;
    if (!selectedLibraryId || !selectedItemId) {
      return false;
    }

    const columns = useLibraryTableStore.getState().columns;
    const item = useLibraryTableStore.getState().rows.find((v) => v.id === selectedItemId);
    const subjectTitle = item?.[columns[0].label] as string;

    confirmDialog({
      message: t('confirm.deleteLibraryItem'),
      subjectItem: subjectTitle,
      onConfirm: async () => {
        await deleteItemRequest.mutateAsync(
          { id: selectedLibraryId, item: selectedItemId },
          {
            onSuccess: () => {
              enqueueSnack({
                type: 'success',
                message: t('notifications.libraryItemDeleted', { title: subjectTitle }),
              });
            },
          },
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
