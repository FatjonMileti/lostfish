import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
}

export const useProfileStore = create<ProfileStoreType>()(
  persist(
    (set) => ({
      avatar: undefined,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      description: '',
      set,
      fetchProfile: async (access_token: string) => {
        const { data } = await axios(access_token).get('/api/account/me');
        set((profile) => ({ ...profile, ...data }));
      }
    }),
    { name: 'profile' }
  )
);
