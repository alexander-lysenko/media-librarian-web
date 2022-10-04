import create from "zustand";
import { persist } from "zustand/middleware";

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
      getStorage: () => localStorage,
      serialize: (state) => JSON.stringify(state),
      deserialize: (value) => JSON.parse(value),
    },
  ),
);

export const authTokenSelector = (state: CredentialsState) => state.token;
