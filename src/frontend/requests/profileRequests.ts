import { createHttpRequestHook } from "../core";
import { enqueueSnack } from "../core/actions";
import { changePasswordEndpoint, profileEndpoint } from "../core/links";
import { useProfileStore } from "../store/useProfileStore";

import type { HttpResponseEvents, UseRequestReturn } from "../core/types";
import type { ProfileData } from "../store/useProfileStore";

type GetProfileResponse = ProfileData;

interface PasswordData {
  password: string;
  newPassword: string;
  repeatPassword: string;
}

/**
 * Request to get profile data
 * [GET] /api/v1/profile
 */
export const useProfileGetRequest = (): UseRequestReturn<undefined, GetProfileResponse> => {
  const setProfile = useProfileStore((state) => state.setProfile);

  const responseEvents: HttpResponseEvents<GetProfileResponse> = {
    onSuccess: (response) => {
      setProfile(response);
    },
  };

  return createHttpRequestHook<undefined, GetProfileResponse>({
    method: "GET",
    endpoint: profileEndpoint,
    customEvents: responseEvents,
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
  })();
};

/**
 * Request to change user's password.
 * [PUT] /api/v1/profile/password
 */
export const useProfileChangePasswordRequest = (): UseRequestReturn<PasswordData, undefined> => {
  const responseEvents: HttpResponseEvents<undefined> = {
    onSuccess: () => {
      enqueueSnack({
        type: "success",
        message: "Your password has been changed",
      });
    },
  };

  return createHttpRequestHook<PasswordData, undefined>({
    method: "PUT",
    endpoint: changePasswordEndpoint,
    customEvents: responseEvents,
  })();
};
