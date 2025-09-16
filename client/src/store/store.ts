import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import createSelectors from "./selectors";

type AuthState = {
  accessToken: string | null;
  user: null; // changed from 'null' to allow storing user data
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
};

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null, user: null }),
});

type StoreType = AuthState;

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get, api) => ({
          ...createAuthSlice(set, get, api), // use your Auth slice
        }))
      ),
      {
        name: "session-storage",
        getStorage: () => sessionStorage,
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
