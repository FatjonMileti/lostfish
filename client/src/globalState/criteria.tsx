import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import axios from '../utils/axios';
import { ApiCriteriaDocumentType, TransactionType } from '../pages/SetCriteria/criteria.types';

export interface CriteriaStoreType extends Partial<ApiCriteriaDocumentType> {
  lookingFor?: string;
  transactionType?: TransactionType;
  whenDoYouWantToMove?: string;
  areaOfInterest?: string;
  budgetFor: string;
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
  transactionType: undefined,
  whenDoYouWantToMove: undefined,
  areaOfInterest: undefined,
  budgetFor: '',
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
            const { data } = await axios(access_token).get<ApiCriteriaDocumentType>('/api/criteria');

            set((profile) => ({
              lookingFor: data.looking_for,
              transactionType: data.transaction_type_string,
              whenDoYouWantToMove: data.moving_time,
              areaOfInterest: data.area_of_interest,
              ...data
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
