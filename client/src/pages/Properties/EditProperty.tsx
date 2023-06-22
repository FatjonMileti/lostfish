import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Modal } from '../../components/Modal';

import { NewPropertyStep0, Step0FormType, step0Schema } from './Newproperty.Step0';
import { NewPropertyStep1, Step1FormType, step1Schema } from './NewProperty.Step1';
import { NewPropertyStep2, Step2FormType, step2Schema } from './NewProperty.Step2';
import { NewPropertyStep3, Step3FormType, step3Schema } from './NewProperty.Step3';
import axios from '../../utils/axios';
import { useGlobalState } from '../../globalState';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../utils/axios';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId?: string;
}

export interface NewPropertyStateType {
  currentStep: number;
  newImages: File[];
  loadingProperty: boolean;
}

export const EditProperty = styled(({ className, showStore, propertyId }: NewPropertyProps) => {
  const [modalVisibility, setModalVisibility] = showStore;

  const {
    user: [{ auth }]
  } = useGlobalState();

  React.useEffect(() => {
    if (propertyId) {
      loadProperty().finally(() => {
        setState((state) => ({ ...state, loadingProperty: false }));
      });
    }
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const { data } = await request(auth.access_token).get(`/api/asset/${propertyId}`);

      // step 0
      step0Form.setValue('lookingFor', data.transaction_type_string);

      // step 1
      step1Form.setValue('areaOfInterest', data.area_of_interest);
      //   asset_address: {
      //   latitude: 51.5072178,
      //     longitude: -0.1275862
      // },
      step1Form.setValue('radius', data.radius);
      step1Form.setValue('propertyType', data.property_type);
      step1Form.setValue('propertyPreferences', data.property_preference);
      step1Form.setValue('propertyFeatures.parksNearby', data.property_features.includes('Parks Nearby'));
      step1Form.setValue(
        'propertyFeatures.publicTransportNearby',
        data.property_features.includes('Public transport nearby')
      );
      step1Form.setValue(
        'propertyFeatures.shoppingCentersNearby',
        data.property_features.includes('Shopping centers nearby')
      );

      // step2
      step2Form.setValue('area', data.floor_size);
      step2Form.setValue('nrOfBedrooms', data.room_details.number_of_bedrooms);
      step2Form.setValue('nrOfBathrooms', data.room_details.number_of_bathrooms);
      step2Form.setValue(
        'specificPropertyFeatures',
        data.specific_property_features.reduce((acc: { [key: string]: boolean }, spf: string) => {
          acc[spf] = true;
          return acc;
        }, {})
      );

      // step 3
      step3Form.setValue('rentingPrice', data.asset_rent.rental_amount);
      step3Form.setValue('paymentFrequency', data.asset_rent.rental_frequency);
      step3Form.setValue('depositAmount', data.asset_rent.deposit_amount);
      step3Form.setValue('creditScoreRequirements', data.credit_score_requirements);
      step3Form.setValue(
        'contractDetails',
        data.contact_details.reduce((acc: { [key: string]: boolean }, cd: string) => {
          acc[cd] = true;
          return acc;
        }, {})
      );

      console.log('propertyData: ', data);
    } catch (err) {
      throw err;
    }
  };

  const [state, setState] = React.useState<NewPropertyStateType>({
    currentStep: 1,
    newImages: [],
    loadingProperty: true
  });

  const step0Form = useForm<Step0FormType>({
    defaultValues: {
      lookingFor: undefined
    },
    resolver: yupResolver(step0Schema),
    mode: 'all'
  });

  const step1Form = useForm<Step1FormType>({
    defaultValues: {
      areaOfInterest: '',
      radius: undefined,
      propertyType: undefined,
      propertyPreferences: undefined,
      propertyFeatures: {
        parksNearby: false,
        publicTransportNearby: false,
        shoppingCentersNearby: false
      }
    },
    resolver: yupResolver(step1Schema),
    mode: 'all'
  });

  const step2Form = useForm<Step2FormType>({
    defaultValues: {
      area: 0,
      nrOfBedrooms: undefined,
      nrOfBathrooms: undefined,
      specificPropertyFeatures: {
        'Parking spot': false,
        Garden: false,
        Terrace: false,
        'Fully furnished': false,
        'Partially furnished': false,
        Unfurnished: false,
        'Double glazing': false,
        'Allows smoking': false,
        'Allows pets': false,
        'Close to public transport': false
      },
      propertyImages: []
    },
    resolver: yupResolver(step2Schema),
    mode: 'all'
  });

  const step3Form = useForm<Step3FormType>({
    defaultValues: {
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
    },
    resolver: yupResolver(step3Schema),
    mode: 'all'
  });

  const uploadImages = async (images: File[]): Promise<any> => {
    try {
      const data = new FormData();

      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await axios(auth.access_token).post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const saveAsDraft = async () => {
    try {
      if (state.newImages.length > 0) {
        const imageLinks = await uploadImages(state.newImages);
        console.log('imageLinks: ', imageLinks);
      }

      const data = {
        // step0
        transaction_type_string: step0Form.getValues('lookingFor'),

        // step1
        area_of_interest: step1Form.getValues('areaOfInterest'),
        asset_address: {
          latitude: 51.5072178,
          longitude: -0.1275862
        },
        radius: step1Form.getValues('radius'),
        property_type: step1Form.getValues('propertyType'),
        property_preference: step1Form.getValues('propertyPreferences'),
        property_features: [
          step1Form.getValues('propertyFeatures.parksNearby') ? ['Parks Nearby'] : [],
          step1Form.getValues('propertyFeatures.publicTransportNearby') ? ['Public transport nearby'] : [],
          step1Form.getValues('propertyFeatures.shoppingCentersNearby') ? ['Shopping centers nearby'] : []
        ].flat(),

        // step2
        floor_size: step2Form.getValues('area'),
        room_details: {
          number_of_bathrooms: step2Form.getValues('nrOfBathrooms') || undefined,
          number_of_bedrooms: step2Form.getValues('nrOfBedrooms') || undefined
        },
        specific_property_features: Object.entries(step2Form.getValues('specificPropertyFeatures'))
          .filter(([key, value]) => value)
          .map(([key, value]) => key),
        property_images: [],

        // step 3
        asset_rent: {
          rental_amount: step3Form.getValues('rentingPrice'),
          rental_frequency: step3Form.getValues('paymentFrequency'),
          deposit_amount: step3Form.getValues('depositAmount')
        },
        credit_score_requirements: step3Form.getValues('creditScoreRequirements'),
        contact_details: Object.entries(step3Form.getValues('contractDetails'))
          .filter(([key, value]) => value)
          .map(([key, value]) => key)
      };

      console.log('data', data);
      const response = await axios(auth.access_token).patch(`/api/asset/${propertyId}`, data);

      console.log('response: ', response);
    } catch (err) {
      throw err;
    }
  };

  const setCurrentStep = (currentStep: number): void => {
    setState((state) => ({ ...state, currentStep }));
  };

  return (
    <Modal
      className={`new-property-modal ${className}`}
      open={modalVisibility}
      onBackdropClick={() => setModalVisibility(false)}
      onClose={() => setModalVisibility(false)}>
      {state.currentStep === 0 && (
        <NewPropertyStep0
          closeModal={() => setModalVisibility(false)}
          form={step0Form}
          setCurrentStep={setCurrentStep}
        />
      )}

      {state.currentStep === 1 && (
        <NewPropertyStep1
          closeModal={() => setModalVisibility(false)}
          saveAsDraft={() => {
            saveAsDraft();
          }}
          form={step1Form}
          lookingFor={step0Form.getValues('lookingFor')}
          setCurrentStep={setCurrentStep}
        />
      )}

      {state.currentStep === 2 && (
        <NewPropertyStep2
          closeModal={() => setModalVisibility(false)}
          saveAsDraft={() => {
            saveAsDraft();
          }}
          form={step2Form}
          lookingFor={step0Form.getValues('lookingFor')}
          setCurrentStep={setCurrentStep}
          newImages={state.newImages}
          setNewImages={(newImages: File[]) => setState((state) => ({ ...state, newImages }))}
        />
      )}

      {state.currentStep === 3 && (
        <NewPropertyStep3
          closeModal={() => setModalVisibility(false)}
          saveAsDraft={() => {
            // console.log('step3Data: ', step3Form.getValues());
            saveAsDraft();
          }}
          form={step3Form}
          lookingFor={step0Form.getValues('lookingFor')}
          setCurrentStep={setCurrentStep}
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
