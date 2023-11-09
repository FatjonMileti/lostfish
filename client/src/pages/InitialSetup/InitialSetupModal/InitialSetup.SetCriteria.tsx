import { styled } from '@mui/system';
import React from 'react';

import { HTMLMotionProps } from 'framer-motion';

import { SetCriteriaModal } from '../../SetCriteria/SetCriteriaModal';
import { useCriteriaForm } from '../../SetCriteria/useCriteriaForm';
import { ApiCriteriaDocumentType, HouseType, PropertyFeatureType } from '../../SetCriteria/criteria.types';
import { OutsideSpaceType } from '../../Properties/NewProperty/property.types';
import axios from '../../../utils/axios';
import { useProfileStore } from '../../../globalState/profile';
import { useUserStore } from '../../../globalState/user';

export interface SetCriteriaProps extends HTMLMotionProps<'div'> {
  onNext: () => void;
  onBack: () => void | any;
}

export const SetCriteria = styled(({ className, onNext, onBack }: SetCriteriaProps) => {
  const [showModal, setShowModal] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const criteriaForm = useCriteriaForm();
  const profileStore = useProfileStore();
  const userStore = useUserStore();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload: Partial<ApiCriteriaDocumentType> = {
        transaction_type_string: criteriaForm.getValues('transactionType'),
        area_of_interest: criteriaForm.getValues('areaOfInterest'),
        asset_address: criteriaForm.getValues('location'),
        radius: criteriaForm.getValues('radius'),
        moving_time: criteriaForm.getValues('whenDoYouWantToMove') || undefined,

        property_type: Object.entries(criteriaForm.getValues('propertyType'))
          .filter(([key, value]) => value)
          .map(([key, value]) => key) as ApiCriteriaDocumentType['property_type'],
        house_details: {
          house_type: Object.entries(criteriaForm.getValues('houseDetails.houseType') || {})
            .filter(([key, value]) => !!value)
            .map(([key]) => key) as HouseType[],
          home_style: criteriaForm.getValues('houseDetails.homeStyle') || undefined,
          preferred_size: criteriaForm.getValues('houseDetails.preferredSize'),
          condition: criteriaForm.getValues('houseDetails.condition') || undefined,
          parking: criteriaForm.getValues('houseDetails.parking') || undefined,
          garden: criteriaForm.getValues('houseDetails.garden'),
          storeys: criteriaForm.getValues('houseDetails.storeys'),
          number_of_bedrooms: criteriaForm.getValues('houseDetails.nrOfBedrooms'),
          number_of_bathrooms: criteriaForm.getValues('houseDetails.nrOfBathrooms')
        },
        flat_details: {
          property_purpose: criteriaForm.getValues('flatDetails.propertyPurpose') || undefined,
          preferred_floor: criteriaForm.getValues('flatDetails.preferredFloor') || undefined,
          condition: criteriaForm.getValues('flatDetails.condition') || undefined,

          outside_space: Object.entries(criteriaForm.getValues('flatDetails.outsideSpace'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key) as OutsideSpaceType[],
          preferred_size: criteriaForm.getValues('flatDetails.preferredSize'),
          number_of_bedrooms: criteriaForm.getValues('flatDetails.nrOfBedrooms'),
          number_of_bathrooms: criteriaForm.getValues('flatDetails.nrOfBathrooms'),

          lift: criteriaForm.getValues('flatDetails.lift'),
          security: criteriaForm.getValues('flatDetails.security'),
          gym_spa: criteriaForm.getValues('flatDetails.gymSpa'),
          parking_space: criteriaForm.getValues('flatDetails.parkingSpace')
        },
        property_preferences: [
          criteriaForm.getValues('propertyClass.New home') ? ['New home'] : [],
          criteriaForm.getValues('propertyClass.Retirement home') ? ['Retirement home'] : [],
          criteriaForm.getValues('propertyClass.Shared ownership') ? ['Shared ownership'] : [],
          criteriaForm.getValues('propertyClass.Shared ownership') ? ['Auction'] : []
        ].flat(),

        property_features: [
          criteriaForm.getValues('propertyFeatures.Parks nearby') ? ['Parks nearby'] : [],
          criteriaForm.getValues('propertyFeatures.Public transport nearby')
            ? ['Public transport nearby']
            : [],
          criteriaForm.getValues('propertyFeatures.Shopping centers nearby')
            ? ['Shopping centers nearby']
            : []
        ].flat() as PropertyFeatureType[],

        floor_size: `${criteriaForm.getValues('area')[0]}-${criteriaForm.getValues('area')[1]}`,
        floor_size_unit: criteriaForm.getValues('areaUnit'),
        room_details: {
          number_of_bedrooms: `${criteriaForm.getValues('nrOfBedrooms')[0]}-${
            criteriaForm.getValues('nrOfBedrooms')[1]
          }`,
          number_of_bathrooms: criteriaForm.getValues('nrOfBathrooms').join('-')
        },
        specific_property_features: Object.entries(criteriaForm.getValues('specificPropertyFeatures'))
          .filter(([key, value]) => value)
          .map(([key, value]) => key),

        distance_from_underground: criteriaForm.getValues('distanceFromUnderground'),
        distance_from_schools: criteriaForm.getValues('distanceFromSchools'),
        distance_from_high_street: criteriaForm.getValues('distanceFromHighStreet'),
        distance_from_gym: criteriaForm.getValues('distanceFromGym'),
        budget: `${criteriaForm.getValues('idealBudget')[0]} - ${criteriaForm.getValues('idealBudget')[1]}`,
        budget_for: criteriaForm.getValues('budgetFor'),
        deposit_amount: criteriaForm.getValues('depositAmount'),
        credit_score_requirements: criteriaForm.getValues('creditScore'),
        contract_details: Object.entries(criteriaForm.getValues('contractDetails'))
          .filter(([key, value]) => value)
          .map(([key, value]) => key)
      };

      await axios(userStore.auth.access_token).patch(`/api/criteria`, payload);
      await onNext();
      profileStore.fetchProfile(userStore.auth.access_token);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SetCriteriaModal
      open={showModal}
      onBack={onBack}
      afterRefineSearch={onNext}
      onBackdropClick={onBack}
      form={criteriaForm}
      onStartMatchingClick={handleSubmit}
    />
  );
})``;
