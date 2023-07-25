import { AxiosResponse } from "axios";
import { useState } from "react";
import { ErrorOption } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FetchResponseEvents } from "../core";
import { librariesEndpoint, libraryEndpoint } from "../core/links";
import {
  CreateLibraryRequest,
  CreateLibraryResponse,
  GetLibrariesResponse,
  GetLibraryResponse,
  PatchLibraryResponse,
  UseRequestReturn,
} from "../core/types";
import { useApiRequest } from "../hooks";
import { useLibraryListStore } from "../store/useLibraryListStore";
import { enqueueSnack } from "../store/useSnackbarStore";

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
  const { setLibraries } = useLibraryListStore();
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibrariesResponse>) => {
      const itemsCount = response.data.data.length;
      setLibraries(response.data.data);
      // enqueueSnack({
      //   type: "info",
      //   message: `loaded ${itemsCount} items`,
      // });
    },
  });

  const { fetch, abort, status } = useApiRequest<void, GetLibrariesResponse>({
    method: "GET",
    endpoint: librariesEndpoint,
    customEvents: responseEvents,
    verbose: true,
    // simulate: true, // simulation // todo: remove
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to get the schema of a specific library by its ID
 * [GET] /api/v1/libraries/{id}
 */
export const useLibraryGetRequest = (): UseRequestReturn<void, GetLibraryResponse> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryResponse>) => {
      // const { id, title, fields } = response.data.data;
      enqueueSnack({
        type: "success",
        message: "loaded",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<void, GetLibraryResponse>({
    method: "GET",
    endpoint: libraryEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // simulation // todo: remove
  });

  return { status, fetch, abort, setResponseEvents };
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

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
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
  });

  const { fetch, abort, status } = useApiRequest<CreateLibraryRequest, CreateLibraryResponse>({
    method: "POST",
    endpoint: librariesEndpoint,
    customEvents: responseEvents,
    verbose: true,
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to delete a library
 * [DELETE] /api/v1/libraries/{id}
 */
export const useLibraryDeleteRequest = (): UseRequestReturn<void, void> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    // should be filled from the place of request call
  });

  const { fetch, abort, status } = useApiRequest<void, void>({
    method: "DELETE",
    endpoint: librariesEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // simulation // todo: remove
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to clean a library (delete all items from a library but not the library itself)
 * [PATCH] /api/v1/libraries/{id}
 */
export const useLibraryCleanupRequest = (): UseRequestReturn<void, PatchLibraryResponse> => {
  const { t } = useTranslation();

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<PatchLibraryResponse>) => {
      const { title } = response.data.data;
      const { items_affected: itemsAffected } = response.data.meta;
      enqueueSnack({
        type: "info",
        message: t("notifications.libraryCleaned", { title, count: itemsAffected }),
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<void, PatchLibraryResponse>({
    method: "PATCH",
    endpoint: librariesEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // simulation // todo: remove
  });

  return { status, fetch, abort, setResponseEvents };
};
