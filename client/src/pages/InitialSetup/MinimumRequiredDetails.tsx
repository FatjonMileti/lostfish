import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';
import { AreaOfInterest } from './Mrd.AreaOfInterest';
import { useCriteriaStore } from '../../globalState/criteria';
import { useUserStore } from '../../globalState/user';
import axios from '../../utils/axios';
import { Budget } from './Mrd.Budget';
import { Bedrooms } from './Mrd.Bedrooms';
import { Select } from '../../components/Select/Select';
import { BudgetFor, Transaction } from '../SetCriteria/criteria.contants';
import { BudgetForType } from '../SetCriteria/criteria.types';
import { useProfileStore } from '../../globalState/profile';

type MinimumRequiredDataType = {
  transactionType?: string;
  whenDoYouWantToMove?: string;
  areaOfInterest?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  budget: number[];
  budgetFor: BudgetForType;
  nrOfBedrooms: number[];
};

interface MinimumRequiredDetailsProps extends HTMLAttributes<HTMLDivElement> {}
export const MinimumRequiredDetails = styled(({ className }: MinimumRequiredDetailsProps) => {
  const [state, setState] = React.useState<MinimumRequiredDataType>({
    transactionType: Transaction.Rent,
    whenDoYouWantToMove: undefined,
    areaOfInterest: undefined,
    budget: [1000, 5200],
    budgetFor: BudgetFor.Month,
    nrOfBedrooms: [1, 4]
  });

  const [pressedContinue, setPressedContinue] = React.useState(false);

  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const { auth } = useUserStore();
  const criteriaStore = useCriteriaStore();
  const profileStore = useProfileStore();

  const onAreaOfInterestChange = ({
    formattedAddress,
    location
  }: {
    formattedAddress: string;
    location: { latitude?: number; longitude?: number };
  }) => {
    setState((state) => ({ ...state, areaOfInterest: formattedAddress, location }));
  };

  const onBudgetChange = (budget: number[]) => {
    setState((state) => ({ ...state, budget }));
  };

  const onBudgetForChange = (budgetFor: BudgetForType) => {
    setState((state) => ({ ...state, budgetFor }));
  };

  const onNrOfBedroomsChange = (nrOfBedrooms: number[]) => {
    setState((state) => ({ ...state, nrOfBedrooms }));
  };

  const startMatching = async () => {
    setLoading(true);

    const { data } = await axios(auth.access_token).patch('/api/criteria', {
      looking_for: criteriaStore.lookingFor,
      transaction_type_string: state.transactionType,
      area_of_interest: state.areaOfInterest,
      asset_address: state.location,
      room_details: {
        number_of_bedrooms: `${state.nrOfBedrooms[0]} - ${state.nrOfBedrooms[1]}`
      },
      budget: `${state.budget[0]} - ${state.budget[1]}`,
      budget_for: `${state.budgetFor}`
    });

    await profileStore.fetchProfile(auth.access_token);

    criteriaStore.set({
      transactionType: data.transaction_type_string,
      whenDoYouWantToMove: data.moving_time,
      areaOfInterest: data.area_of_interest,
      budgetFor: data.budget_for
    });

    setLoading(false);

    navigate('/matches');
  };

  return (
    <>
      <Backdrop open={loading}></Backdrop>
      <div className={`minimum-requirements ${className}`}>
        {criteriaStore.lookingFor === 'I’m looking for a place' && (
          <>
            <motion.div
              key='areaOfInterest'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}>
              <AreaOfInterest areaOfInterest={state.areaOfInterest} onAreaChange={onAreaOfInterestChange} />
            </motion.div>

            {state.areaOfInterest && (
              <motion.div
                key='budget'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ display: 'grid', justifyItems: 'center' }}>
                <Budget value={state.budget} onChange={onBudgetChange} />
                <Select
                  label='Budget for:'
                  value={state.budgetFor}
                  onChange={({ target: { value } }) => onBudgetForChange(value as BudgetForType)}>
                  {Object.values(BudgetFor).map((bf, bfIndex) => (
                    <option key={bfIndex} value={bf}>
                      {bf}
                    </option>
                  ))}
                </Select>
                {!pressedContinue && (
                  <Button size='large' className='continue-button' onClick={() => setPressedContinue(true)}>
                    Continue
                  </Button>
                )}
              </motion.div>
            )}

            {state.areaOfInterest && pressedContinue && (
              <>
                <motion.div
                  key='bedrooms'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}>
                  <Bedrooms value={state.nrOfBedrooms} onChange={onNrOfBedroomsChange} />
                </motion.div>
                <motion.div
                  key='startMatching'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}>
                  <Button size='large' onClick={startMatching}>
                    Start matching
                  </Button>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
})`
  &.minimum-requirements {
    padding: 24px 36px 36px 36px;
    box-sizing: border-box;
    display: grid;
    justify-items: center;
    height: 100%;
    row-gap: 64px;
    align-content: center;

    .select {
      width: 30%;
      margin-top: 48px;
    }

    .continue-button {
      margin-top: 20px;
    }
  }
`;
