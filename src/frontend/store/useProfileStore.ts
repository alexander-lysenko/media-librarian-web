import { create } from "zustand";

import type { AccountStatusEnum } from "../core/enums";
import type { Language } from "./system/useTranslationStore";
import type { PaletteMode } from "@mui/material";

type UserData = {
  id: number;
  name: string;
  email: string;
  locale: Language;
  theme: PaletteMode | string;
  avatar: string;
};

type StatsData = {
  status: keyof typeof AccountStatusEnum;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  librariesTotal: number;
  itemsTotal: number;
};

export type ProfileData = {
  user: UserData;
  stats: StatsData;
};

interface ProfileState {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
}

/**
 * Store for the data about profile
 */
export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    user: {
      id: 1,
      name: "Vasiliy Pupkin",
      email: "vasyapupkinverylongemailaddress@example.com",
      locale: "en",
      theme: "light",
      avatar: "https://source.unsplash.com/dFnoV-mpiGY/240x240",
    },
    stats: {
      status: "BANNED",
      emailVerifiedAt: null,
      createdAt: "2020-01-01 00:00:00",
      updatedAt: "2022-12-31 00:00:00",
      deletedAt: null,
      librariesTotal: 0,
      itemsTotal: 0,
    },
  },
  setProfile: (profile: ProfileData) => set({ profile }),
}));
