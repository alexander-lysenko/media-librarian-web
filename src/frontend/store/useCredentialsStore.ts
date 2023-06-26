import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CredentialsState {
  email: string;
  token: string;
  setCredentials: (email: string, token: string) => void;
  clear: () => void;
}

/**
 * Store for authentication credentials.
 * Persists data in local storage
 */
export const useCredentialsStore = create<CredentialsState>()(
  persist(
    (set) => ({
      email: "",
      token: "",
      setCredentials: (email, token) => set({ email, token }),
      clear: () => set({ email: "", token: "" }),
    }),
    {
      name: "credentials", // unique name
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const authTokenSelector = (state: CredentialsState) => state.token;
