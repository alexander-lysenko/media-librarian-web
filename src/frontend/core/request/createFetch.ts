import { useAuthCredentialsStore } from '../../store/useAuthCredentialsStore';

/**
 * Request configuration options (slightly overridden Request)
 */
type RequestConfig = RequestInit & {
  /** The resource's route (absolute URL) */
  url: string | URL;

  /** The API request method: GET, POST, PUT, DELETE, etc. */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

  /** Determines how the response data will be parsed or handled once received */
  responseType?: 'arrayBuffer' | 'blob' | 'json' | 'text';
};

/**
 * Base HTTP fetching instance based on Fetch API. Designed to be flexible and customizable.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export const createFetch = async <ResponseType = undefined>(fetchConfig: RequestConfig): Promise<ResponseType> => {
  const bearerToken = useAuthCredentialsStore.getState().token;
  const { responseType = 'json', ...config } = fetchConfig;

  const request = new Request(config.url, {
    ...config,
    method: config.method || 'GET',
    cache: config.cache || 'no-cache',
    headers: config.headers || new Headers(),
    referrer: undefined,
    referrerPolicy: 'no-referrer',
  });

  request.headers.set('Accept', 'application/json, text/plain, */*');

  if (['POST', 'PUT', 'PATCH'].includes(request.method) && !!config.body) {
    request.headers.set('Content-Type', 'application/json');
  }

  if (request.credentials !== 'omit' && !request.headers.has('Authorization') && bearerToken !== '') {
    request.headers.set('Authorization', 'Bearer ' + bearerToken);
  }

  return await fetch(request)
    .then(
      async (response): Promise<ResponseType> => {
        if (response.status === 204) {
          return Promise.resolve(undefined as never);
        }
        if ([4, 5].includes(Math.floor(response.status / 100))) {
          return Promise.reject(await response[responseType]());
        }

        return response[responseType]();
      },
      (reject) => reject,
    )
    .catch((error) => Promise.reject(error));
};
