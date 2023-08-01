import { Modal } from '../../components/Modal';
import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { SetCriteriaStep0, Step0FormType, step0Schema } from './SetCriteria.Step0';
import { SetCriteriaStep1, Step1FormType, step1Schema } from './SetCriteria.Step1';
import { SetCriteriaStep2, Step2FormType, step2Schema } from './SetCriteria.Step2';
import { SetCriteriaStep3, Step3FormType, step3Schema } from './SetCriteria.Step3';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../utils/axios';

import { useUserStore } from '../../globalState/user';
import request from '../../utils/axios';
import { Backdrop } from '../../components/Backdrop';

export interface SetCriteriaProps extends HTMLAttributes<HTMLDivElement> {
  criteriaId?: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  afterRefineSearch?: () => void;
}

export interface NewCriteriaStateType {
  currentStep: number;
  loadingProperty: boolean;
}

export const SetCriteria = styled(
  ({ className, criteriaId, setShowModal, afterRefineSearch = () => {} }: SetCriteriaProps) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { auth } = useUserStore();

    const [state, setState] = React.useState<NewCriteriaStateType>({
      currentStep: criteriaId ? 1 : 0,
      loadingProperty: false
    });

    const step0Form = useForm<Step0FormType>({
      defaultValues: {
        lookingFor: 'Rent'
      },
      resolver: yupResolver(step0Schema),
      mode: 'all'
    });

    const step1Form = useForm<Step1FormType>({
      defaultValues: {
        areaOfInterest: '',
        location: {},
        radius: undefined,
        propertyType: {
          Detached: false,
          'Semi-Detached': false,
          Terraced: false,
          Flats: false,
          Bungalows: false,
          'Farms/Land': false,
          'Park homes': false
        },
        propertyClass: {
          'New home': true,
          'Retirement home': true,
          'Shared ownership': true,
          Auction: true
        },

        propertyFeatures: {
          'Parks nearby': true,
          'Public transport nearby': true,
          'Shopping centers nearby': true
        }
      },
      resolver: yupResolver(step1Schema),
      mode: 'all'
    });

    const step2Form = useForm<Step2FormType>({
      defaultValues: {
        area: [50, 100],
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
        }
      },
      resolver: yupResolver(step2Schema),
      mode: 'all'
    });

    const step3Form = useForm<Step3FormType>({
      defaultValues: {
        idealBudget: [1000, 5000],
        depositAmount: undefined,
        creditScore: 'Excellent',
        contractDetails: {
          Guarantor: false,
          'Reviewed Property': false,
          'Energy Certificate': false
        }
      },
      resolver: yupResolver(step3Schema),
      mode: 'all'
    });

    React.useEffect(() => {
      loadCriteria();
      console.log('loadingCriteria');
    }, []);
    const loadCriteria = async () => {
      try {
        setLoading(true);
        const { data } = await request(auth.access_token).get('/api/criteria');

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('criteria: ', data);
        // step 0
        step0Form.setValue('lookingFor', data.transaction_type_string);

        // step 1
        step1Form.setValue('areaOfInterest', data.area_of_interest);

        step1Form.setValue('location', {
          latitude: data?.asset_address?.latitude,
          longitude: data?.asset_address?.longitude
        });

        step1Form.setValue('radius', data.radius);

        data.property_type.map((type: keyof Step1FormType['propertyType']) => {
          step1Form.setValue(`propertyType.${type}`, true);
        });

        (Object.keys(step1Form.getValues('propertyClass')) as [keyof Step1FormType['propertyClass']]).forEach(
          (key) => {
            step1Form.setValue(`propertyClass.${key}`, data.property_preferences.includes(key));
          }
        );

        (
          Object.keys(step1Form.getValues('propertyFeatures')) as [keyof Step1FormType['propertyFeatures']]
        ).forEach((key) => {
          step1Form.setValue(`propertyFeatures.${key}`, data.property_features.includes(key));
        });

        // step 2

        step2Form.setValue('area', [
          parseInt(data.floor_size.split('-')[0]),
          parseInt(data.floor_size.split('-')[1])
        ]);
        step2Form.setValue('nrOfBedrooms', data.room_details?.number_of_bedrooms);
        step2Form.setValue('nrOfBathrooms', data.room_details?.number_of_bathrooms);
        step2Form.setValue(
          'specificPropertyFeatures',
          data.specific_property_features.reduce((acc: { [key: string]: boolean }, spf: string) => {
            acc[spf] = true;
            return acc;
          }, {})
        );
        // step 3
        step3Form.setValue('idealBudget', [
          parseInt(data.budget.split('-')[0]),
          parseInt(data.budget.split('-')[1])
        ]);
        step3Form.setValue('depositAmount', data.deposit_amount);
        step3Form.setValue('creditScore', data.credit_score_requirements);
        step3Form.setValue(
          'contractDetails',
          data.contract_details.reduce((acc: { [key: string]: boolean }, cd: string) => {
            acc[cd] = true;
            return acc;
          }, {})
        );
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async () => {
      try {
        setLoading(true);
        const payload = {
          // step0
          transaction_type_string: step0Form.getValues('lookingFor'),

          // step1
          area_of_interest: step1Form.getValues('areaOfInterest'),
          asset_address: step1Form.getValues('location'),

          radius: step1Form.getValues('radius'),
          property_type: Object.entries(step1Form.getValues('propertyType'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key),
          property_preferences: [
            step1Form.getValues('propertyClass.New home') ? ['New home'] : [],
            step1Form.getValues('propertyClass.Retirement home') ? ['Retirement home'] : [],
            step1Form.getValues('propertyClass.Shared ownership') ? ['Shared ownership'] : [],
            step1Form.getValues('propertyClass.Shared ownership') ? ['Auction'] : []
          ].flat(),
          property_features: [
            step1Form.getValues('propertyFeatures.Parks nearby') ? ['Parks nearby'] : [],
            step1Form.getValues('propertyFeatures.Public transport nearby')
              ? ['Public transport nearby']
              : [],
            step1Form.getValues('propertyFeatures.Shopping centers nearby') ? ['Shopping centers nearby'] : []
          ].flat(),

          // step2
          floor_size: `${step2Form.getValues('area')[0]}-${step2Form.getValues('area')[1]}`,
          room_details: {
            number_of_bathrooms: step2Form.getValues('nrOfBathrooms') || undefined,
            number_of_bedrooms: step2Form.getValues('nrOfBedrooms') || undefined
          },
          specific_property_features: Object.entries(step2Form.getValues('specificPropertyFeatures'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key),

          // step 3
          budget: `${step3Form.getValues('idealBudget')[0]} - ${step3Form.getValues('idealBudget')[1]}`,
          deposit_amount: step3Form.getValues('depositAmount'),
          credit_score_requirements: step3Form.getValues('creditScore'),
          contract_details: Object.entries(step3Form.getValues('contractDetails'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key)
        };

        await axios(auth.access_token).patch(`/api/criteria`, payload);

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        afterRefineSearch();
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const setCurrentStep = (currentStep: number): void => {
      setState((state) => ({ ...state, currentStep }));
    };

    return (
      <Modal
        open={true}
        onBackdropClick={() => setShowModal(false)}
        className={`set-criteria-modal ${className}`}>
        <Backdrop open={loading} />
        {/* Set criteria steps */}
        {state.currentStep === 0 && (
          <SetCriteriaStep0
            closeModal={() => setShowModal(false)}
            form={step0Form}
            setCurrentStep={setCurrentStep}
          />
        )}
        {state.currentStep === 1 && (
          <SetCriteriaStep1
            closeModal={() => setShowModal(false)}
            form={step1Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            criteriaId={criteriaId}
          />
        )}

        {state.currentStep === 2 && (
          <SetCriteriaStep2
            closeModal={() => setShowModal(false)}
            form={step2Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            criteriaId={criteriaId}
          />
        )}

        {state.currentStep === 3 && (
          <SetCriteriaStep3
            closeModal={() => setShowModal(false)}
            form={step3Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            criteriaId={criteriaId}
            handleSubmit={handleSubmit}
          />
        )}
      </Modal>
    );
  }
)`
  &.set-criteria-modal {
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
