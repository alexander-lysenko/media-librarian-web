import { createHttpRequestHook } from "../core";
import { enqueueSnack } from "../core/actions";
import { changePasswordEndpoint, profileEndpoint } from "../core/links";
import { useProfileStore } from "../store/useProfileStore";

import type { HttpResponseEvents, UseRequestReturn } from "../core/types";
import type { ProfileData } from "../store/useProfileStore";

type GetProfileResponse = ProfileData;

type PasswordData = {
  password: string;
  newPassword: string;
  repeatPassword: string;
};

/**
 * Request to get profile data
 * [GET] /api/v1/profile
 */
export const useProfileGetRequest = (): UseRequestReturn<void, GetProfileResponse> => {
  const setProfile = useProfileStore((state) => state.setProfile);

  const responseEvents: HttpResponseEvents<GetProfileResponse> = {
    onSuccess: (response) => {
      setProfile(response);
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
 * Request to update profile data.
 * [PUT] /api/v1/profile
 */
export const useProfilePutRequest = (): UseRequestReturn<Partial<ProfileData["user"]>, GetProfileResponse> => {
  return createHttpRequestHook<Partial<ProfileData["user"]>, GetProfileResponse>({
    method: "PUT",
    endpoint: profileEndpoint,
    customEvents: {},
    verbose: true,
  })();
};

/**
 * Request to change user's password.
 * [PUT] /api/v1/profile/password
 */
export const useProfileChangePasswordRequest = (): UseRequestReturn<PasswordData, void> => {
  const responseEvents: HttpResponseEvents<void> = {
    onSuccess: () => {
      enqueueSnack({
        type: "success",
        message: "Your password has been changed",
      });
    },
  };

  return createHttpRequestHook<PasswordData, void>({
    method: "PUT",
    endpoint: changePasswordEndpoint,
    customEvents: responseEvents,
    verbose: true,
  })();
};
