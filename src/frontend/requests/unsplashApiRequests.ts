import { useQuery } from "@tanstack/react-query";

import { bindPathParams, createFetch } from "../core";
import { apiDomain, unsplashExactImageEndpoint, unsplashRandomImageEndpoint } from "../core/links";

import type { UnsplashApiResponse, UnsplashSearchRequest } from "../core/types";

/**
 * Request to get a random image from Unsplash
 * [GET] /api/unsplash/random
 */
export const useUnsplashRandomRequest = (searchParams: UnsplashSearchRequest) => {
  return useQuery({
    queryKey: ["unsplash", "random", searchParams],
    queryFn: (): Promise<UnsplashApiResponse> => {
      const url = new URL(unsplashRandomImageEndpoint, apiDomain);

      if (searchParams.query) {
        url.searchParams.append("query", searchParams.query);
      }
      if (Array.isArray(searchParams.topics)) {
        searchParams.topics.forEach((topic) => {
          url.searchParams.append("topics[]", topic);
        });
      }
      if (Array.isArray(searchParams.collections)) {
        searchParams.collections.forEach((collection) => {
          url.searchParams.append("collections[]", collection);
        });
      }

      return createFetch({ url, method: "GET" });
    },
  });
};

/**
 * Request to get an image by its ID from Unsplash
 * [GET] /api/unsplash/image/{id}
 */
export const useUnsplashImageRequest = (id: string) => {
  return useQuery({
    queryKey: ["unsplash", "image", id],
    queryFn: (): Promise<UnsplashApiResponse> => {
      const url = bindPathParams(unsplashExactImageEndpoint, { id });

      return createFetch({ url, method: "GET", cache: "force-cache" });
    },
  });
};
