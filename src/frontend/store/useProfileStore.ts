import { create } from 'zustand';

import type { AccountStatusEnum } from '../core/enums';
import type { Language } from './system/useTranslationStore';
import type { PaletteMode } from '@mui/material';

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
  profile: ProfileData | null;
  setProfile: (profile: ProfileData) => void;
}

/**
 * Store for the data about profile
 */
export const useProfileStore = create<ProfileState>((set) => ({
  profile: {} as ProfileData,
  setProfile: (profile: ProfileData) => set({ profile }),
}));
