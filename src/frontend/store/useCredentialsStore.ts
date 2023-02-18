import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CredentialsState {
  account: number;
  token: string;
  setCredentials: (account: number, token: string) => void;
}

export const useCredentialsStore = create<CredentialsState>()(
  persist(
    (set) => ({
      account: 0,
      token: "",
      setCredentials: (account, token) => set({ account, token }),
    }),
    {
      name: "credentials", // unique name
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const authTokenSelector = (state: CredentialsState) => state.token;
