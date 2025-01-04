import { useTranslation } from "react-i18next";

import { createHttpRequestHook } from "../core";
import { enqueueSnack } from "../core/actions";
import { libraryItemEndpoint, libraryItemsEndpoint } from "../core/links";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";

import type {
  GetLibraryItemsRequest,
  GetLibraryItemsResponse,
  HttpResponseEvents,
  LibraryItemResponse,
  PostLibraryItemRequest,
  UseRequestReturn,
} from "../core/types";

/**
 * Request to get items from a specific library
 * [GET] /api/v1/libraries/{id}/items
 * WIP
 * todo: add sorting and pagination query params
 */
export const useLibraryAllItemsGetRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const setRows = useLibraryTableStore((state) => state.setRows);

  const customEvents: HttpResponseEvents<GetLibraryItemsResponse> = {
    onSuccess: (response) => {
      setRows(response.items);
    },
    onError: (reason) => {
      setRows([]);
      enqueueSnack({ message: reason.message, type: "error" });
    },
  };

  return createHttpRequestHook<GetLibraryItemsRequest, GetLibraryItemsResponse>({
    method: "GET",
    endpoint: libraryItemsEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to get a specific item from a specific library
 * [GET] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemGetRequest = (): UseRequestReturn<void, LibraryItemResponse> => {
  const customEvents: HttpResponseEvents<LibraryItemResponse> = {
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: "error" });
    },
  };

  return createHttpRequestHook<void, LibraryItemResponse>({
    method: "GET",
    endpoint: libraryItemEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to create a specific item into a specific library
 * [POST] /api/v1/libraries/{id}/items
 * WIP
 */
export const useLibraryItemPostRequest = (): UseRequestReturn<PostLibraryItemRequest, LibraryItemResponse> => {
  const { t } = useTranslation();

  const customEvents: HttpResponseEvents<LibraryItemResponse> = {
    onSuccess: (response) => {
      const title = Object.values(response.item)[1];
      enqueueSnack({ message: t("notifications.libraryItemCreated", { title }), type: "success" });
    },
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: "error" });
    },
  };

  return createHttpRequestHook<PostLibraryItemRequest, LibraryItemResponse>({
    method: "POST",
    endpoint: libraryItemsEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to update a specific item in a specific library
 * [PUT] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemPutRequest = (): UseRequestReturn<PostLibraryItemRequest, LibraryItemResponse> => {
  const { t } = useTranslation();

  const customEvents: HttpResponseEvents<LibraryItemResponse> = {
    onSuccess: (response) => {
      const title = Object.values(response.item)[1];
      enqueueSnack({ message: t("notifications.libraryItemUpdated", { title }), type: "success" });
    },
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: "error" });
    },
  };

  return createHttpRequestHook<PostLibraryItemRequest, LibraryItemResponse>({
    method: "PUT",
    endpoint: libraryItemEndpoint,
    customEvents,
    verbose: true,
  })();
};

/**
 * Request to delete a specific item from a specific library
 * [DELETE] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemDeleteRequest = (): UseRequestReturn<void, void> => {
  const customEvents: HttpResponseEvents<void> = {
    onError: (reason) => {
      enqueueSnack({ message: reason.message, type: "error" });
    },
  };

  return createHttpRequestHook<void, void>({
    method: "DELETE",
    endpoint: libraryItemEndpoint,
    customEvents,
    verbose: true,
  })();
};
