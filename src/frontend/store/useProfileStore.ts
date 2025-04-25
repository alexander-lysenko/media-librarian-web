import { create } from "zustand";

import type { AccountStatusEnum } from "../core/enums";
import type { Language } from "./system/useTranslationStore";
import type { PaletteMode } from "@mui/material";

interface UserData {
  id: number;
  name: string;
  email: string;
  locale: Language;
  theme: PaletteMode | string;
  avatar: string | null;
}

interface StatsData {
  status: keyof typeof AccountStatusEnum;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  librariesTotal: number;
  itemsTotal: number;
}

export interface ProfileData {
  user: UserData;
  stats: StatsData;
}

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
      name: "Unauthenticated Person",
      email: "this.email.address.does.not.exist@example.com",
      locale: "en",
      theme: "light",
      avatar: "https://source.unsplash.com/dFnoVmpiGY/240x240",
    },
    stats: {
      status: "BANNED",
      emailVerifiedAt: null,
      createdAt: "1970-01-01 00:00:00",
      updatedAt: "2024-12-31 23:59:59",
      deletedAt: null,
      librariesTotal: 0,
      itemsTotal: 0,
    },
  },
  setProfile: (profile: ProfileData) => set({ profile }),
}));
