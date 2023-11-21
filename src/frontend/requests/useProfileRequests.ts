import { useState } from "react";

import { enqueueSnack } from "../core/actions";
import { profileEndpoint } from "../core/links";
import { useApiRequest } from "../hooks";
import { useProfileStore } from "../store/useProfileStore";

import type { FetchResponseEvents } from "../core";
import type { UseRequestReturn } from "../core/types";
import type { ProfileData } from "../store/useProfileStore";
import type { AxiosResponse } from "axios";

type GetProfileResponse = {
  user: ProfileData;
};

/**
 * Request to get profile data
 * [GET] /api/v1/profile
 */
export const useProfileGetRequest = (): UseRequestReturn<void, GetProfileResponse> => {
  const setProfile = useProfileStore((state) => state.setProfile);

  const [responseEvents, setResponseEvents] = useState<FetchResponseEvents>({
    onSuccess: (response: AxiosResponse<GetProfileResponse>) => {
      setProfile(response.data.user);
      enqueueSnack({
        type: "success",
        message: "Profile loaded",
      });
    },
  });

  const { fetch, abort, status } = useApiRequest<void, GetProfileResponse>({
    method: "GET",
    endpoint: profileEndpoint,
    customEvents: responseEvents,
    verbose: true,
  });

  return { status, fetch, abort, setResponseEvents };
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
