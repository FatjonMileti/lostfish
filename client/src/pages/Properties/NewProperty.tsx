import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Modal } from '../../components/Modal';

import { NewPropertyStep0 } from './Newproperty.Step0';
import { NewPropertyStep1 } from './NewProperty.Step1';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
}

export interface NewPropertyStateType {
  currentStep: number;
  lookingFor: number;

  areaOfInterest: string | undefined;
  radius: string | undefined;
  propertyType: null | string;
  propertyPreferences: null | string;
  propertyFeatures: {
    parksNearBy: boolean;
    publicTransportNearby: boolean;
    shoppingCentersNearby: boolean;
  };
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
    }
  });

  const setLookingFor = (lookingFor: number) => {
    setState((state) => ({ ...state, lookingFor }));
  };

  const setCurrentStep = (currentStep: number) => {
    setState((state) => ({ ...state, currentStep }));
  };

  const setAreaOfInterest = (areaOfInterest: NewPropertyStateType['areaOfInterest']) => {
    setState((state) => ({ ...state, areaOfInterest }));
  };

  const setRadius = (radius: NewPropertyStateType['radius']) => {
    setState((state) => ({ ...state, radius }));
  };

  const setPropertyType = (propertyType: string) => {
    setState((state) => ({ ...state, propertyType }));
  };

  const setPropertyPreferences = (propertyPreferences: string) => {
    setState((state) => ({ ...state, propertyPreferences }));
  };

  const setPropertyFeatures = (propertyFeatures: NewPropertyStateType['propertyFeatures']) => {
    setState((state) => ({ ...state, propertyFeatures }));
  };

  return (
    <Modal
      className={`new-property-modal ${className}`}
      open={modalVisibility}
      onBackdropClick={() => setModalVisibility(false)}>
      {state.currentStep === 0 && (
        <NewPropertyStep0
          lookingFor={state.lookingFor}
          setLookingFor={setLookingFor}
          next={() => setCurrentStep(1)}
          closeModal={() => setModalVisibility(false)}
        />
      )}

      {state.currentStep === 1 && (
        <NewPropertyStep1
          closeModal={() => setModalVisibility(false)}
          lookingFor={state.lookingFor}
          setCurrentStep={setCurrentStep}
          saveAsDraft={() => {
            setModalVisibility(false);
          }}
          areaOfInterest={state.areaOfInterest}
          setAreaOfInterest={setAreaOfInterest}
          radius={state.radius}
          setRadius={setRadius}
          propertyType={state.propertyType}
          setPropertyType={setPropertyType}
          setPropertyPreferences={setPropertyPreferences}
          propertyPreferences={state.propertyPreferences}
          setPropertyFeatures={setPropertyFeatures}
          propertyFeatures={state.propertyFeatures}
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
