import { useNavigate } from "react-router-dom";

import { createRequestHook } from "../core";
import { userLoginEndpoint } from "../core/links";
import { useAuthCredentialsStore } from "../store/useAuthCredentialsStore";

import type { FetchResponseEvents } from "../core";
import type { UseRequestReturn } from "../core/types";
import type { AxiosResponse } from "axios";
import type { UseFormReturn } from "react-hook-form";

type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type LoginResponse = {
  redirectTo: string;
  token: string;
};

type HookReturn = UseRequestReturn<LoginRequest, LoginResponse>;

/**
 * Request to authenticate a user
 * [POST] /api/v1/user/login
 */
export const useUserLoginRequest = ({ getValues, setError, reset }: UseFormReturn): HookReturn => {
  const navigate = useNavigate();
  const setCredentials = useAuthCredentialsStore((state) => state.setCredentials);

  const responseEvents: FetchResponseEvents = {
    onSuccess: (response: AxiosResponse<LoginResponse>) => {
      const { email } = getValues();
      const { token, redirectTo } = response.data;
      setCredentials(email, token);
      reset();
      navigate(redirectTo);
    },
    onReject: (reason) => {
      reset({ password: "" });
      setError("root.serverError", { message: reason.response?.data.message || reason.message });
    },
    onError: (reason) => {
      reset({ password: "" });
      setError("root.serverError", { message: reason.response?.data.message || reason.message });
    },
  };

  return createRequestHook<LoginRequest, LoginResponse>({
    method: "POST",
    endpoint: userLoginEndpoint,
    customEvents: responseEvents,
    withCredentials: false,
    verbose: true,
  })();
};
