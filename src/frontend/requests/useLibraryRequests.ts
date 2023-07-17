import { AxiosResponse } from "axios";
import { useState } from "react";

import { FetchResponseEvents } from "../core";
import { LibrarySchema, UseRequestReturn } from "../core/types";
import { enqueueSnack } from "../store/useGlobalSnackbarStore";
import { useLibraryStore } from "../store/useLibraryStore";

type LibraryResponse = {
  data: LibrarySchema;
  meta: {
    created_at: string;
    items_count: number;
  };
};

export const useLibrariesGetRequest = () => {
  return;
};

/**
 * Example of simulated request
 */
export const useLibraryGetRequest = (): UseRequestReturn<number, LibraryResponse> => {
  const { setLibrary } = useLibraryStore();
  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<LibraryResponse>) => {
      const { id, title, fields } = response.data.data;
      setLibrary(id, title, fields);
      enqueueSnack({
        type: "success",
        message: "loaded",
      });
    },
  });

  const libraryResponse: LibraryResponse = {
    data: {
      id: 1,
      title: "Movies",
      fields: {
        "Movie Title": "line",
        "Origin Title": "line",
        "Release Date": "date",
        Description: "text",
        "IMDB URL": "url",
        "IMDB Rating": "rating10",
        "My Rating": "rating5precision",
        Watched: "checkmark",
        "Watched At": "datetime",
        "Chance to Advice": "priority",
      },
    },
    meta: {
      created_at: "1970-01-01 00:00:00",
      items_count: 1,
    },
  };

  const status = "IDLE";
  const fetch = async (data: number): Promise<LibraryResponse | void> =>
    await new Promise<LibraryResponse>((resolve) => {
      setTimeout(() => {
        resolve(libraryResponse);
      }, 1000);
    }).then((response) => responseEvents.onSuccess?.(response as unknown as AxiosResponse<LibraryResponse>));
  const abort = () => false;

  return { status, fetch, abort, setResponseEvents };
};
