import { AxiosResponse } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { baseApiRequest, BaseApiRequestConfig, BaseApiResponseEvents } from "../../core";
import { userLoginEndpoint } from "../../core/links";
import { RequestSlice, RequestStatus } from "../../core/types";
import { useCredentialsStore } from "../../store/useCredentialsStore";

type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type LoginResponse = {
  redirectTo: string;
  token: string;
};

export const useLoginRequest = (): RequestSlice<LoginRequest, LoginResponse> => {
  const [status, setStatus] = useState<RequestStatus>("IDLE");
  const [customEvents, setCustomEvents] = useState<BaseApiResponseEvents>({});

  const navigate = useNavigate();
  const setCredentials = useCredentialsStore((state) => state.setCredentials);

  const abortController = new AbortController();
  const events: BaseApiResponseEvents = {
    beforeSend: () => {
      setStatus("LOADING");
      customEvents.beforeSend?.();
    },
    onSuccess: (response: AxiosResponse<LoginResponse>) => {
      setStatus("SUCCESS");
      customEvents.onSuccess?.(response);

      const { email } = response.request;
      const { token, redirectTo } = response.data;
      setCredentials(email, token);
      navigate(redirectTo);
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

  const fetch = async (body: LoginRequest) => {
    const config: BaseApiRequestConfig<LoginRequest> = {
      url: userLoginEndpoint,
      method: "POST",
      data: body,
      signal: abortController.signal,
    };

    return baseApiRequest<LoginRequest, LoginResponse>(config, events);
  };

  return {
    status,
    fetch,
    abort: () => abortController.abort(),
    setEvents: setCustomEvents,
  };
};
