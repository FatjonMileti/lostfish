import { Modal } from '../../components/Modal';
import { styled } from '@mui/system';
import { Button } from '../../components/Button';
import React, { HTMLAttributes, useState } from 'react';
import { SetCriteriaStep0, Step0FormType, step0Schema } from './SetCriteria.Step0';
import { SetCriteriaStep1, Step1FormType, step1Schema } from './SetCriteria.Step1';
import { SetCriteriaStep2, Step2FormType, step2Schema } from './SetCriteria.Step2';
import { SetCriteriaStep3, Step3FormType, step3Schema } from './SetCriteria.Step3';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGlobalState } from '../../globalState';
import request from '../../utils/axios';

export interface SetCriteriaProps extends HTMLAttributes<HTMLDivElement> {
  criteriaId?: string;
}

export interface NewCriteriaStateType {
  currentStep: number;
  loadingProperty: boolean;
  deletePropertyConfirmationModal: boolean;
}

export const SetCriteria = styled(({ className, criteriaId }: SetCriteriaProps) => {
  const [showModal, setShowModal] = useState(false);

  // const {
  //   user: [{ auth }]
  // } = useGlobalState();

  const [state, setState] = React.useState<NewCriteriaStateType>({
    currentStep: criteriaId ? 1 : 0,
    loadingProperty: false,
    deletePropertyConfirmationModal: false
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
      areaOfInterest: 'E.g. Bristol or BA1 2LR',
      radius: undefined,
      propertyType: {
        detached: false,
        semiDetached: false,
        terraced: false,
        flats: false,
        bungalows: false,
        farmsLand: false,
        parkHomes: false
      },
      propertyClass: undefined,
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
      }
    },
    resolver: yupResolver(step2Schema),
    mode: 'all'
  });

  const step3Form = useForm<Step3FormType>({
    defaultValues: {
      idealBudget: undefined,
      depositInformation: undefined,
      creditScore: undefined,
      contactDetails: undefined
    },
    resolver: yupResolver(step3Schema),
    mode: 'all'
  });

  const setCurrentStep = (currentStep: number): void => {
    setState((state) => ({ ...state, currentStep }));
  };

  const onDeleteClick = () => {
    setState((state) => ({ ...state, deletePropertyConfirmationModal: true }));
  };

  return (
    <>
      <Modal
        open={showModal}
        onBackdropClick={() => setShowModal(false)}
        className={`set-criteria-modal ${className}`}>
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
            onDeleteClick={onDeleteClick}
          />
        )}

        {state.currentStep === 2 && (
          <SetCriteriaStep2
            closeModal={() => setShowModal(false)}
            form={step2Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            criteriaId={criteriaId}
            onDeleteClick={onDeleteClick}
          />
        )}

        {state.currentStep === 3 && (
          <SetCriteriaStep3
            closeModal={() => setShowModal(false)}
            form={step3Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            criteriaId={criteriaId}
            onDeleteClick={onDeleteClick}
          />
        )}
      </Modal>
      <Button style={{ marginTop: '24px' }} onClick={() => setShowModal(true)}>
        Set Criteria
      </Button>
    </>
  );
})`
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
