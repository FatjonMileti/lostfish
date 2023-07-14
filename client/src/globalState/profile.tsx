import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import axios from '../utils/axios';

export interface ProfileStoreType {
  avatar?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  set: (
    partial:
      | ProfileStoreType
      | Partial<ProfileStoreType>
      | ((state: ProfileStoreType) => ProfileStoreType | Partial<ProfileStoreType>),
    replace?: boolean | undefined
  ) => void;
  fetchProfile: (access_token: string) => Promise<void>;
  reset: () => void;
}

const profileInitialState = {
  avatar: undefined,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  description: ''
};

export const useProfileStore = create<ProfileStoreType>()(
  devtools(
    persist(
      (set) => ({
        ...profileInitialState,
        set,
        reset: () => set((profile) => ({ ...profileInitialState })),
        fetchProfile: async (access_token: string) => {
          try {
            const { data } = await axios(access_token).get('/api/account/me');
            set((profile) => ({
              ...profile,
              avatar: data.avatar,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              description: data.description
            }));
          } catch (err: any) {
            if (err.response.code === 404) {
              set((profile) => ({ ...profileInitialState }));
            }
          }
        }
      }),
      { name: 'profile' }
    ),
    {
      store: 'profile'
    }
  )
);
