import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";

import { useCredentialsStore } from "../../store/useCredentialsStore";

/**
 * Request configuration options (slightly overridden AxiosRequestConfig)
 */
export type BaseApiRequestConfig<Request> = AxiosRequestConfig<Request> & {
  /** The API endpoint's route (absolute URL) */
  url: string;

  /** The API request method: GET, POST, PUT, DELETE, etc */
  method: Method;

  /** The endpoint's request payload */
  data?: Request;
};

export type ErrorResponse = {
  message: string;
  // validation errors (if present)
  errors?: Record<string, string[]>;

  // dev environment only
  exception?: string;
  file?: string;
  line?: string;
  trace?: never[];
};

/**
 * Event handlers - typed aliases
 */
type BeforeSendEventHandler = () => void;
type SuccessEventHandler = (response: AxiosResponse) => Promise<never> | void;
type RejectEventHandler = (reason: AxiosError<ErrorResponse>) => PromiseLike<never> | never | void;
type ErrorEventHandler = (reason: unknown) => void;
type FinallyEventHandler = () => void;

/**
 * List of customizable events of request
 */
export type BaseApiResponseEvents = {
  /** The payload to be executed before the request is run */
  beforeSend?: BeforeSendEventHandler;

  /** The payload to be executed when the request is successfully fulfilled */
  onSuccess?: SuccessEventHandler;

  /** The payload to be executed when the request is rejected or unsuccessfully fulfilled */
  onReject?: RejectEventHandler;

  /** The payload to be executed when the request is failed */
  onError?: ErrorEventHandler;

  /** The payload to be executed when the request is completed regardless of its status */
  onComplete?: FinallyEventHandler;
};

/**
 * Create an Axios instance with custom configuration preset
 */
const axiosInstance = () => {
  const instance = axios.create();

  instance.defaults.timeout = 5000;
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.common["Authorization"] = "Bearer 0000";
  instance.defaults.validateStatus = (status: number): boolean => status >= 200 && status < 400;

  return instance;
};

/**
 * Base API request instance based on Axios request instance. Designed to be flexible and customizable.
 *
 * @param {BaseApiRequestConfig} config
 * @param {BaseApiResponseEvents} events
 */

export const baseApiRequest = async <Request, Response>(
  config: BaseApiRequestConfig<Request>,
  events: BaseApiResponseEvents,
): Promise<Response | void> => {
  const instance = axiosInstance();

  const { beforeSend, onSuccess, onReject, onError, onComplete } = events;

  const bearerToken = useCredentialsStore.getState().token;
  if (!config?.headers?.["Authorization"]) {
    config = { ...config, headers: { ...config.headers, Authorization: `Bearer ${bearerToken}` } };
  }

  beforeSend && beforeSend();

  return await instance
    .request<Response>(config)
    .then<Response | void, never | void>(onSuccess, onReject)
    .catch(onError)
    .finally(onComplete);
};
