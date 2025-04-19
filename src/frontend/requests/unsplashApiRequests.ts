import { createHttpRequestHook } from "../core";
import { unsplashExactImageEndpoint, unsplashRandomImageEndpoint } from "../core/links";

import type { UseRequestReturn } from "../core/types";

type UnsplashApiResponse = {
  image: {
    id: string;
    linkHtml: string;
    urlFull: string;
    urlRegular: string;
    urlSmall: string;
    author: string;
  };
};

/**
 * Request to get a random image from Unsplash
 * [GET] /api/unsplash/random
 */
export const useUnsplashRandomRequest = (): UseRequestReturn<void, UnsplashApiResponse> => {
  return createHttpRequestHook<void, UnsplashApiResponse>({
    method: "GET",
    endpoint: unsplashRandomImageEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};

/**
 * Request to get an image by its ID from Unsplash
 * [GET] /api/unsplash/image/{id}
 */
export const useUnsplashImageRequest = (): UseRequestReturn<void, UnsplashApiResponse> => {
  return createHttpRequestHook<void, UnsplashApiResponse>({
    method: "GET",
    endpoint: unsplashExactImageEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};
