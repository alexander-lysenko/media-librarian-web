import { AxiosError } from "axios";

import { BaseApiRequestConfig, BaseApiResponseEvents } from "../request/baseApiRequest";

export type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILED";

export type FetchRequest = () => void;

export type RequestSlice<Request, Response> = {
  status: RequestStatus;
  fetch: (data: Request) => Promise<Response | void>;
  abort: () => void;
  setEvents: (events: BaseApiResponseEvents) => void;
};
