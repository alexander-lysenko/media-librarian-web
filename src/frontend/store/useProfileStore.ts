import { create } from "zustand";

import { profileEndpoint } from "../core/links";
import { baseApiRequest, BaseApiRequestConfig, BaseApiResponseEvents } from "../core/request/baseApiRequest";
import { AccountStatusEnum, FetchRequest, RequestSlice, RequestStatus } from "../core/types";

type Profile = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status: keyof typeof AccountStatusEnum;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  avatar: string;
};

type ProfileResponse = {
  user: Profile;
};

interface ProfileState {
  profile: Profile;
  getRequestStatus: RequestStatus;
  getRequest: FetchRequest;
  putRequestStatus: RequestStatus;
  putRequest: FetchRequest;
}

// const createGetRequestSlice = (set, get, title): RequestSlice => ({
//   [title]: {
//     status: "IDLE",
//     fetch: () => true,
//   },
// });

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: {
    id: 1,
    name: "Vasiliy Pupkin",
    email: "vasyapupkinverylongemailaddress@example.com",
    avatar: "https://source.unsplash.com/TkJbk1I22hE/240x240",
    created_at: "2020-01-01",
    updated_at: "2022-12-31",
    email_verified_at: "2020-01-01",
    deleted_at: null,
    status: "BANNED",
  },
  getRequestStatus: "IDLE",
  getRequest: async () => {
    const config: BaseApiRequestConfig<void> = {
      url: profileEndpoint,
      method: "GET",
    };

    const events: BaseApiResponseEvents = {
      beforeSend: () => set({ getRequestStatus: "LOADING" }),
      onSuccess: (response) => {
        set({ profile: response.data.user });
        set({ getRequestStatus: "SUCCESS" });
        console.log(response);
      },
      onReject: (reason) => {
        console.log("Rejected:", reason);
      },
      onError: (error) => {
        console.log("errorrrrr:", error);
        set({ getRequestStatus: "FAILED" });
      },
    };

    return baseApiRequest<void, ProfileResponse>(config, events);
  },
  putRequestStatus: "IDLE",
  putRequest: () => null,
}));
