import { type MouseEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { confirmDialog, enqueueSnack } from "../core/actions";
import {
  useLibraryCleanupRequest,
  useLibraryCreateRequest,
  useLibraryDeleteRequest,
} from "../requests/libraryRequests";
import { useLibraryCreateFormStore } from "../store/useLibraryCreateFormStore";

import type { LibraryFormData } from "../core/types";

export const useLibraryActions = () => {
  const { t } = useTranslation();
  const setLibraryDialogOpen = useLibraryCreateFormStore((state) => state.setOpen);

  const libraryCreateRequest = useLibraryCreateRequest();
  const libraryDeleteRequest = useLibraryDeleteRequest();
  const libraryCleanupRequest = useLibraryCleanupRequest();

  const handleOpenLibraryDialog = () => setLibraryDialogOpen(true);

  const handleCreateLibrary = useCallback((data: LibraryFormData) => {

  }, []);

  const handleCleanupLibrary = useCallback(
    (id: number, name: string): MouseEventHandler<HTMLButtonElement> => {
      return (event) => {
        event.preventDefault();
        confirmDialog({
          message: t("confirm.cleanupLibrary"),
          subjectItem: name,
          onConfirm: async () => await libraryCleanupRequest.mutateAsync({ id }),
        });
      };
    },
    [libraryCleanupRequest, t],
  );

  const handleDeleteLibrary = useCallback(
    (id: number, name: string): MouseEventHandler<HTMLButtonElement> => {
      return (event) => {
        event.preventDefault();
        const onSuccess = () => {
          enqueueSnack({ type: "info", message: t("notifications.libraryDeleted", { title: name }) });
        };

        confirmDialog({
          message: t("confirm.deleteLibrary"),
          subjectItem: name,
          onConfirm: async () => await libraryDeleteRequest.mutateAsync({ id }, { onSuccess }),
        });
      };
    },
    [libraryDeleteRequest, t],
  );

  return {
    createLibrary: handleCreateLibrary,
    cleanupLibrary: handleCleanupLibrary,
    deleteLibrary: handleDeleteLibrary,
    openLibraryForm: handleOpenLibraryDialog,
    isLibraryCreating: libraryCreateRequest.status === "pending",
  };
};
