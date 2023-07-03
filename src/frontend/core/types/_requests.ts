import { Method } from "axios";

import { FetchResponseEvents } from "../request/axiosFetch";

export type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILED";

export type ApiRequestHookConfig = {
  endpoint: string;
  method: Method;
  customEvents: FetchResponseEvents;
  verbose?: boolean;
};

export type ApiRequestHookReturn<Request, Response> = {
  status: RequestStatus;
  fetch: (data: Request) => Promise<Response | void>;
  abort: AbortController["abort"];
};

export type UseRequestReturn<Request, Response> = {
  status: RequestStatus;
  fetch: (data: Request) => Promise<Response | void>;
  abort: () => void;
  setResponseEvents: (events: FetchResponseEvents) => void;
};
