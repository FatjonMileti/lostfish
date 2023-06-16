import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Modal } from '../../components/Modal';

import { NewPropertyStep0 } from './Newproperty.Step0';
import { NewPropertyStep1 } from './NewProperty.Step1';
import { NewPropertyStep2 } from './NewProperty.Step2';
import { NewPropertyStep3 } from './NewProperty.Step3';
import axios from '../../utils/axios';
import { useGlobalState } from '../../globalState';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
}

export interface NewPropertyStateType {
  currentStep: number;
  lookingFor: string;

  areaOfInterest: string | undefined;
  propertyType: string;
  propertyPreferences: string;
  propertyFeatures: {
    parksNearby: boolean;
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
  paymentFrequency: string | undefined;
  depositAmount: string | undefined;
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

  const {
    user: [{ auth }]
  } = useGlobalState();

  const [state, setState] = React.useState<NewPropertyStateType>({
    currentStep: 0,
    lookingFor: 'Rent',
    areaOfInterest: 'London, UK',
    radius: undefined,
    propertyType: '',
    propertyPreferences: '',
    propertyFeatures: {
      parksNearby: false,
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
    paymentFrequency: undefined,
    depositAmount: undefined,
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
    setDepositAmount: setItemState('depositAmount'),
    setCreditScoreRequirements: setItemState('creditScoreRequirements'),
    setContractDetails: setItemState('contractDetails'),
    setPaymentFrequency: setItemState('paymentFrequency'),
    setItemState
  };

  const saveProperty = async () => {
    try {
      const data = {
        //step 0
        transaction_type_string: state.lookingFor,
        // name: "",

        //step 1
        area_of_interest: state.areaOfInterest,
        radius: state.radius,
        property_type: state.propertyType,
        property_preference: state.propertyPreferences, //'New Home',
        property_features: [
          state.propertyFeatures.parksNearby ? ['Parks Nearby'] : [],
          state.propertyFeatures.publicTransportNearby ? ['Public transport nearby'] : [],
          state.propertyFeatures.shoppingCentersNearby ? ['Shopping centers nearby'] : []
        ].flat(),
        asset_address: {
          latitude: 51.5072178,
          longitude: -0.1275862
          //   street_number: "",
          //   route: "",
          //   neighbourhood: "",
          //   postal_town: "",
          //   postal_code: "",
          //   administrative_area_level_1: "",
          //   country_code: "GBR",
          //   text: ""
        },

        //step 2
        floor_size: 0,
        room_details: {
          number_of_bathrooms: 1,
          number_of_bedrooms: 1
        },
        specific_property_features: ['Garden', 'Terrace'],
        property_images: [],

        //step 3
        asset_rent: {
          rental_amount: state.rentingPrice,
          rental_frequency: state.paymentFrequency,
          deposit_amount: '200',
          interest_by: '6/15/2023',
          available_from: '6/15/2023'
        },
        credit_score_requirements: state.creditScoreRequirements,
        contract_details: [
          state.contractDetails.guarantor ? ['Guarantor'] : [],
          state.contractDetails.reviewedProperty ? ['Reviewed property'] : [],
          state.contractDetails.energyCertificate ? ['Energy certificate'] : []
        ].flat(),

        status_string: 'Draft'
      };

      console.log('data: ', data);

      // const response = await axios(auth.access_token).post('/api/asset/draft', data);
    } catch (err) {
      console.log(err);
    }
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
            saveProperty();
            // setModalVisibility(false);
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
