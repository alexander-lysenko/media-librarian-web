import { createHttpRequestHook } from "../core";
import { enqueueSnack } from "../core/actions";
import { profileEndpoint } from "../core/links";
import { useProfileStore } from "../store/useProfileStore";

import type { HttpResponseEvents, UseRequestReturn } from "../core/types";
import type { ProfileData } from "../store/useProfileStore";

type GetProfileResponse = ProfileData;

/**
 * Request to get profile data
 * [GET] /api/v1/profile
 */
export const useProfileGetRequest = (): UseRequestReturn<void, GetProfileResponse> => {
  const setProfile = useProfileStore((state) => state.setProfile);

  const responseEvents: HttpResponseEvents<GetProfileResponse> = {
    onSuccess: (response) => {
      setProfile(response);
      enqueueSnack({
        type: "success",
        message: "Profile loaded",
      });
    },
  };

  return createHttpRequestHook<void, GetProfileResponse>({
    method: "GET",
    endpoint: profileEndpoint,
    customEvents: responseEvents,
    verbose: true,
  })();
};

/**
 * Request to update profile data
 * [PUT] /api/v1/profile
 */
// export const useProfilePutRequest = (): RequestHookReturn<void, GetProfileResponse> => {
//   const setProfile = useProfileStore((state) => state.setProfile);
//
//   const [customEvents, setCustomEvents] = useState<BaseApiResponseEvents>({
//     onSuccess: (response: AxiosResponse<GetProfileResponse>) => {
//       setProfile(response.data.user);
//     },
//   });
//
//   const { fetch, abort, status } = useApiRequest<void, GetProfileResponse>(
//     "PUT",
//     profileEndpoint,
//     undefined,
//     customEvents,
//   );
//
//   return {
//     status,
//     fetch,
//     abort,
//     setResponseEvents: setCustomEvents,
//   };
// };
