import { useState } from "react";

import { bindPathParams } from "../helpers";
import { axiosFetch } from "./axiosFetch";

import type { ApiRequestFetch, ApiRequestHookConfig, RequestStatus, UseRequestReturn } from "../types";
import type { FetchRequestConfig, FetchResponseEvents } from "./axiosFetch";
import type { AxiosResponse } from "axios";

/**
 * Factory to create Axios API requests
 * @param config
 * @see https://dev.to/pietmichal/react-hooks-factories-48bi
 */
export const createRequestHook = <Request = void, Response = void>(config: ApiRequestHookConfig) => {
  return function useHook(): UseRequestReturn<Request, Response> {
    const { endpoint: url, method, customEvents } = config;
    const { verbose = false, withCredentials = true } = config;

    const [abortController] = useState<AbortController>(new AbortController());
    const [status, setStatus] = useState<RequestStatus>("IDLE");

    // Response events will be intentionally getting mutated to apply changes immediately without awaiting re-render
    let responseEvents: FetchResponseEvents = customEvents ?? {};
    const setResponseEvents = (events: FetchResponseEvents) => {
      responseEvents = { ...responseEvents, ...events };
    };

    let debugStatus: RequestStatus = "IDLE";
    const eventHandlers: FetchResponseEvents = {
      beforeSend: () => {
        setStatus("LOADING");
        responseEvents?.beforeSend?.();
        // eslint-disable-next-line no-console
        verbose && console.log(`Requesting: ${method} ${url}`);
      },
      onSuccess: (response: Response | AxiosResponse<Response>) => {
        setStatus("SUCCESS");
        responseEvents?.onSuccess?.(response as AxiosResponse<Response>);
        // eslint-disable-next-line no-console
        verbose && console.log("Response", response);
        debugStatus = "SUCCESS";
      },
      onReject: (reason) => {
        setStatus("FAILED");
        responseEvents?.onReject?.(reason);
        // eslint-disable-next-line no-console
        verbose && console.log("Rejected", reason);
        debugStatus = "FAILED";
      },
      onError: (error) => {
        setStatus("FAILED");
        responseEvents?.onError?.(error);
        // eslint-disable-next-line no-console
        verbose && console.log("Failed", error);
        debugStatus = "FAILED";
      },
      onComplete: () => {
        responseEvents?.onComplete?.();
        // eslint-disable-next-line no-console
        verbose && console.log("Status: ", debugStatus);
      },
    };

    /**
     * Regular Axios fetch
     */
    const fetch: ApiRequestFetch<Request, Response> = async (
      data: Request,
      pathParams?: Record<string, string | number>,
    ): Promise<Response | void> => {
      const config: FetchRequestConfig<Request> = {
        url: bindPathParams(url, pathParams),
        method,
        data,
        withCredentials,
        signal: abortController.signal,
      };

      return await axiosFetch<Request, Response>(config, eventHandlers);
    };

    const abort = () => abortController.abort();

    return { status, fetch, abort, setResponseEvents };
  };
};
