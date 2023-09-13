import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import axios from '../utils/axios';

export interface CriteriaStoreType {
  lookingFor?: string;
  transactionType?: string;
  whenDoYouWantToMove?: string;
  areaOfInterest?: string;
  budget: number[];
  frequency: string;
  nrOfBedrooms: number[];
  set: (
    partial:
      | CriteriaStoreType
      | Partial<CriteriaStoreType>
      | ((state: CriteriaStoreType) => CriteriaStoreType | Partial<CriteriaStoreType>),
    replace?: boolean | undefined
  ) => void;
  fetchCriteria: (access_token: string) => Promise<void>;
  reset: () => void;
}

const criteriaInitialState = {
  lookingFor: undefined,
  transactionType: 'Rent',
  whenDoYouWantToMove: undefined,
  areaOfInterest: undefined,
  budget: [1000, 5200],
  frequency: '',
  nrOfBedrooms: [1, 4]
};

export const useCriteriaStore = create<CriteriaStoreType>()(
  devtools(
    persist(
      (set) => ({
        ...criteriaInitialState,
        set,
        reset: () => set((profile) => ({ ...criteriaInitialState })),
        fetchCriteria: async (access_token: string) => {
          try {
            const { data } = await axios(access_token).get('/api/criteria');

            set((profile) => ({
              lookingFor: data.looking_for,
              transactionType: data.transaction_type_string,
              whenDoYouWantToMove: data.moving_time,
              areaOfInterest: data.area_of_interest,
              frequency: data.frequency
            }));
          } catch (err: any) {
            if (err.response.status === 404) {
              set((profile) => ({ ...criteriaInitialState }));
            } else {
              console.log('criteria error: ', err.response.status);
            }
          }
        }
      }),
      { name: 'criteria' }
    ),
    {
      store: 'criteria'
    }
  )
);
