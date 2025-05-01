import axios, { CanceledError } from "axios";
import { update } from "lodash-es";

import { useAuthCredentialsStore } from "../../store/useAuthCredentialsStore";

import type { ErrorResponse, HttpResponseEvents } from "../types";
import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";

/**
 * Axios Request configuration options (slightly overridden AxiosRequestConfig)
 * @deprecated
 */
export type FetchRequestConfig<Request> = AxiosRequestConfig<Request> & {
  /** The API endpoint's route (absolute URL) */
  url: string;

  /** The API request method: GET, POST, PUT, DELETE, etc. */
  method: Method;

  /** The endpoint's request payload */
  data?: Request;
};

/**
 * Create an Axios instance with a custom configuration preset
 */
const axiosInstance = () => {
  const instance = axios.create();

  instance.defaults.timeout = 5000;
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.common["Authorization"] = null;
  instance.defaults.validateStatus = (status: number): boolean => status >= 200 && status < 400;

  return instance;
};

/**
 * Base API fetch instance based on Axios request instance. Designed to be flexible and customizable.
 *
 * @param {FetchRequestConfig} config
 * @param {HttpResponseEvents} events
 * @deprecated
 */
export const axiosFetch = async <RequestType, ResponseType>(
  config: FetchRequestConfig<RequestType>,
  events: HttpResponseEvents<ResponseType>,
): Promise<ResponseType | undefined> => {
  const instance = axiosInstance();
  const bearerToken = useAuthCredentialsStore.getState().token;
  const { beforeSend, onSuccess, onReject, onError, onComplete } = events;

  if (config.withCredentials) {
    config = update(config, "headers.Authorization", (): string => `Bearer ${bearerToken}`);
  }

  beforeSend?.();

  try {
    const response = await instance.request<ResponseType, AxiosResponse<ResponseType>, RequestType>(config);
    if (response && [4, 5].includes(response.status / 100)) {
      onError?.(response as never);

      return Promise.reject(response as never);
    }
    onSuccess?.(response.data as never);

    return Promise.resolve(response.data);
  } catch (error) {
    if (error instanceof CanceledError) {
      onReject?.(error);
    } else {
      onError?.((error as AxiosError<ErrorResponse>).response?.data ?? (error as never));
    }
  } finally {
    onComplete?.();
  }

  // return await instance
  //   .request<ResponseType>(config)
  //   .then((response: AxiosResponse): ResponseType => {
  //     return response.data;
  //   })
  //   .then<ResponseType | void, never | void>(onSuccess as SuccessEventHandler, onError as ErrorEventHandler)
  //   .catch(onReject as RejectEventHandler)
  //   .finally(onComplete);
};
