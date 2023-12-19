import { useState } from "react";

import { axiosFetch } from "../core";

import type { FetchRequestConfig, FetchResponseEvents } from "../core";
import type { ApiRequestFetch, ApiRequestHookConfig, ApiRequestHookReturn, RequestStatus } from "../core/types";
import type { AxiosResponse } from "axios";

/**
 * Use this hook as base to configure any API requests in the project.
 *
 * Added simulation mode (for development purposes only, make sure you're not using that in production)
 * which replaces the real API request with fake promise and fake response
 */
export const useApiRequest = <Request, Response>(
  config: ApiRequestHookConfig,
): ApiRequestHookReturn<Request, Response> => {
  const { endpoint: url, method, customEvents, verbose = false, simulate = false } = config;

  const [status, setStatus] = useState<RequestStatus>("IDLE");
  const [abortController] = useState<AbortController>(new AbortController());

  const events: FetchResponseEvents = {
    beforeSend: () => {
      setStatus("LOADING");
      customEvents.beforeSend?.();
      // eslint-disable-next-line no-console
      verbose && console.log(`Requesting: ${method} ${url}`);
    },
    onSuccess: (response: Response | AxiosResponse<Response>) => {
      setStatus("SUCCESS");
      customEvents.onSuccess?.(response as AxiosResponse<Response>);
      // eslint-disable-next-line no-console
      verbose && console.log("Response", response);
    },
    onReject: (reason) => {
      setStatus("FAILED");
      customEvents.onReject?.(reason);
      // eslint-disable-next-line no-console
      verbose && console.log("Rejected", reason);
    },
    onError: (error) => {
      setStatus("FAILED");
      customEvents.onError?.(error);
      // eslint-disable-next-line no-console
      verbose && console.log("Failed", error);
    },
    onComplete: () => {
      customEvents.onComplete?.();
      verbose && console.log("Status: ", status);
    },
  };

  const fetch: ApiRequestFetch<Request, Response> = async (
    // prettier ignore
    data: Request,
    pathParams?: Record<string, string | number>,
  ): Promise<Response | void> => {
    const reducer = (path: string, [param, value]: [string, string | number]) => {
      return path.replace(`{${param}}`, value as string);
    };

    const transformedUrl: string = !pathParams ? url : Object.entries(pathParams).reduce<string>(reducer, url);

    const config: FetchRequestConfig<Request> = {
      url: transformedUrl,
      method,
      data,
      signal: abortController.signal,
      withCredentials: true,
    };

    return await axiosFetch<Request, Response>(config, events);
  };

  const fakeFetch: ApiRequestFetch<Request, Response> = async (
    // prettier ignore
    data: Request,
    pathParams?: Record<string, string | number>,
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
  };
};
