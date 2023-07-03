import { AxiosResponse } from "axios";
import { useState } from "react";

import { baseApiRequest, BaseApiRequestConfig, BaseApiResponseEvents } from "../../core";
import { profileEndpoint } from "../../core/links";
import { RequestSlice, RequestStatus } from "../../core/types";
import { ProfileData, useProfileStore } from "../../store/useProfileStore";

type ProfileResponse = {
  user: ProfileData;
};

/**
 *
 */
export const useProfileGetRequest = (): RequestSlice<void, ProfileResponse> => {
  const [status, setStatus] = useState<RequestStatus>("IDLE");
  const [customEvents, setCustomEvents] = useState<BaseApiResponseEvents>({});
  const [abortController] = useState<AbortController>(new AbortController());

  const setProfile = useProfileStore((state) => state.setProfile);

  const events: BaseApiResponseEvents = {
    beforeSend: () => {
      setStatus("LOADING");
      customEvents.beforeSend?.();
    },
    onSuccess: (response: AxiosResponse<ProfileResponse>) => {
      setStatus("SUCCESS");
      console.log(response);
      customEvents.onSuccess?.(response);
      setProfile(response.data.user);
    },
    onReject: (reason) => {
      setStatus("FAILED");
      console.log("Rejected", reason);
      customEvents.onReject?.(reason);
    },
    onError: (error) => {
      setStatus("FAILED");
      console.log("failed", error);
      customEvents.onError?.(error);
    },
    onComplete: () => customEvents.onComplete?.(),
  };

  const fetch = async (body: void): Promise<ProfileResponse | void> => {
    const config: BaseApiRequestConfig<void> = {
      url: profileEndpoint,
      method: "GET",
      data: body,
      signal: abortController.signal,
    };

    return await baseApiRequest<void, ProfileResponse>(config, events);
  };

  return {
    status,
    fetch,
    abort: () => abortController.abort(),
    setRequestEvents: setCustomEvents,
  };
};
