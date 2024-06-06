import { useTranslation } from "react-i18next";

import { createRequestHook } from "../core";
import { enqueueSnack } from "../core/actions";
import { librariesEndpoint, libraryEndpoint } from "../core/links";
import { useLibrariesStore, useSelectedLibraryStore } from "../store/library/useLibrariesStore";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";

import type { FetchResponseEvents } from "../core";
import type {
  CreateLibraryRequest,
  CreateLibraryResponse,
  DataColumn,
  GetLibrariesResponse,
  GetLibraryResponse,
  PatchLibraryResponse,
  UseRequestReturn,
} from "../core/types";
import type { AxiosResponse } from "axios";
import type { ErrorOption } from "react-hook-form";

type LibraryCreateRequestProps = {
  reset: () => void;
  setLoading: (value: boolean) => void;
  setOpen: (value: boolean) => void;
  setError: (name: never, error: ErrorOption) => void;
};

/**
 * Request to get the schema of all available libraries
 * [GET] /api/v1/libraries
 */
export const useLibrariesGetRequest = (): UseRequestReturn<void, GetLibrariesResponse> => {
  const setLibraries = useLibrariesStore((state) => state.setLibraries);
  const setColumns = useLibraryTableStore((state) => state.setColumns);
  const getSelectedLibrary = useSelectedLibraryStore((state) => state.getSelectedLibrary);

  const customEvents: FetchResponseEvents = {
    onSuccess: (response: AxiosResponse<GetLibrariesResponse>) => {
      setLibraries(response.data.data);
      const fieldsOfSelectedLibrary: DataColumn[] = Object.entries(getSelectedLibrary()?.fields || {}).map(
        ([label, type]) => ({ label, type }),
      );

      setColumns(fieldsOfSelectedLibrary);
    },
    onReject: (reason) => {
      enqueueSnack({ type: "error", message: `${reason.code} ${reason.message}` });
    },
    onError: (reason) => {
      enqueueSnack({ type: "error", message: `${reason.message}: ${reason.response?.data?.message}` });
    },
  };

  return createRequestHook<void, GetLibrariesResponse>({
    method: "GET",
    endpoint: librariesEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to get the schema of a specific library by its ID
 * [GET] /api/v1/libraries/{id}
 */
export const useLibraryGetRequest = (): UseRequestReturn<void, GetLibraryResponse> => {
  const customEvents: FetchResponseEvents = {
    onSuccess: (response: AxiosResponse<GetLibraryResponse>) => {
      void response;
      // const { id, title, fields } = response.data.data;
      // enqueueSnack({
      //   type: "success",
      //   message: "loaded",
      // });
    },
  };

  return createRequestHook<void, GetLibraryResponse>({
    method: "GET",
    endpoint: libraryEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to create a library
 * [POST] /api/v1/libraries
 */
export const useLibraryCreateRequest = ({
  reset,
  setLoading,
  setOpen,
  setError,
}: LibraryCreateRequestProps): UseRequestReturn<CreateLibraryRequest, CreateLibraryResponse> => {
  const { t } = useTranslation();

  const customEvents: FetchResponseEvents = {
    beforeSend: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      const { title } = response.data.data;
      enqueueSnack({
        type: "success",
        message: t("notifications.libraryCreated", { title }),
      });
      reset();
      setLoading(false);
      setOpen(false);
    },
    onReject: (reason) => {
      setLoading(false);
      setError("root.serverError" as never, {
        message: `${reason.code}: ${reason.response?.data.message || reason.message}`,
      });
    },
    onError: () => {
      setLoading(false);
    },
  };

  return createRequestHook<CreateLibraryRequest, CreateLibraryResponse>({
    method: "POST",
    endpoint: librariesEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to delete a library
 * [DELETE] /api/v1/libraries/{id}
 */
export const useLibraryDeleteRequest = (): UseRequestReturn<void, void> => {
  const customEvents: FetchResponseEvents = {
    // onSuccess & onError should be filled from the place of request call
    onReject: (reason) => {
      enqueueSnack({ type: "error", message: `${reason.code} ${reason.message}` });
    },
  };

  return createRequestHook<void, void>({
    method: "DELETE",
    endpoint: libraryEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to clean a library (delete all items from a library but not the library itself)
 * [PATCH] /api/v1/libraries/{id}
 */
export const useLibraryCleanupRequest = (): UseRequestReturn<void, PatchLibraryResponse> => {
  const { t } = useTranslation();

  const customEvents: FetchResponseEvents = {
    onSuccess: (response: AxiosResponse<PatchLibraryResponse>) => {
      const { title } = response.data.data;
      const { items_affected: itemsAffected } = response.data.meta;
      enqueueSnack({
        type: "info",
        message: t("notifications.libraryCleaned", { title, count: itemsAffected }),
      });
    },
    onReject: (reason) => {
      enqueueSnack({ type: "error", message: `${reason.code} ${reason.message}` });
    },
    onError: (reason) => {
      enqueueSnack({ type: "error", message: `${reason.message}: ${reason.response?.data?.message}` });
    },
  };

  return createRequestHook<void, PatchLibraryResponse>({
    method: "PATCH",
    endpoint: libraryEndpoint,
    customEvents,
    verbose: true,
  })();
};
