import { AxiosResponse } from "axios";
import { useState } from "react";

import { axiosFetch, FetchRequestConfig, FetchResponseEvents } from "../core";
import { ApiRequestHookConfig, ApiRequestHookReturn, RequestStatus } from "../core/types";

/**
 * Use this hook as base to configure any API requests in the project
 */
export const useApiRequest = <Request, Response>(
  config: ApiRequestHookConfig,
): ApiRequestHookReturn<Request, Response> => {
  const { endpoint: url, method, customEvents, verbose = false } = config;

  const [status, setStatus] = useState<RequestStatus>("IDLE");
  const [abortController] = useState<AbortController>(new AbortController());

  const events: FetchResponseEvents = {
    beforeSend: () => {
      setStatus("LOADING");
      customEvents.beforeSend?.();
    },
    onSuccess: (response: AxiosResponse<Response>) => {
      setStatus("SUCCESS");
      customEvents.onSuccess?.(response);
      // eslint-disable-next-line no-console
      verbose && console.log(response);
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
    onComplete: () => customEvents.onComplete?.(),
  };

  const fetch = async (data: Request): Promise<Response | void> => {
    const config: FetchRequestConfig<Request> = {
      url,
      method,
      data,
      signal: abortController.signal,
      withCredentials: true,
    };

    return await axiosFetch<Request, Response>(config, events);
  };

  return {
    status,
    fetch,
    abort: () => abortController.abort(),
  };
};
