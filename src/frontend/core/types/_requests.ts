import { AxiosError } from "axios";

import { BaseApiRequestConfig, BaseApiResponseEvents } from "../request/baseApiRequest";

export type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILED";

export type FetchRequest = () => void;

export type RequestSlice = {
  status: RequestStatus;
  fetch: () => void;
  abort: () => void;
  errorHandler: (error: AxiosError) => void;
  setErrorHandler: () => void;
};

export type BaseApiRequest<Request, Response = void> = (
  config: BaseApiRequestConfig<Request>,
  events: BaseApiResponseEvents<Response>,
) => Promise<Response | void>;
