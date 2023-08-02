import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Modal } from '../../components/Modal';

import { NewPropertyStep0, Step0FormType, step0Schema } from './Newproperty.Step0';
import { NewPropertyStep1, Step1FormType, step1Schema } from './NewProperty.Step1';
import { NewPropertyStep2, Step2FormType, step2Schema } from './NewProperty.Step2';
import { NewPropertyStep3, Step3FormType, step3Schema } from './NewProperty.Step3';
import axios from '../../utils/axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import request from '../../utils/axios';
import { Backdrop } from '../../components/Backdrop';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';

import { useUserStore } from '../../globalState/user';
import { useNavigate } from 'react-router-dom';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId?: string;
  setEditPropertyId: (propertyId: string) => void;
  fetchAssets: () => void;
}

export interface NewPropertyStateType {
  currentStep: number;
  newImages: File[];
  loadingProperty: boolean;
  savingProperty: boolean;
  deletePropertyConfirmationModal: boolean;
}

export const NewProperty = styled(
  ({ className, showStore, propertyId, setEditPropertyId, fetchAssets }: NewPropertyProps) => {
    const [modalVisibility, setModalVisibility] = showStore;

    const { auth } = useUserStore();

    const navigate = useNavigate();

    const [state, setState] = React.useState<NewPropertyStateType>({
      currentStep: propertyId ? 1 : 0,
      newImages: [],
      loadingProperty: false,
      savingProperty: false,
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
        areaOfInterest: '',
        location: {},
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

    const setNewImages = (newImages: File[]) => setState((state) => ({ ...state, newImages }));

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

        step1Form.setValue('location', {
          latitude: data?.asset_address?.latitude,
          longitude: data?.asset_address?.longitude
        });

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
        step2Form.setValue('propertyImages', data.property_images);
        // step 3
        step3Form.setValue('rentingPrice', data.asset_rent.rental_amount);
        step3Form.setValue('paymentFrequency', data.asset_rent.rental_frequency);
        step3Form.setValue('depositAmount', data.asset_rent.deposit_amount || undefined);
        step3Form.setValue('creditScoreRequirements', data.credit_score_requirements);
        step3Form.setValue(
          'contractDetails',
          data.contract_details.reduce((acc: { [key: string]: boolean }, cd: string) => {
            acc[cd] = true;
            return acc;
          }, {})
        );
      } catch (err) {
        throw err;
      }
    };

    const saveAsDraft = async () => {
      try {
        if (state.newImages.length > 0) {
          const newImagesLinks = await uploadImages(state.newImages);
          setNewImages([]);
          step2Form.setValue('propertyImages', [...step2Form.getValues('propertyImages'), ...newImagesLinks]);
        }

        const payload = {
          // step0
          transaction_type_string: step0Form.getValues('lookingFor'),

          // step1
          area_of_interest: step1Form.getValues('areaOfInterest'),

          asset_address: step1Form.getValues('location'),

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
          property_images: step2Form.getValues('propertyImages'),

          // step 3
          asset_rent: {
            rental_amount: step3Form.getValues('rentingPrice'),
            rental_frequency: step3Form.getValues('paymentFrequency'),
            deposit_amount: step3Form.getValues('depositAmount')
          },
          credit_score_requirements: step3Form.getValues('creditScoreRequirements'),
          contract_details: Object.entries(step3Form.getValues('contractDetails'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key)
        };

        const { data } = await (propertyId
          ? axios(auth.access_token).patch(`/api/asset/${propertyId}`, payload)
          : axios(auth.access_token).post('/api/asset/draft', payload));

        if (!propertyId) {
          setEditPropertyId(data._id);
        }
      } catch (err) {
        throw err;
      }
    };

    const startMatching = async () => {
      try {
        if (state.newImages.length > 0) {
          const newImagesLinks = await uploadImages(state.newImages);
          setNewImages([]);
          step2Form.setValue('propertyImages', [...step2Form.getValues('propertyImages'), ...newImagesLinks]);
        }

        const payload: any = {
          // step0
          transaction_type_string: step0Form.getValues('lookingFor'),

          // step1
          area_of_interest: step1Form.getValues('areaOfInterest'),
          // asset_address: {
          //   latitude: 51.5072178,
          //   longitude: -0.1275862
          // },

          asset_address: step1Form.getValues('location'),

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
          property_images: step2Form.getValues('propertyImages'),

          // step 3
          asset_rent: {
            rental_amount: step3Form.getValues('rentingPrice'),
            rental_frequency: step3Form.getValues('paymentFrequency'),
            deposit_amount: step3Form.getValues('depositAmount')
          },
          credit_score_requirements: step3Form.getValues('creditScoreRequirements'),
          contract_details: Object.entries(step3Form.getValues('contractDetails'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key),
          status_string: 'Live'
        };

        console.log('payload', payload);

        const { data } = await (propertyId
          ? axios(auth.access_token).patch(`/api/asset/${propertyId}`, payload)
          : axios(auth.access_token).post('/api/asset', payload));

        if (!propertyId) {
          setEditPropertyId(data._id);
        }

        console.log('response.data: ', data);
      } catch (err) {
        throw err;
      }
    };

    const deleteProperty = async () => {
      await axios(auth.access_token).delete(`/api/asset/${propertyId}`);
    };

    const onDeleteConfirm = async () => {
      try {
        setState((state) => ({ ...state, deletePropertyConfirmationModal: false }));
        setState((state) => ({ ...state, savingProperty: true }));
        await deleteProperty();
      } finally {
        setState((state) => ({ ...state, savingProperty: false }));
        setModalVisibility(false);
        fetchAssets();
      }
    };

    const onDeleteClick = () => {
      setState((state) => ({ ...state, deletePropertyConfirmationModal: true }));
    };

    const onCancelDelete = () => {
      setState((state) => ({ ...state, deletePropertyConfirmationModal: false }));
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
              fetchAssets();
            }}
            form={step1Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            onDeleteClick={onDeleteClick}
            propertyId={propertyId}
          />
        )}

        {state.currentStep === 2 && (
          <NewPropertyStep2
            closeModal={() => setModalVisibility(false)}
            saveAsDraft={async () => {
              setState((state) => ({ ...state, savingProperty: true }));
              await saveAsDraft();
              setState((state) => ({ ...state, savingProperty: false }));
              fetchAssets();
            }}
            form={step2Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            newImages={state.newImages}
            setNewImages={setNewImages}
            propertyId={propertyId}
            onDeleteClick={onDeleteClick}
          />
        )}

        {state.currentStep === 3 && (
          <NewPropertyStep3
            closeModal={() => setModalVisibility(false)}
            saveAsDraft={async () => {
              setState((state) => ({ ...state, savingProperty: true }));
              await saveAsDraft();
              setState((state) => ({ ...state, savingProperty: false }));
              fetchAssets();
            }}
            form={step3Form}
            lookingFor={step0Form.getValues('lookingFor')}
            setCurrentStep={setCurrentStep}
            onDeleteClick={onDeleteClick}
            propertyId={propertyId}
            startMatching={async () => {
              setState((state) => ({ ...state, savingProperty: true }));
              await startMatching();

              await new Promise((resolve) => {
                setTimeout(resolve, 1000);
              });
              setState((state) => ({ ...state, savingProperty: false }));
              navigate('/matches');
            }}
          />
        )}

        <Modal
          disableScrollLock
          open={state.deletePropertyConfirmationModal}
          className='delete-confirm-modal'
          onBackdropClick={onCancelDelete}>
          <div className='modal-header'>
            <IconButton size='large' noBackground onClick={onCancelDelete}>
              <Icon icon='close' size={12} />
            </IconButton>
          </div>
          <Typography variant='body2' className='title'>
            Are you sure you want to delete the property?
          </Typography>
          <Typography variant='body4' className='description'>
            The action can be reverted anymore. Do you want to delete this property?
          </Typography>
          <div className='actions'>
            <Button size='large' variant='secondary' onClick={onCancelDelete}>
              Cancel
            </Button>
            <Button size='large' onClick={onDeleteConfirm}>
              Delete
            </Button>
          </div>
        </Modal>
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

    .delete-confirm-modal {
      .modal-container {
        padding: 0;
      }
      padding: 24px;
      max-width: 440px;
      .modal-header {
        display: flex;
        justify-content: flex-end;
      }
      .title {
        margin-top: 24px;
        text-align: center;
      }

      .description {
        margin-top: 16px;
        text-align: center;
      }
      .actions {
        margin-top: 48px;
        display: flex;
        column-gap: 16px;
        .button {
          flex-grow: 1;
        }
      }
    }
  }
`;
