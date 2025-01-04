import type { DataRow } from "./_dataTable";
import type { LibraryElement, LibraryItem, LibraryItemFormValues, LibrarySchema } from "./_library";

type PathParams = Record<string, string | number>;

// == core request types == //

/**
 * List of customizable response event handlers
 */
export type HttpResponseEvents<ResponseType = never> = {
  /** The payload to be executed before the request is run */
  beforeSend?: () => void;

  /** The payload to be executed when the request is successfully fulfilled */
  onSuccess?: (response: ResponseType) => ResponseType | void;

  /** The payload to be executed when the request is rejected or unsuccessfully fulfilled */
  onReject?: (reason: ErrorResponse | never) => PromiseLike<ErrorResponse> | never | void;

  /** The payload to be executed when the request is failed */
  onError?: (reason: ErrorResponse | never) => void;

  /** The payload to be executed when the request is completed regardless of its status */
  onComplete?: () => void;
};

export type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILED";

export type HttpRequestHookConfig<ResponseType = never> = {
  endpoint: string;
  method: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK";
  customEvents?: HttpResponseEvents<ResponseType>;
  verbose?: boolean; // default: false
  withCredentials?: boolean; // default: true
};

/** The unified error response interface */
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
  setResponseEvents: (events: HttpResponseEvents<Response>) => void;
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

// == useLibraryItemsRequests == //

export type GetLibraryItemsRequest = void;

export type GetLibraryItemsResponse = {
  items: DataRow[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

export type PostLibraryItemRequest = {
  contents: LibraryItemFormValues;
  poster?: string;
};

export type LibraryItemResponse = {
  item: LibraryItem;
  poster: string;
};
