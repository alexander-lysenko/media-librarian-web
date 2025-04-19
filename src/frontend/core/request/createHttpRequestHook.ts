import { useState } from "react";

import { bindPathParams } from "../helpers";
import { axiosFetch } from "./axiosFetch";

import type {
  ApiRequestFetch,
  HttpRequestHookConfig,
  HttpResponseEvents,
  PathParams,
  QueryParams,
  RequestStatus,
  UseRequestReturn,
} from "../types";
import type { FetchRequestConfig } from "./axiosFetch";

/**
 * Factory to create API requests with Axios
 * @param config
 * @see https://dev.to/pietmichal/react-hooks-factories-48bi
 */
export const createHttpRequestHook = <RequestType = never, ResponseType = never>(
  config: HttpRequestHookConfig<ResponseType>,
): (() => UseRequestReturn<RequestType, ResponseType>) => {
  return function useHook(): UseRequestReturn<RequestType, ResponseType> {
    const { endpoint: url, method, customEvents, withCredentials = true } = config;
    const { verbose = import.meta.env.VITE_APP_DEBUG } = config;
    const descriptor = `[${method}] ${url} -->`;

    // const [abortController] = useState<AbortController>(config.abortController ?? new AbortController());
    let abortController: AbortController | undefined;
    const [status, setStatus] = useState<RequestStatus>("IDLE");

    // Response events will be intentionally mutated to apply changes immediately without awaiting re-render
    let responseEvents: HttpResponseEvents<ResponseType> = customEvents ?? {};
    const setResponseEvents = (events: HttpResponseEvents<ResponseType>) => {
      responseEvents = { ...responseEvents, ...events };
    };

    let debugStatus: RequestStatus = "IDLE";
    const eventHandlers: HttpResponseEvents<ResponseType> = {
      beforeSend: () => {
        setStatus("LOADING");
        responseEvents?.beforeSend?.();
        // eslint-disable-next-line no-console
        verbose && console.log(`${descriptor} Requesting...`);
      },
      onSuccess: (response) => {
        setStatus("SUCCESS");
        responseEvents?.onSuccess?.(response);
        // eslint-disable-next-line no-console
        verbose && console.log(`${descriptor} Loaded!`, response);
        debugStatus = "SUCCESS";
      },
      onReject: (reason) => {
        setStatus("FAILED");
        responseEvents?.onReject?.(reason);
        // eslint-disable-next-line no-console
        verbose && console.error(`${descriptor} Rejected!`, reason);
        debugStatus = "FAILED";
      },
      onError: (error) => {
        setStatus("FAILED");
        responseEvents?.onError?.(error);
        // eslint-disable-next-line no-console
        verbose && console.error(`${descriptor} Failed!`, error);
        debugStatus = "FAILED";
      },
      onComplete: () => {
        responseEvents?.onComplete?.();
        // eslint-disable-next-line no-console
        verbose && console.log(`${descriptor} Status:`, debugStatus);
      },
    };

    // The params will be intentionally mutated to avoid triggering re-renders
    let pathParams: PathParams | undefined;
    const setPathParams = (params?: PathParams): void => {
      pathParams = params;
    };

    // The params will be intentionally mutated to avoid triggering re-renders
    let queryParams: QueryParams | undefined;
    const setQueryParams = (params?: QueryParams): void => {
      queryParams = params;
    };

    /**
     * Implemented `fetch` using Axios
     */
    const fetch: ApiRequestFetch<RequestType, ResponseType> = async (
      data?: RequestType,
    ): Promise<ResponseType | void> => {
      abortController = new AbortController();

      const config: FetchRequestConfig<RequestType> = {
        url: bindPathParams(url, pathParams),
        method,
        params: queryParams,
        data,
        withCredentials,
        signal: abortController?.signal,
      };

      return await axiosFetch<RequestType, ResponseType>(config, eventHandlers);
    };

    const abort: AbortController["abort"] = () => abortController?.abort();

    return { status, fetch, abort, setResponseEvents, setQueryParams, setPathParams };
  };
};
