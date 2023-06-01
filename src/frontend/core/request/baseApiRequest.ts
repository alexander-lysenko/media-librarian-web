import axios, { AxiosRequestConfig, Method } from "axios";

import { useCredentialsStore } from "../../store/useCredentialsStore";

/**
 * Base API request configuration options (slightly overridden AxiosRequestConfig)
 */
export type BaseApiRequestConfig<Request = never> = AxiosRequestConfig<Request> & {
  /** The API endpoint's route (absolute URL) */
  url: string;

  /** The API request method: GET, POST, PUT, DELETE, etc */
  method: Method;

  /** The endpoint's request payload */
  data?: Request;
};

/**
 * A type for events of base API request
 */
export type BaseApiRequestEvents<Response = unknown> = {
  /** The payload to be executed before the request is run */
  beforeSend?: () => void;

  /** The payload to be executed when the request is successfully fulfilled */
  onSuccess?: (response: Response) => Response | PromiseLike<Response>;

  /** The payload to be executed when the request is rejected or unsuccessfully fulfilled */
  onReject?: (reason: unknown) => never | PromiseLike<never>;

  /** The payload to be executed when the request is failed */
  onError?: (reason: unknown) => void;

  /** The payload to be executed when the request is completed regardless of its status */
  onComplete?: () => void;
};

/**
 * Create an Axios instance with custom configuration preset
 */
const axiosInstance = () => {
  const instance = axios.create();

  instance.defaults.timeout = 5000;
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.common["Authorization"] = "Bearer 0000";

  return instance;
};

/**
 * Base API request instance based on Axios request instance. Designed to be flexible and customizable.
 *
 * @param {BaseApiRequestConfig} config
 * @param {BaseApiRequestEvents} events
 */
type BaseApiRequest = <Request, Response = void>(
  config: BaseApiRequestConfig<Request>,
  events: BaseApiRequestEvents<Response>,
) => Promise<Response | void>;

export const baseApiRequest = async <Request, Response = void>(
  config: BaseApiRequestConfig<Request>,
  events: BaseApiRequestEvents<Response>,
): Promise<Response | void> => {
  const instance = axiosInstance();

  const { beforeSend, onSuccess, onReject, onError, onComplete } = events;
  const onErrorFallback = (reason: unknown) => console.error(reason);

  const bearerToken = useCredentialsStore.getState().token;
  if (!config?.headers?.["Authorization"]) {
    config = { ...config, headers: { ...config.headers, Authorization: `Bearer ${bearerToken}` } };
  }

  beforeSend && beforeSend();

  return await instance
    .request<Request, Response>(config)
    .then<Response>(onSuccess, onReject)
    .catch(onError || onErrorFallback)
    .finally(onComplete);
};
