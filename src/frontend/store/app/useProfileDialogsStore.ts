import { create } from "zustand";

type DialogsState = {
  usernameDialogOpen: boolean;
  setUsernameDialogOpen: (open: boolean) => void;

  emailDialogOpen: boolean;
  setEmailDialogOpen: (open: boolean) => void;

  passwordDialogOpen: boolean;
  setPasswordDialogOpen: (open: boolean) => void;

  localeDialogOpen: boolean;
  setLocaleDialogOpen: (open: boolean) => void;

  themeDialogOpen: boolean;
  setThemeDialogOpen: (open: boolean) => void;

  avatarDialogOpen: boolean;
  setAvatarDialogOpen: (open: boolean) => void;
};

export const useProfileDialogsStore = create<DialogsState>((set) => ({
  usernameDialogOpen: false,
  setUsernameDialogOpen: (open: boolean) => {
    set({ usernameDialogOpen: open });
  },

  emailDialogOpen: false,
  setEmailDialogOpen: (open: boolean) => {
    set({ emailDialogOpen: open });
  },

  passwordDialogOpen: false,
  setPasswordDialogOpen: (open: boolean) => {
    set({ passwordDialogOpen: open });
  },

  localeDialogOpen: false,
  setLocaleDialogOpen: (open: boolean) => {
    set({ localeDialogOpen: open });
  },

  themeDialogOpen: false,
  setThemeDialogOpen: (open: boolean) => {
    set({ themeDialogOpen: open });
  },

  avatarDialogOpen: false,
  setAvatarDialogOpen: (open: boolean) => {
    set({ avatarDialogOpen: open });
  },
}));
