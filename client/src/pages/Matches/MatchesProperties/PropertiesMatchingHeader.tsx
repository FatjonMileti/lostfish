import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Label } from '../../../components/Label';
import { Typography } from '../../../components/Typography';

import { useCriteriaStore } from '../../../globalState/criteria';
import { Icon } from '../../../components/Icon';
import { SetCriteriaDrawer } from '../../SetCriteria/SetCriteriaDrawer';
import { useSuggestedProperties } from '../../Suggestions/SuggestionsProperties/useSuggestedProperties';
import { useUserStore } from '../../../globalState/user';

interface PropertiesMatchingHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const PropertiesMatchingHeader = styled(({ className }: PropertiesMatchingHeaderProps) => {
  const criteriaStore = useCriteriaStore();
  const userStore = useUserStore();
  const [criteriaModalVisibility, setCriteriaModalVisibility] = React.useState(false);
  const suggestedProperties = useSuggestedProperties({ params: { disliked: false, chosen: false } });

  return (
    <>
      <div className={classNames(className, 'properties-matching-header')}>
        <div className='criteria-wrapper'>
          <div className='criteria'>
            <Typography variant='body6' className='criteria-key'>
              Looking for
            </Typography>
            <Typography variant='body5' className='criteria-value'>
              Properties
            </Typography>
          </div>
          <div className='divider-line' />
          <div className='criteria'>
            <Typography variant='body6' className='criteria-key'>
              Location
            </Typography>
            <Typography variant='body5' className='criteria-value'>
              {criteriaStore.criteria.area_of_interest}
            </Typography>
          </div>

          <div className='divider-line' />
          <div className='criteria'>
            <Typography variant='body6' className='criteria-key'>
              Budget
            </Typography>
            <Typography variant='body5' className='criteria-value'>
              {`${criteriaStore.criteria.budget?.min}£ - ${criteriaStore.criteria.budget?.max}£`}
            </Typography>
          </div>
          <div className='divider-line' />
        </div>
        <Label variant='tertiary' onClick={() => setCriteriaModalVisibility(true)}>
          <Icon icon='filter' />
          Preferences
        </Label>
      </div>

      <SetCriteriaDrawer
        open={criteriaModalVisibility}
        setOpen={setCriteriaModalVisibility}
        afterRefineSearch={() => {
          suggestedProperties.refetch();
          criteriaStore.fetchCriteria(userStore.auth.access_token);
        }}
      />
    </>
  );
})`
  &.properties-matching-header {
    padding: 12px 32px;

    background: #fff;
    /* Card Shadow */
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 32px;

    display: flex;
    column-gap: 16px;
    font-weight: 500;

    .criteria-wrapper {
      display: flex;
      column-gap: 16px;

      .criteria {
        display: grid;

        .criteria-key {
          font-weight: 500;
          color: #a7a7a7;
        }
        .criteria-value {
          font-weight: 700;
          color: #0d2a38;
        }
      }
    }

    .divider-line {
      width: 1px;
      background: #e7e7e7;
    }
  }
`;
