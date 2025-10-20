import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import createSelectors from "./selectors";

type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
  currentWorkspace?: {
    _id: string;
    name: string;
    description: string;
    owner: string;
    inviteCode: string;
    createdAt: string;
    updatedAt: string;
  };
};

type AuthState = {
  accessToken: string | null;
  user: UserType | null;
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
          ...createAuthSlice(set, get, api),
        }))
      ),
      {
        name: "session-storage",
        storage: {
          getItem: (name: string) => {
            const item = sessionStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          },
          setItem: (name: string, value: unknown) => {
            sessionStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name: string) => {
            sessionStorage.removeItem(name);
          },
        },
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
