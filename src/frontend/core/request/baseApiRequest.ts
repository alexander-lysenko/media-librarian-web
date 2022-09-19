import { AxiosRequestConfig, Method } from "axios";

import { useCredentialsStore } from "../../store/useCredentialsStore";
import { axiosInstance } from "./axiosInstance";

/**
 * Base API request configuration options (slightly overridden AxiosRequestConfig)
 */
export type BaseApiRequestConfig<Request = unknown> = AxiosRequestConfig<Request> & {
  /** The API endpoint's route (absolute URL) */
  url: string;

  /** The API request method: GET, POST, PUT, DELETE, etc */
  method: Method;
};

/**
 * A type for events of base API request
 */
export type BaseApiRequestEvents = {
  /** The payload to be executed before the request is run */
  beforeSend?: () => void;

  /** The payload to be executed when the request is successfully fulfilled */
  onSuccess?: (response: unknown) => void;

  /** The payload to be executed when the request is rejected or unsuccessfully fulfilled */
  onReject?: (response: unknown) => void;

  /** The payload to be executed when the request is failed */
  onError?: (error: unknown) => void;

  /** The payload to be executed when the request is completed regardless of its status */
  onComplete?: () => void;
};

/**
 * Base API request instance based on Axios request instance. Designed to be flexible and customizable.
 *
 * @param {BaseApiRequestConfig} config
 * @param {BaseApiRequestEvents} events
 */
export const baseApiRequest = async (config: BaseApiRequestConfig, events: BaseApiRequestEvents) => {
  const instance = axiosInstance();
  const { beforeSend, onSuccess, onReject, onError, onComplete } = events;
  const onErrorFallback = (error: unknown) => console.error(error);

  const bearerToken = useCredentialsStore.getState().token;
  if (!config?.headers?.["Authorization"]) {
    config = { ...config, headers: { ...config.headers, Authorization: `Bearer ${bearerToken}` } };
  }

  beforeSend && beforeSend();

  return await instance
    .request(config)
    .then(onSuccess, onReject)
    .catch(onError || onErrorFallback)
    .finally(onComplete);
};
