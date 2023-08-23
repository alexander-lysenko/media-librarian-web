import { useState } from "react";

import { libraryItemsEndpoint } from "../core/links";
import { useApiRequest } from "../hooks";
import { useLibraryTableStore } from "../store/useLibraryTableStore";

import type { FetchResponseEvents } from "../core";
import type { GetLibraryItemsRequest, GetLibraryItemsResponse, UseRequestReturn } from "../core/types";
import type { AxiosResponse } from "axios";

/**
 * Request to get items from a specific library
 * [GET] /api/v1/libraries/{id}/items
 * WIP
 * todo: add sorting and pagination params
 */
export const useLibraryItemsGetRequest = (): UseRequestReturn<GetLibraryItemsRequest, GetLibraryItemsResponse> => {
  const { setRows, setTotal, setPage, setRowsPerPage } = useLibraryTableStore((state) => state);

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetLibraryItemsResponse>) => {
      const { items, pagination } = response.data;
      setTotal(pagination.total);
      setPage(pagination.currentPage);
      setRowsPerPage(pagination.perPage);
      setRows(items);
    },
  });

  const { fetch, abort, status } = useApiRequest<GetLibraryItemsRequest, GetLibraryItemsResponse>({
    method: "GET",
    endpoint: libraryItemsEndpoint,
    customEvents: responseEvents,
    verbose: true,
    simulate: true, // uncomment this line and provide fakeResponse into fetch()
  });

  return { status, fetch, abort, setResponseEvents };
};
