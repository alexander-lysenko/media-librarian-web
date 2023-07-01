import { create } from "zustand";

import { AccountStatusEnum } from "../core/types";

export type ProfileData = {
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

interface ProfileState {
  profile: ProfileData;
  setProfile: (user: ProfileData) => void;
}

/**
 * Store for profile info
 * Currently stores account info only. TODO: add profile stats
 */
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: {
    id: 1,
    name: "Vasiliy Pupkin",
    email: "vasyapupkinverylongemailaddress@example.com",
    avatar: "https://source.unsplash.com/dFnoV-mpiGY/240x240",
    created_at: "2020-01-01",
    updated_at: "2022-12-31",
    email_verified_at: "2020-01-01",
    deleted_at: null,
    status: "BANNED",
  },
  setProfile: (user: ProfileData) => set({ profile: user }),
}));
