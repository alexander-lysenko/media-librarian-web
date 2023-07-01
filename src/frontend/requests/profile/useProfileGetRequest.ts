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
 * TODO: Fix infinite requests
 */
export const useProfileGetRequest = (): RequestSlice<void, ProfileResponse> => {
  const [status, setStatus] = useState<RequestStatus>("IDLE");
  const [customEvents, setCustomEvents] = useState<BaseApiResponseEvents>({});
  const setProfile = useProfileStore((state) => state.setProfile);

  const abortController = new AbortController();
  const events: BaseApiResponseEvents = {
    beforeSend: () => {
      setStatus("LOADING");
      customEvents.beforeSend?.();
    },
    onSuccess: (response: AxiosResponse<ProfileResponse>) => {
      setStatus("SUCCESS");
      customEvents.onSuccess?.(response);
      setProfile(response.data.user);
    },
    onReject: (reason) => {
      setStatus("FAILED");
      customEvents.onReject?.(reason);
    },
    onError: (error) => {
      setStatus("FAILED");
      customEvents.onError?.(error);
    },
    onComplete: () => customEvents.onComplete?.(),
  };

  const fetch = async (body: void) => {
    const config: BaseApiRequestConfig<void> = {
      url: profileEndpoint,
      method: "GET",
      data: body,
      signal: abortController.signal,
    };

    return baseApiRequest<void, ProfileResponse>(config, events);
  };

  return {
    status,
    fetch,
    abort: () => abortController.abort(),
    setRequestEvents: setCustomEvents,
  };
};
