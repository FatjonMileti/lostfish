import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Modal } from '../../components/Modal';

import { NewPropertyStep0 } from './Newproperty.Step0';
import { NewPropertyStep1 } from './NewProperty.Step1';
import { NewPropertyStep2 } from './NewProperty.Step2';
import { NewPropertyStep3 } from './NewProperty.Step3';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
}

export interface NewPropertyStateType {
  currentStep: number;
  lookingFor: number;

  areaOfInterest: string | undefined;
  propertyType: null | string;
  propertyPreferences: null | string;
  propertyFeatures: {
    parksNearBy: boolean;
    publicTransportNearby: boolean;
    shoppingCentersNearby: boolean;
  };
  radius: string | undefined;

  area: string | undefined;
  nrOfBedrooms: string | undefined;
  nrOfBathrooms: string | undefined;
  specificPropertyFeatures: {
    parkingSpot: boolean;
    garden: boolean;
    terrace: boolean;
    fullyFurnished: boolean;
    partiallyFurnished: boolean;
    unfurnished: boolean;
    doubleGlazing: boolean;
    allowsSmoking: boolean;
    allowsPets: boolean;
    closeToPublicTransport: boolean;
  };
  propertyImages: any[];

  rentingPrice: string | undefined;
  promotionalPrice: string | undefined;
  monthsPayedInAdvance: string | undefined;
  creditScoreRequirements: string | undefined;
  contractDetails: {
    guarantor: boolean;
    reviewedProperty: boolean;
    energyCertificate: boolean;
  };
}

export type SetterFunction<T> = (val: T) => void;

export type SettersType<T> = {
  [P in keyof T as `set${Capitalize<string & P>}`]: SetterFunction<T[P]>;
};

export interface PropertyService extends SettersType<NewPropertyStateType> {
  state: NewPropertyStateType;
  setItemState: (itemKey: keyof NewPropertyStateType) => void;
}

export const NewProperty = styled(({ className, showStore }: NewPropertyProps) => {
  const [modalVisibility, setModalVisibility] = showStore;

  const [state, setState] = React.useState<NewPropertyStateType>({
    currentStep: 0,
    lookingFor: 0,
    areaOfInterest: undefined,
    radius: undefined,
    propertyType: null,
    propertyPreferences: null,
    propertyFeatures: {
      parksNearBy: false,
      publicTransportNearby: false,
      shoppingCentersNearby: false
    },

    nrOfBedrooms: undefined,
    nrOfBathrooms: undefined,
    area: undefined,
    specificPropertyFeatures: {
      parkingSpot: false,
      garden: false,
      terrace: false,
      fullyFurnished: false,
      partiallyFurnished: false,
      unfurnished: false,
      doubleGlazing: false,
      allowsSmoking: false,
      allowsPets: false,
      closeToPublicTransport: false
    },
    propertyImages: [],

    rentingPrice: undefined,
    promotionalPrice: undefined,
    monthsPayedInAdvance: undefined,
    creditScoreRequirements: undefined,
    contractDetails: {
      guarantor: false,
      reviewedProperty: false,
      energyCertificate: false
    }
  });

  const setItemState = (itemKey: keyof NewPropertyStateType) => {
    return (itemValue: NewPropertyStateType[typeof itemKey]) =>
      setState((state) => ({ ...state, [itemKey]: itemValue }));
  };

  const newPropertyService: PropertyService = {
    state,
    setCurrentStep: setItemState('currentStep'),
    setLookingFor: setItemState('lookingFor'),
    setAreaOfInterest: setItemState('areaOfInterest'),
    setRadius: setItemState('radius'),
    setPropertyType: setItemState('propertyType'),
    setPropertyPreferences: setItemState('propertyPreferences'),
    setPropertyFeatures: setItemState('propertyFeatures'),
    setArea: setItemState('area'),
    setNrOfBedrooms: setItemState('nrOfBedrooms'),
    setNrOfBathrooms: setItemState('nrOfBathrooms'),
    setSpecificPropertyFeatures: setItemState('specificPropertyFeatures'),
    setRentingPrice: setItemState('rentingPrice'),
    setPropertyImages: setItemState('propertyImages'),
    setPromotionalPrice: setItemState('promotionalPrice'),
    setMonthsPayedInAdvance: setItemState('monthsPayedInAdvance'),
    setCreditScoreRequirements: setItemState('creditScoreRequirements'),
    setContractDetails: setItemState('contractDetails'),
    setItemState
  };

  return (
    <Modal
      className={`new-property-modal ${className}`}
      open={modalVisibility}
      onBackdropClick={() => setModalVisibility(false)}
      onClose={() => setModalVisibility(false)}>
      {state.currentStep === 0 && (
        <NewPropertyStep0 closeModal={() => setModalVisibility(false)} propertyService={newPropertyService} />
      )}

      {state.currentStep === 1 && (
        <NewPropertyStep1
          closeModal={() => setModalVisibility(false)}
          saveAsDraft={() => {
            setModalVisibility(false);
          }}
          newPropertyService={newPropertyService}
        />
      )}

      {state.currentStep === 2 && (
        <NewPropertyStep2
          closeModal={() => setModalVisibility(false)}
          saveAsDraft={() => {
            setModalVisibility(false);
          }}
          propertyService={newPropertyService}
        />
      )}

      {state.currentStep === 3 && (
        <NewPropertyStep3
          closeModal={() => setModalVisibility(false)}
          saveAsDraft={() => {
            setModalVisibility(false);
          }}
          propertyService={newPropertyService}
        />
      )}
    </Modal>
  );
})`
  &.new-property-modal {
    width: 100vw;
    height: 100vh;

    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;

    .modal-container {
      padding: 0;
    }
  }
`;
