import { create } from "zustand";

interface LoginFormState {
  emailUniqueProcessing: boolean;
  setEmailUniqueProcessing: (state: boolean) => void;
}

export const useSignupFormStore = create<LoginFormState>((set, get) => ({
  emailUniqueProcessing: false,
  setEmailUniqueProcessing: (state) => set({ emailUniqueProcessing: state }),
}));
