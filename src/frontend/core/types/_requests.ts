import type { DataRow } from "./_dataTable";
import type { LibraryElement, LibraryItem, LibraryItemFormValues, LibrarySchema } from "./_library";

export type PathParams = Record<string, string | number>;
export type QueryParams = Record<string, string | number | string[] | number[]>;

// == core request types == //

/**
 * List of customizable response event handlers
 */
export interface HttpResponseEvents<ResponseType = never> {
  /** The payload to be executed before the request is run */
  beforeSend?: () => void;

  /** The payload to be executed when the request is successfully fulfilled */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onSuccess?: (response: ResponseType) => ResponseType | void;

  /** The payload to be executed when the request is rejected or unsuccessfully fulfilled */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onReject?: (reason: ErrorResponse | never) => PromiseLike<ErrorResponse> | never | void;

  /** The payload to be executed when the request is failed */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onError?: (reason: ErrorResponse | never) => PromiseLike<ErrorResponse> | never | void;

  /** The payload to be executed when the request is completed regardless of its status */
  onComplete?: () => void;
}

export type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "FAILED";

export interface HttpRequestHookConfig<ResponseType = never> {
  endpoint: string;
  method: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK";
  customEvents?: HttpResponseEvents<ResponseType>;
  withCredentials?: boolean; // default: true
  abortController?: AbortController;
  verbose?: boolean; // default: false
}

/** The unified error response interface */
export interface ErrorResponse {
  message: string;
  code?: string;
  // validation errors (if present)
  errors?: Record<string, string[]>;

  // dev environment only
  exception?: string;
  file?: string;
  line?: string;
  trace?: never[];
}

export type ApiRequestFetch<Request, Response> = (
  data?: Request,
  options?: {
    signal?: AbortSignal;
    fakeResponse?: Response;
  },
) => Promise<Response | undefined>;

export interface ApiRequestHookReturn<Request, Response> {
  status: RequestStatus;
  fetch: ApiRequestFetch<Request, Response>;
  abort: AbortController["abort"];
}

export interface UseRequestReturn<Request, Response> {
  status: RequestStatus;
  fetch: ApiRequestFetch<Request, Response>;
  abort: AbortController["abort"];
  setResponseEvents: (events: HttpResponseEvents<Response>) => void;
  setQueryParams: (params?: QueryParams) => void;
  setPathParams: (params?: PathParams) => void;
}

// == useLibraryRequests == //

// noinspection IdentifierGrammar
export interface GetLibrariesResponse {
  data: LibrarySchema[];
}

export interface GetLibraryResponse {
  data: LibrarySchema;
  meta: {
    created_at: string;
    items_count: number;
  };
}

export interface PatchLibraryResponse {
  data: {
    id: number;
    title: string;
  };
  meta: {
    status: "truncated";
    items_affected: number;
  };
}

export interface CreateLibraryRequest {
  title: string;
  fields: { name: string; type: LibraryElement }[];
}

export interface CreateLibraryResponse {
  data: LibrarySchema;
}

// == useLibraryItemsRequests == //

export type GetLibraryItemsRequest = undefined;

export interface GetLibraryItemsResponse {
  items: DataRow[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface PostLibraryItemRequest {
  contents: LibraryItemFormValues;
  poster?: string;
}

export interface LibraryItemResponse {
  item: LibraryItem;
  poster: string;
}
