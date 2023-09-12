import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import axios from '../utils/axios';
import { IUser_Documents } from '../pages/MyAccount/user.interface';

export interface ProfileStoreType {
  id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  age: number;
  address: string;
  martial_status: string;
  have_pets: string;
  description: string;
  agreed_application_policy: boolean;
  signed_transaction_agreement: boolean;
  has_transaction_agreement: boolean;
  transaction_agreement_link: string | undefined;
  documents: IUser_Documents[];
  trust_score: number;
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
  id: '',
  avatar: undefined,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
  agreed_application_policy: false,
  signed_transaction_agreement: false,
  has_transaction_agreement: false,
  transaction_agreement_link: undefined,
  description: '',
  documents: [],
  trust_score: 0,
  age: 0,
  address: '',
  martial_status: '',
  have_pets: ''
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
              id: data._id,
              avatar: data.avatar,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              role: data.role,
              description: data.description,
              agreed_application_policy: data.agreed_application_policy,
              signed_transaction_agreement: data.signed_transaction_agreement,
              has_transaction_agreement: data.has_transaction_agreement,
              transaction_agreement_link: data.transaction_agreement_link,
              documents: data.documents || [],
              trust_score: data.trust_score,
              age: data.age,
              address: data.address,
              martial_status: data.martial_status,
              have_pets: data.have_pets ? 'Yes' : 'No'
            }));
          } catch (err: any) {
            if (err.response.code === 404) {
              set((profile) => ({ ...profileInitialState }));
            }
            throw err;
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
