import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStoreType = {
  rememberMe: boolean;
  auth?: any;
  userDetails: any;
  ability: any;
  set: (
    partial:
      | UserStoreType
      | Partial<UserStoreType>
      | ((state: UserStoreType) => UserStoreType | Partial<UserStoreType>),
    replace?: boolean | undefined
  ) => void;
};
export const useUserStore = create<UserStoreType>()(
  persist(
    (set) => ({
      rememberMe: false,
      auth: null,
      userDetails: null,
      ability: null,
      set
    }),
    { name: 'userStore' }
  )
);
