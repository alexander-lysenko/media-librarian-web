// import { useState } from "react";
//
// import { bindPathParams } from "../helpers";
// import { axiosFetch } from "./axiosFetch";
//
// import type {
//   ApiRequestFetch,
//   HttpRequestHookConfig,
//   HttpResponseEvents,
//   PathParams,
//   QueryParams,
//   RequestStatus,
//   UseRequestReturn,
// } from "../types";
// import type { FetchRequestConfig } from "./axiosFetch";
//
// /**
//  * Factory to create API requests with Axios
//  * @param config
//  * @see https://dev.to/pietmichal/react-hooks-factories-48bi
//  */
// export const createHttpRequestHook = <RequestType = never, ResponseType = never>(
//   config: HttpRequestHookConfig<ResponseType>,
// ): (() => UseRequestReturn<RequestType, ResponseType>) => {
//   return function useHook(): UseRequestReturn<RequestType, ResponseType> {
//     const { endpoint: url, method, customEvents, withCredentials = true } = config;
//     const { verbose = import.meta.env.VITE_APP_DEBUG } = config;
//     const descriptor = `[${method}] ${url} -->`;
//
//     // abortController is intentionally mutated,
//     // because new AbortController() could be created inside useEffect, and it must not trigger re-renders;
//     let abortController: AbortController | undefined;
//     const [status, setStatus] = useState<RequestStatus>("IDLE");
//
//     // Response events will be intentionally mutated to apply changes immediately without awaiting re-render
//     let responseEvents: HttpResponseEvents<ResponseType> = customEvents ?? {};
//     const setResponseEvents = (events: HttpResponseEvents<ResponseType>) => {
//       responseEvents = { ...responseEvents, ...events };
//     };
//
//     let debugStatus: RequestStatus = "IDLE";
//     const eventHandlers: HttpResponseEvents<ResponseType> = {
//       beforeSend: () => {
//         setStatus("LOADING");
//         // eslint-disable-next-line no-console
//         verbose && console.log(`${descriptor} Requesting...`);
//
//         return responseEvents?.beforeSend?.();
//       },
//       onSuccess: (response) => {
//         setStatus("SUCCESS");
//         // eslint-disable-next-line no-console
//         verbose && console.log(`${descriptor} Loaded!`, response);
//         debugStatus = "SUCCESS";
//
//         return responseEvents?.onSuccess?.(response);
//       },
//       onReject: (reason) => {
//         setStatus("FAILED");
//         // eslint-disable-next-line no-console
//         verbose && console.error(`${descriptor} Rejected!`, reason);
//         debugStatus = "FAILED";
//
//         return responseEvents?.onReject?.(reason);
//       },
//       onError: (error) => {
//         setStatus("FAILED");
//         // eslint-disable-next-line no-console
//         verbose && console.error(`${descriptor} Failed!`, error);
//         debugStatus = "FAILED";
//
//         return responseEvents?.onError?.(error);
//       },
//       onComplete: () => {
//         // eslint-disable-next-line no-console
//         verbose && console.log(`${descriptor} Status:`, debugStatus);
//
//         return responseEvents?.onComplete?.();
//       },
//     };
//
//     // The params will be intentionally mutated to avoid triggering re-renders
//     let pathParams: PathParams | undefined;
//     const setPathParams = (params?: PathParams): void => {
//       pathParams = params;
//     };
//
//     // The params will be intentionally mutated to avoid triggering re-renders
//     let queryParams: QueryParams | undefined;
//     const setQueryParams = (params?: QueryParams): void => {
//       queryParams = params;
//     };
//
//     /**
//      * Implemented `fetch` using Axios
//      */
//     const fetch: ApiRequestFetch<RequestType, ResponseType> = async (data?: RequestType) => {
//       abortController = new AbortController();
//
//       const config: FetchRequestConfig<RequestType> = {
//         url: bindPathParams(url, pathParams),
//         method,
//         params: queryParams,
//         data,
//         withCredentials,
//         signal: abortController?.signal,
//       };
//
//       return await axiosFetch<RequestType, ResponseType>(config, eventHandlers);
//     };
//
//     const abort: AbortController["abort"] = () => abortController?.abort();
//
//     return { status, fetch, abort, setResponseEvents, setQueryParams, setPathParams };
//   };
// };
