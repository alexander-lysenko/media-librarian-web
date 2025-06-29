import type { Language } from '../../store/system/useTranslationStore';
import type { DataRow } from './_dataTable';
import type { LibraryElement, LibraryItem, LibraryItemFormValues, LibrarySchema } from './_library';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { FieldValues } from 'react-hook-form';

export type PathParams = Record<string, string | number>;
export type QueryParams = Record<string, string | number | string[] | number[]>;

// == Request Hooks Powered by Tanstack Query == //
/**
 * Type alias for representing a selective subset of the `UseQueryResult` object, typically used in query handling
 * within a React Query context.
 * This is designed to encapsulate only the essential query-related properties needed
 * for working with queries.
 */
export type RequestQueryReturn<Response = undefined> = Pick<
  UseQueryResult<Response, ErrorResponse | Error | null>,
  'refetch' | 'data' | 'error' | 'status'
>;
/**
 * Type alias for representing a selective subset of the `UseMutationResult` object, typically used in mutation handling
 * within a React Query context.
 * This is designed to encapsulate only the essential mutation-related properties needed
 * for working with mutations.
 */
export type RequestMutationReturn<Response = undefined, Request = undefined> = Pick<
  UseMutationResult<Response, ErrorResponse | Error, Request, unknown>,
  'mutate' | 'mutateAsync' | 'data' | 'error' | 'status'
>;

// == core request types == //

/**
 * List of customizable response event handlers
 * @deprecated
 */
export interface HttpResponseEvents<ResponseType = never> {
  /** The payload to be executed before the request is run */
  beforeSend?: () => void;

  /** The payload to be executed when the request is successfully fulfilled */
  onSuccess?: (response: ResponseType) => ResponseType | void;

  /** The payload to be executed when the request is rejected or unsuccessfully fulfilled */
  onReject?: (reason: ErrorResponse | never) => PromiseLike<ErrorResponse> | never | void;

  /** The payload to be executed when the request is failed */
  onError?: (reason: ErrorResponse | never) => PromiseLike<ErrorResponse> | never | void;

  /** The payload to be executed when the request is completed regardless of its status */
  onComplete?: () => void;
}
/** @deprecated */
export type RequestStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED';
/** @deprecated */
export interface HttpRequestHookConfig<ResponseType = never> {
  endpoint: string;
  method: 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';
  customEvents?: HttpResponseEvents<ResponseType>;
  withCredentials?: boolean; // default: true
  abortController?: AbortController;
  verbose?: boolean; // default: false
}

/**
 * Represents an error response typically returned by an API or server.
 * This interface defines the structure of the error object that contains
 * details about the error encountered.
 */
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

/** @deprecated */
export type ApiRequestFetch<Request, Response> = (
  data?: Request,
  options?: {
    signal?: AbortSignal;
    fakeResponse?: Response;
  },
) => Promise<Response | undefined>;
/** @deprecated */
export interface ApiRequestHookReturn<Request, Response> {
  status: RequestStatus;
  fetch: ApiRequestFetch<Request, Response>;
  abort: AbortController['abort'];
}

/** @deprecated */
export interface UseRequestReturn<Request, Response> {
  status: RequestStatus;
  fetch: ApiRequestFetch<Request, Response>;
  abort: AbortController['abort'];
  setResponseEvents: (events: HttpResponseEvents<Response>) => void;
  setQueryParams: (params?: QueryParams) => void;
  setPathParams: (params?: PathParams) => void;
}

export interface SignupFormData extends FieldValues {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
  locale: Language;
  theme: 'dark' | 'light';
}

export interface SignupResponse {
  message: string;
  user: object;
}

export interface LoginFormData extends FieldValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  redirectTo: string;
  token: string;
}

export interface PasswordResetFormData extends FieldValues {
  email: string;
  newPassword: string;
  repeatPassword: string;
  token: string;
}

export interface PasswordChangeFormData extends FieldValues {
  password: string;
  newPassword: string;
  repeatPassword: string;
}

// == libraryRequests == //

// noinspection IdentifierGrammar
/**
 * Represents the response structure for retrieving a list of Libraries.
 *
 * @property {LibrarySchema[]} data - An array of Library schemas.
 */
export interface GetLibrariesResponse {
  data: LibrarySchema[];
}

/**
 * Represents the response structure for retrieving a library.
 *
 * @property {LibrarySchema} data - The schema data of the retrieved library.
 * @property {Object} meta - Metadata associated with the response.
 * @property {string} meta.created_at - ISO 8601 formatted string representing when the library was created.
 * @property {number} meta.items_count - The total number of items in the library.
 */
export interface GetLibraryResponse {
  data: LibrarySchema;
  meta: {
    created_at: string;
    items_count: number;
  };
}

/**
 * Represents the response structure for the response when a Library entry gets truncated.
 *
 * @property {LibrarySchema} data - The schema data of the truncated Library.
 * @property {Object} meta - Metadata associated with the response.
 * @property {string} meta.status - The status of the truncated Library.
 * @property {number} meta.items_affected - The number of items affected by the truncation.
 */
export interface PatchLibraryResponse {
  data: {
    id: number;
    title: string;
  };
  meta: {
    status: 'truncated';
    items_affected: number;
  };
}

/**
 * Represents a request to create a Library with a specified title and fields.
 *
 * @property {string} title - The title of the Library being created.
 * @property {{ name: string; type: LibraryElement }[]} fields
 * An array of field definitions, where each field contains a name and a type.
 */
export interface LibraryFormData {
  title: string;
  fields: { name: string; type: LibraryElement }[];
}

/**
 * Represents the response received after creating a Library.
 *
 * @property {LibrarySchema} data - The schema of the Library that was created.
 */
export interface CreateLibraryResponse {
  data: LibrarySchema;
}

// == libraryItemRequests == //
/** @deprecated */
export type GetLibraryItemsRequest = undefined;

/**
 * Represents the structure of the response received when fetching Library Items.
 * The response includes a list of items and pagination details.
 */
export interface GetLibraryItemsResponse {
  items: DataRow[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

/**
 * Represents a request to create or update a library item in the system.
 *
 * @property {LibraryItemFormValues} contents - The main data structure containing the values of the Library Item form.
 * @property {string} [poster] - (optional) The URL or path to the poster image associated with the Library Item.
 */
export interface LibraryItemFormData {
  contents: LibraryItemFormValues;
  poster?: string;
}

/**
 * Represents the response structure for a Library Item.
 * This interface encapsulates the details of a Library Item along with its associated poster.
 *
 * @property {LibraryItem} item - The Library Item details.
 * @property {string} poster - The URL or path to the poster image associated with the Library Item.
 */
export interface LibraryItemResponse {
  item: LibraryItem;
  poster: string;
}

// == unsplashApiRequests == //
/**
 * Represents the parameters for an Unsplash search request.
 *
 * Use this interface to define the possible query parameters when performing a search request
 * to the Unsplash API.
 * Each property is optional and provides additional filtering capabilities.
 *
 * Properties:
 * - query: A string representing the search term or keyword.
 * - topics: An array of strings specifying topic IDs to filter the search results.
 * - collections: An array of strings containing collection IDs to narrow down the search.
 */
export interface UnsplashSearchRequest {
  query?: string;
  topics?: string[];
  collections?: string[];
}

/**
 * Represents the structure of a response from the Unsplash API wrapper.
 */
export interface UnsplashApiResponse {
  image: {
    id: string;
    linkHtml: string;
    urlFull: string;
    urlRegular: string;
    urlSmall: string;
    author: string;
  };
}
