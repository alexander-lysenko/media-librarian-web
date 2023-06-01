import { create } from "zustand";

import { BaseApiRequestEvents } from "../core/request/baseApiRequest";
import { AccountStatusEnum } from "../core/types";

type Profile = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_verified_at: string | null;
  deleted_at: string | null;
  status: keyof typeof AccountStatusEnum;
  avatar: string;
};

interface ProfileState {
  profile: Profile;
  getRequest: {
    fetch: () => void;
    abort?: () => void;
    events?: BaseApiRequestEvents;
    setEvents?: (events: BaseApiRequestEvents) => void;
  };
}

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
  getRequest: {
    fetch: () => null,
  },
}));
