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
import { Backdrop } from '../../components/Backdrop';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId?: string;
  setEditPropertyId: (propertyId: string) => void;
}

export interface NewPropertyStateType {
  currentStep: number;
  newImages: File[];
  loadingProperty: boolean;
  savingProperty: boolean;
}

export const NewProperty = styled(
  ({ className, showStore, propertyId, setEditPropertyId }: NewPropertyProps) => {
    const [modalVisibility, setModalVisibility] = showStore;

    const {
      user: [{ auth }]
    } = useGlobalState();

    const [state, setState] = React.useState<NewPropertyStateType>({
      currentStep: 0,
      newImages: [],
      loadingProperty: false,
      savingProperty: false
    });

    console.log('newIMages: ', state.newImages);

    const step0Form = useForm<Step0FormType>({
      defaultValues: {
        lookingFor: 'Rent'
      },
      resolver: yupResolver(step0Schema),
      mode: 'all'
    });

    const step1Form = useForm<Step1FormType>({
      defaultValues: {
        areaOfInterest: 'London, UK',
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
        area: 50,
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

    React.useEffect(() => {
      if (propertyId) {
        setState((state) => ({ ...state, loadingProperty: true }));
        loadProperty().finally(() => {
          setState((state) => ({ ...state, loadingProperty: false }));
        });
      }
    }, [propertyId]);

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

    const saveProperty = async () => {
      try {
        const data = {
          //step 0
          // transaction_type_string: state.lookingFor,
          // name: "",

          //step 1
          // area_of_interest: state.areaOfInterest,
          // radius: state.radius,
          // property_type: state.propertyType,
          // property_preference: state.propertyPreferences, //'New Home',
          // // property_features: [
          //   state.propertyFeatures.parksNearby ? ['Parks Nearby'] : [],
          //   state.propertyFeatures.publicTransportNearby ? ['Public transport nearby'] : [],
          //   state.propertyFeatures.shoppingCentersNearby ? ['Shopping centers nearby'] : []
          // ].flat(),
          asset_address: {
            latitude: 51.5072178,
            longitude: -0.1275862
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
            // rental_amount: state.rentingPrice,
            // rental_frequency: state.paymentFrequency,
            deposit_amount: '200',
            interest_by: '6/15/2023',
            available_from: '6/15/2023'
          },
          // credit_score_requirements: state.creditScoreRequirements,
          // contract_details: [
          //   state.contractDetails.guarantor ? ['Guarantor'] : [],
          //   state.contractDetails.reviewedProperty ? ['Reviewed property'] : [],
          //   state.contractDetails.energyCertificate ? ['Energy certificate'] : []
          // ].flat(),

          status_string: 'Draft'
        };

        // const response = await axios(auth.access_token).post('/api/asset/draft', data);
      } catch (err) {
        console.log(err);
      }
    };

    const saveAsDraft = async () => {
      try {
        if (state.newImages.length > 0) {
          const imageLinks = await uploadImages(state.newImages);
          console.log('imageLinks: ', imageLinks);
          step2Form.setValue('propertyImages', imageLinks);
        }

        const payload = {
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

        console.log('payload', payload);
        const { data } = await axios(auth.access_token).post('/api/asset/draft', payload);

        setEditPropertyId(data._id);

        console.log('response.data: ', data);
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
        <Backdrop open={state.savingProperty}></Backdrop>
        {state.currentStep === 1 && (
          <NewPropertyStep1
            closeModal={() => setModalVisibility(false)}
            saveAsDraft={async () => {
              setState((state) => ({ ...state, savingProperty: true }));
              await saveAsDraft();
              setState((state) => ({ ...state, savingProperty: false }));
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
  }
)`
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
