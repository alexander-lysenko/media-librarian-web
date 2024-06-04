import { useState } from "react";

import { axiosFetch } from "./axiosFetch";

import type { ApiRequestFetch, ApiRequestHookConfig, RequestStatus, UseRequestReturn } from "../types";
import type { FetchRequestConfig, FetchResponseEvents } from "./axiosFetch";
import type { AxiosResponse } from "axios";

/**
 * Factory to create Axios API requests
 * @param config
 * @see https://dev.to/pietmichal/react-hooks-factories-48bi
 */
export const createRequestHook = <Request = void, Response = void>(
  config: ApiRequestHookConfig,
): (() => UseRequestReturn<Request, Response>) => {
  return function useHook() {
    const { endpoint: url, method, customEvents, verbose = false, simulate = false } = config;

    const [abortController] = useState<AbortController>(new AbortController());
    const [status, setStatus] = useState<RequestStatus>("IDLE");
    const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>(config.customEvents ?? {});
    const setCustomResponseEvents = (events: FetchResponseEvents) => {
      setResponseEvents({ ...responseEvents, ...events });
    };

    // let responseEvents: FetchResponseEvents = {};
    // const setCustomResponseEvents = (customEvents: FetchResponseEvents) => {
    //   responseEvents = { ...responseEvents, ...customEvents };
    // };

    let debugStatus: RequestStatus = "IDLE";
    const events: FetchResponseEvents = {
      beforeSend: () => {
        setStatus("LOADING");
        customEvents?.beforeSend?.();
        // eslint-disable-next-line no-console
        verbose && console.log(`Requesting: ${method} ${url}`);
      },
      onSuccess: (response: Response | AxiosResponse<Response>) => {
        setStatus("SUCCESS");
        customEvents?.onSuccess?.(response as AxiosResponse<Response>);
        // eslint-disable-next-line no-console
        verbose && console.log("Response", response);
        debugStatus = "SUCCESS";
      },
      onReject: (reason) => {
        setStatus("FAILED");
        customEvents?.onReject?.(reason);
        // eslint-disable-next-line no-console
        verbose && console.log("Rejected", reason);
        debugStatus = "FAILED";
      },
      onError: (error) => {
        setStatus("FAILED");
        customEvents?.onError?.(error);
        // eslint-disable-next-line no-console
        verbose && console.log("Failed", error);
        debugStatus = "FAILED";
      },
      onComplete: () => {
        customEvents?.onComplete?.();
        // eslint-disable-next-line no-console
        verbose && console.log("Status: ", debugStatus);
      },
    };

    /**
     * Regular Axios fetch
     */
    const fetch: ApiRequestFetch<Request, Response> = async (data: Request): Promise<Response | void> => {
      const config: FetchRequestConfig<Request> = {
        url,
        method,
        data,
        signal: abortController.signal,
        withCredentials: true,
      };

      return await axiosFetch<Request, Response>(config, events);
    };

    /**
     * Simulation of AxiosFetch
     */
    const fakeFetch: ApiRequestFetch<Request, Response> = async (
      data: Request,
      options?: { fakeResponse?: Response },
    ): Promise<Response | void> => {
      events.beforeSend?.();
      return await new Promise<AxiosResponse<Response>>((resolve) => {
        setTimeout(() => {
          const fakeResponse = options?.fakeResponse;
          if (!fakeResponse) {
            // eslint-disable-next-line no-console
            console.warn("WARNING: options.fakeResponse was not provided, request is simulated with empty response");
          }

          resolve({ data: fakeResponse as Response } as AxiosResponse<Response>);
        }, 1000);
      })
        .then(events.onSuccess, events.onReject)
        .catch(events.onError)
        .finally(events.onComplete);
    };

    const fakeAbort = () => {
      return;
    };

    return {
      status,
      fetch: !simulate ? fetch : fakeFetch,
      abort: !simulate ? () => abortController.abort() : fakeAbort,
      setResponseEvents: setCustomResponseEvents,
    };
  };
};
