import { createHttpRequestHook } from "../core";
import { userLoginEndpoint, userPasswordResetEndpoint, userSignupEndpoint } from "../core/links";

import type { UseRequestReturn } from "../core/types";
import type { Language } from "../store/system/useTranslationStore";

interface SignupRequest {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
  locale: Language;
  theme: "dark" | "light";
}

interface SignupResponse {
  message: string;
  user: object;
}

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  redirectTo: string;
  token: string;
}

interface PasswordRecoveryInitRequest {
  email: string;
}

interface PasswordResetRequest {
  email: string;
  newPassword: string;
  repeatPassword: string;
  token: string;
}

interface MessageResponse {
  message: string;
}

/**
 * Request to signup / register / create a user.
 * [POST] /api/v1/user/signup
 */
export const useUserSignupRequest = (): UseRequestReturn<SignupRequest, SignupResponse> => {
  return createHttpRequestHook<SignupRequest, SignupResponse>({
    method: "POST",
    endpoint: userSignupEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};

/**
 * Request to authenticate a user.
 * [POST] /api/v1/user/login
 */
export const useUserLoginRequest = (): UseRequestReturn<LoginRequest, LoginResponse> => {
  return createHttpRequestHook<LoginRequest, LoginResponse>({
    method: "POST",
    endpoint: userLoginEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};

/**
 * Request to initiate password reset.
 * [POST] /api/v1/user/password-reset
 */
export const usePasswordRecoveryRequest = (): UseRequestReturn<PasswordRecoveryInitRequest, MessageResponse> => {
  return createHttpRequestHook<PasswordRecoveryInitRequest, MessageResponse>({
    method: "POST",
    endpoint: userPasswordResetEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};

/**
 * Request to perform password reset.
 * [PUT] /api/v1/user/password-reset
 */
export const usePasswordResetRequest = (): UseRequestReturn<PasswordResetRequest, MessageResponse> => {
  return createHttpRequestHook<PasswordResetRequest, MessageResponse>({
    method: "PUT",
    endpoint: userPasswordResetEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};
