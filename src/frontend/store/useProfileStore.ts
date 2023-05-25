import { create } from "zustand";

import { BaseApiRequestEvents } from "../core/request/baseApiRequest";
import { createRequestSlice } from "../core/request/createRequestSlice";

type Profile = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_verified_at: string;
  deleted_at: string;
  status: "CREATED" | "ACTIVE" | "BANNED" | "DELETED";
  avatar: string;
};

interface ProfileState {
  user?: Profile;
  request: {
    execute: () => void;
    abort: () => void;
    events: BaseApiRequestEvents;
    setEvents: (events: BaseApiRequestEvents) => void;
  };
}

export const useProfileStore = create((set, get) => ({
  profile: undefined,
  ...createRequestSlice(set, get),
}));
