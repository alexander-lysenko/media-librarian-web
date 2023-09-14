import { useState } from "react";

import { libraryItemsEndpoint } from "../core/links";
import { useApiRequest } from "../hooks";
import { useLibraryTableStore } from "../store/useLibraryTableStore";
import { enqueueSnack } from "../store/useSnackbarStore";

import type { FetchResponseEvents } from "../core";
import type { GetLibraryItemsRequest, GetLibraryItemsResponse, UseRequestReturn } from "../core/types";
import type { AxiosResponse } from "axios";

/**
 * Request to get items from a specific library
 * [GET] /api/v1/libraries/{id}/items
 * WIP
 * todo: add sorting and pagination query params
 */
export const useLibraryItemsGetRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
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
