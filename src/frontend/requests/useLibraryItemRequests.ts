import { useState } from "react";
import { useTranslation } from "react-i18next";

import { enqueueSnack } from "../core/actions";
import { libraryItemEndpoint, libraryItemsEndpoint } from "../core/links";
import { useApiRequest } from "../hooks";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";

import type { FetchResponseEvents } from "../core";
import type {
  GetLibraryItemsRequest,
  GetLibraryItemsResponse,
  LibraryItemResponse,
  PostLibraryItemRequest,
  UseRequestReturn,
} from "../core/types";
import type { AxiosResponse } from "axios";

/**
 * Request to get items from a specific library
 * [GET] /api/v1/libraries/{id}/items
 * WIP
 * todo: add sorting and pagination query params
 */
export const useLibraryAllItemsGetRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const { setRows, setSort, setPagination } = useLibraryTableStore((state) => state);

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryItemsResponse>) => {
      const { items, pagination } = response.data;
      setSort(undefined); // todo: get that from response
      setPagination(pagination.currentPage - 1, pagination.perPage, pagination.total);
      setRows(items);
    },
    onError: (reason) => {
      setRows([]);
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<GetLibraryItemsRequest, GetLibraryItemsResponse>({
    method: "GET",
    endpoint: libraryItemsEndpoint,
    customEvents: responseEvents,
    verbose: true,
    // simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to create a specific item into a specific library
 * [POST] /api/v1/libraries/{id}/items
 * WIP
 */
export const useLibraryItemPostRequest = (): UseRequestReturn<PostLibraryItemRequest, LibraryItemResponse> => {
  const { t } = useTranslation();

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<LibraryItemResponse>) => {
      enqueueSnack({ message: t("notifications.libraryItemCreated", { title: "response.title" }), type: "success" });
    },
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<PostLibraryItemRequest, LibraryItemResponse>({
    method: "POST",
    endpoint: libraryItemsEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to get a specific item from a specific library
 * [GET] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemGetRequest = (): UseRequestReturn<void, LibraryItemResponse> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<void, LibraryItemResponse>({
    method: "GET",
    endpoint: libraryItemEndpoint,
    customEvents: responseEvents,
    verbose: true,
    // simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to update a specific item in a specific library
 * [PUT] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemPutRequest = (): UseRequestReturn<PostLibraryItemRequest, LibraryItemResponse> => {
  const { t } = useTranslation();

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<LibraryItemResponse>) => {
      enqueueSnack({ message: t("notifications.libraryItemUpdated", { title: "response.title" }), type: "success" });
    },
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<PostLibraryItemRequest, LibraryItemResponse>({
    method: "PUT",
    endpoint: libraryItemEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to delete a specific item from a specific library
 * [DELETE] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemDeleteRequest = (): UseRequestReturn<void, void> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<void, void>({
    method: "DELETE",
    endpoint: libraryItemEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};
