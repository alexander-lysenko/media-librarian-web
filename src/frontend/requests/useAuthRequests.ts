import { useNavigate } from "react-router-dom";

import { createHttpRequestHook } from "../core";
import { userLoginEndpoint } from "../core/links";
import { useAuthCredentialsStore } from "../store/useAuthCredentialsStore";

import type { HttpResponseEvents, UseRequestReturn } from "../core/types";
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

  const responseEvents: HttpResponseEvents<LoginResponse> = {
    onSuccess: (response) => {
      const { email } = getValues();
      const { token, redirectTo } = response;
      setCredentials(email, token);
      reset();
      navigate(redirectTo);
    },
    onReject: (reason) => {
      reset({ password: "" });
      setError("root.serverError", { message: reason.message });
    },
    onError: (reason) => {
      reset({ password: "" });
      setError("root.serverError", { message: reason.message });
    },
  };

  return createHttpRequestHook<LoginRequest, LoginResponse>({
    method: "POST",
    endpoint: userLoginEndpoint,
    customEvents: responseEvents,
    withCredentials: false,
  })();
};
