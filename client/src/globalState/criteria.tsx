import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../utils/axios';

export interface CriteriaStoreType {
  lookingFor?: string;
  transactionType?: string;
  whenDoYouWantToMove?: string;
  areaOfInterest?: string;
  startedMatching: boolean;
  set: (
    partial:
      | CriteriaStoreType
      | Partial<CriteriaStoreType>
      | ((state: CriteriaStoreType) => CriteriaStoreType | Partial<CriteriaStoreType>),
    replace?: boolean | undefined
  ) => void;
}

export const useCriteriaStore = create<CriteriaStoreType>()(
  persist(
    (set) => ({
      lookingFor: undefined,
      transactionType: undefined,
      whenDoYouWantToMove: undefined,
      areaOfInterest: undefined,
      startedMatching: false,
      set
    }),
    { name: 'criteria' }
  )
);
