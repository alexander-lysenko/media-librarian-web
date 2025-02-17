import { create } from "zustand";

interface FormState {
  emailUniqueProcessing: boolean;
  setEmailUniqueProcessing: (state: boolean) => void;
}

export const useSignupFormStore = create<FormState>((set) => ({
  emailUniqueProcessing: false,
  setEmailUniqueProcessing: (state) => set({ emailUniqueProcessing: state }),
}));
