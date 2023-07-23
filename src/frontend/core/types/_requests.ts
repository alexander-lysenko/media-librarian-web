import { Method } from "axios";

import { FetchResponseEvents } from "../request/axiosFetch";
import { LibraryElement, LibrarySchema } from "./_library";

type PathParams = Record<string, string | number>;

export type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILED";

export type ApiRequestHookConfig = {
  endpoint: string;
  method: Method;
  customEvents: FetchResponseEvents;
  verbose?: boolean;
  simulate?: boolean;
};

export type ApiRequestFetch<Request, Response> = (
  data: Request,
  pathParams?: PathParams,
  options?: {
    fakeResponse?: Response;
  },
) => Promise<Response | void>;

export type ApiRequestHookReturn<Request, Response> = {
  status: RequestStatus;
  fetch: ApiRequestFetch<Request, Response>;
  abort: AbortController["abort"];
};

export type UseRequestReturn<Request, Response> = {
  status: RequestStatus;
  fetch: ApiRequestFetch<Request, Response>;
  abort: () => void;
  setResponseEvents: (events: FetchResponseEvents) => void;
};

// == useLibraryRequests == //

// noinspection IdentifierGrammar
export type GetLibrariesResponse = {
  data: LibrarySchema[];
};

export type GetLibraryResponse = {
  data: LibrarySchema;
  meta: {
    created_at: string;
    items_count: number;
  };
};

export type PatchLibraryResponse = {
  data: {
    id: number;
    title: string;
  };
  meta: {
    status: "truncated";
    items_affected: number;
  };
};

export type CreateLibraryRequest = {
  title: string;
  fields: { name: string; type: LibraryElement }[];
};

export type CreateLibraryResponse = {
  data: LibrarySchema;
};
