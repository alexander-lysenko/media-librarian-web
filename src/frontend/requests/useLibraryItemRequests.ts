import { useState } from "react";

import { enqueueSnack } from "../core/actions";
import { libraryItemEndpoint, libraryItemsEndpoint } from "../core/links";
import { useApiRequest } from "../hooks";
import { useLibraryTableStore } from "../store/library/useLibraryTableStore";

import type { FetchResponseEvents } from "../core";
import type { GetLibraryItemsRequest, GetLibraryItemsResponse, UseRequestReturn } from "../core/types";
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
export const useLibraryItemPostRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryItemsResponse>) => {},
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<GetLibraryItemsRequest, GetLibraryItemsResponse>({
    method: "POST",
    endpoint: libraryItemsEndpoint,
    customEvents: responseEvents,
    verbose: true,
    // simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to get a specific item from a specific library
 * [GET] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemGetRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryItemsResponse>) => {},
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<GetLibraryItemsRequest, GetLibraryItemsResponse>({
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
export const useLibraryItemPutRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryItemsResponse>) => {},
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<GetLibraryItemsRequest, GetLibraryItemsResponse>({
    method: "PUT",
    endpoint: libraryItemEndpoint,
    customEvents: responseEvents,
    verbose: true,
    // simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};

/**
 * Request to delete a specific item from a specific library
 * [DELETE] /api/v1/libraries/{id}/items/{item}
 * WIP
 */
export const useLibraryItemDeleteRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryItemsResponse>) => {},
    onError: (reason) => {
      enqueueSnack({
        message: `${reason.message}: ${reason.response?.data?.message}`,
        type: "error",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<GetLibraryItemsRequest, GetLibraryItemsResponse>({
    method: "DELETE",
    endpoint: libraryItemEndpoint,
    customEvents: responseEvents,
    verbose: true,
    // simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};
