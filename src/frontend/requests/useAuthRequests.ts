import { createHttpRequestHook } from "../core";
import { userLoginEndpoint, userPasswordResetEndpoint } from "../core/links";

import type { UseRequestReturn } from "../core/types";

type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type LoginResponse = {
  redirectTo: string;
  token: string;
};

type PasswordRecoveryInitRequest = {
  email: string;
};

type PasswordResetRequest = {
  email: string;
  newPassword: string;
  repeatPassword: string;
  token: string;
};

type MessageResponse = {
  message: string;
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
    method: "POST",
    endpoint: userPasswordResetEndpoint,
    customEvents: {},
    withCredentials: false,
  })();
};
