// import { useState } from "react";
//
// import { axiosFetch } from "../core";
//
// import type { FetchRequestConfig, HttpResponseEvents } from "../core";
// import type { ApiRequestFetch, HttpRequestHookConfig, ApiRequestHookReturn, RequestStatus } from "../core/types";
// import type { AxiosResponse } from "axios";
//
// /**
//  * Use this hook as base to configure any API requests in the project.
//  *
//  * Added simulation mode (for development purposes only, make sure you're not using that in production)
//  * which replaces the real API request with fake promise and fake response
//  * @deprecated use createRequestHook instead
//  */
// export const useApiRequest = <Request, Response>(
//   config: HttpRequestHookConfig,
// ): ApiRequestHookReturn<Request, Response> => {
//   const { endpoint: url, method, customEvents, verbose = false } = config;
//
//   let status: RequestStatus = "IDLE";
//   const setStatus = (s: RequestStatus) => (status = s);
//
//   const [abortController] = useState<AbortController>(new AbortController());
//
//   const events: HttpResponseEvents = {
//     beforeSend: () => {
//       setStatus("LOADING");
//       customEvents?.beforeSend?.();
//       // eslint-disable-next-line no-console,@typescript-eslint/no-unused-expressions
//       verbose && console.log(`Requesting: ${method} ${url}`);
//     },
//     onSuccess: (response: Response | AxiosResponse<Response>) => {
//       setStatus("SUCCESS");
//       customEvents?.onSuccess?.(response as AxiosResponse<Response>);
//       // eslint-disable-next-line no-console,@typescript-eslint/no-unused-expressions
//       verbose && console.log("Response", response);
//     },
//     onReject: (reason) => {
//       setStatus("FAILED");
//       customEvents?.onReject?.(reason);
//       // eslint-disable-next-line no-console,@typescript-eslint/no-unused-expressions
//       verbose && console.log("Rejected", reason);
//     },
//     onError: (error) => {
//       setStatus("FAILED");
//       customEvents?.onError?.(error);
//       // eslint-disable-next-line no-console,@typescript-eslint/no-unused-expressions
//       verbose && console.log("Failed", error);
//     },
//     onComplete: () => {
//       customEvents?.onComplete?.();
//       // eslint-disable-next-line no-console,@typescript-eslint/no-unused-expressions
//       verbose && console.log("Status: ", status);
//     },
//   };
//
//   const fetch: ApiRequestFetch<Request, Response> = async (
//     // prettier ignore
//     data: Request,
//     pathParams?: Record<string, string | number>,
//   ): Promise<Response | void> => {
//     const reducer = (path: string, [param, value]: [string, string | number]) => {
//       return path.replace(`{${param}}`, value as string);
//     };
//
//     const transformedUrl: string = !pathParams ? url : Object.entries(pathParams).reduce<string>(reducer, url);
//
//     const config: FetchRequestConfig<Request> = {
//       url: transformedUrl,
//       method,
//       data,
//       signal: abortController.signal,
//       withCredentials: true,
//     };
//
//     return await axiosFetch<Request, Response>(config, events);
//   };
//
//   return {
//     status,
//     fetch,
//     abort: () => abortController.abort(),
//   };
// };
