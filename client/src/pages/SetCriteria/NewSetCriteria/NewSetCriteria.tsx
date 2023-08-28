import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from '../../../utils/axios';
import request from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';

import {
  contractDetailsTypes,
  creditScoreSTypes,
  criteriaFormSchema,
  CriteriaFormType,
  propertyTypes,
  specificPropertyFeaturesTypes,
  transactionTypes
} from '../criteria.types';

import { SetCriteriaHouseDetails } from './SetCriteria.HouseDetails';
import { SetCriteriaLocation } from './SetCriteria.Location';
import { SetCriteriaHouseType } from './SetCriteria.HouseType';
import { SetCriteriaBudget } from './SetCriteria.Budged';

import { Drawer } from '../../../components/Drawer';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Label } from '../../../components/Label';
import { Backdrop } from '../../../components/Backdrop';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';

import setCriteriaBackground from './set-criteria-background.jpeg';

const tabLabels = ['Location', 'House type', 'Budget', 'House details', 'Features', 'Amenities'];

interface SetCriteriaProps extends HTMLAttributes<HTMLDivElement> {
  afterRefineSearch?: () => void;
  open?: boolean;
  setOpen: (open: boolean) => void;
}

export const NewSetCriteria = styled(
  ({ className, afterRefineSearch = () => {}, ...otherProps }: SetCriteriaProps) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const { open, setOpen } = otherProps || React.useState(true);
    const [loading, setLoading] = React.useState<boolean>(false);

    const { auth } = useUserStore();

    React.useEffect(() => {
      loadCriteria().catch((err) => {
        throw err;
      });
    }, []);

    const loadCriteria = async () => {
      try {
        setLoading(true);
        const { data } = await request(auth.access_token).get('/api/criteria');

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        mainForm.setValue('transactionType', data.transaction_type_string);

        mainForm.setValue('areaOfInterest', data.area_of_interest);

        mainForm.setValue('location', {
          latitude: data?.asset_address?.latitude,
          longitude: data?.asset_address?.longitude
        });

        mainForm.setValue('radius', data.radius);

        mainForm.setValue('whenDoYouWantToMove', data.moving_time || undefined);

        data.property_type.map((type: keyof CriteriaFormType['propertyType']) => {
          mainForm.setValue(`propertyType.${type}`, true);
        });

        (
          Object.keys(mainForm.getValues('propertyClass')) as [keyof CriteriaFormType['propertyClass']]
        ).forEach((key) => {
          mainForm.setValue(`propertyClass.${key}`, data.property_preferences.includes(key));
        });

        (
          Object.keys(mainForm.getValues('propertyFeatures')) as [keyof CriteriaFormType['propertyFeatures']]
        ).forEach((key) => {
          mainForm.setValue(`propertyFeatures.${key}`, data.property_features.includes(key));
        });

        if (data.floor_size?.includes('-')) {
          mainForm.setValue('area', [
            parseInt(data.floor_size.split('-')[0]),
            parseInt(data.floor_size.split('-')[1])
          ]);
        }

        mainForm.setValue('nrOfBedrooms', [
          parseInt(data.room_details?.number_of_bedrooms.split('-')[0] || '0'),
          parseInt(data.room_details?.number_of_bedrooms.split('-')[1] || '0')
        ]);

        mainForm.setValue('nrOfBathrooms', data.room_details?.number_of_bathrooms);
        mainForm.setValue(
          'specificPropertyFeatures',
          data.specific_property_features.reduce((acc: { [key: string]: boolean }, spf: string) => {
            acc[spf] = true;
            return acc;
          }, {})
        );

        mainForm.setValue('idealBudget', [
          parseInt(data.budget.split('-')[0]),
          parseInt(data.budget.split('-')[1])
        ]);
        mainForm.setValue('depositAmount', data.deposit_amount);
        mainForm.setValue('creditScore', data.credit_score_requirements);
        mainForm.setValue(
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
          transaction_type_string: mainForm.getValues('transactionType'),
          area_of_interest: mainForm.getValues('areaOfInterest'),
          asset_address: mainForm.getValues('location'),
          radius: mainForm.getValues('radius'),
          moving_time: mainForm.getValues('whenDoYouWantToMove'),
          property_type: Object.entries(mainForm.getValues('propertyType'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key),
          property_preferences: [
            mainForm.getValues('propertyClass.New home') ? ['New home'] : [],
            mainForm.getValues('propertyClass.Retirement home') ? ['Retirement home'] : [],
            mainForm.getValues('propertyClass.Shared ownership') ? ['Shared ownership'] : [],
            mainForm.getValues('propertyClass.Shared ownership') ? ['Auction'] : []
          ].flat(),
          property_features: [
            mainForm.getValues('propertyFeatures.Parks nearby') ? ['Parks nearby'] : [],
            mainForm.getValues('propertyFeatures.Public transport nearby') ? ['Public transport nearby'] : [],
            mainForm.getValues('propertyFeatures.Shopping centers nearby') ? ['Shopping centers nearby'] : []
          ].flat(),
          floor_size: `${mainForm.getValues('area')[0]}-${mainForm.getValues('area')[1]}`,
          room_details: {
            number_of_bathrooms: mainForm.getValues('nrOfBathrooms') || undefined,
            number_of_bedrooms: `${mainForm.getValues('nrOfBedrooms')[0]}-${
              mainForm.getValues('nrOfBedrooms')[1]
            }`
          },
          specific_property_features: Object.entries(mainForm.getValues('specificPropertyFeatures'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key),

          budget: `${mainForm.getValues('idealBudget')[0]} - ${mainForm.getValues('idealBudget')[1]}`,
          deposit_amount: mainForm.getValues('depositAmount'),
          credit_score_requirements: mainForm.getValues('creditScore'),
          contract_details: Object.entries(mainForm.getValues('contractDetails'))
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

    const mainForm = useForm<CriteriaFormType>({
      defaultValues: {
        areaOfInterest: '',
        location: {},
        radius: undefined,
        propertyType: Object.fromEntries(propertyTypes.map((pt) => [pt, false])),
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
        },
        whenDoYouWantToMove: undefined,
        transactionType: transactionTypes[0],
        idealBudget: [1000, 5000],
        depositAmount: undefined,
        contractDetails: Object.fromEntries(contractDetailsTypes.map((cd) => [cd, false])),
        creditScore: creditScoreSTypes[0],
        area: [50, 100],
        nrOfBedrooms: [1, 4],
        nrOfBathrooms: undefined,
        specificPropertyFeatures: Object.fromEntries(specificPropertyFeaturesTypes.map((spf) => [spf, false]))
      },
      resolver: yupResolver(criteriaFormSchema),
      mode: 'all'
    });

    return (
      <>
        <Backdrop open={loading} />
        <Drawer open={open} setOpen={setOpen} className={classNames(className, 'criteria-drawer')}>
          <div className='criteria-header'>
            <Typography variant='body2'>Refine your search</Typography>
            <div className='action-buttons'>
              <Button
                size='small'
                onClick={async () => {
                  await handleSubmit();
                  setOpen(false);
                }}
                disabled={loading}>
                Save changes
              </Button>
              <IconButton size='large' onClick={() => setOpen(false)}>
                <Icon icon='close' size={12} />
              </IconButton>
            </div>
          </div>
          <div className='criteria-tabs-bar'>
            {tabLabels.map((tabLabel, tabLabelIndex) => (
              <Label
                className='criteria-tab-label'
                active={tabLabelIndex === selectedTab}
                variant='tertiary'
                key={tabLabelIndex}
                onClick={() => setSelectedTab(tabLabelIndex)}>
                {tabLabel}
              </Label>
            ))}
          </div>
          <div className='criteria-body'>
            {
              [
                <SetCriteriaLocation form={mainForm} />,
                <SetCriteriaHouseType form={mainForm} />,
                <SetCriteriaBudget form={mainForm} />,
                <SetCriteriaHouseDetails form={mainForm} />
              ][selectedTab]
            }
          </div>
        </Drawer>
      </>
    );
  }
)`
  &.criteria-drawer {
    .drawer-body {
      display: grid;
      grid-template-rows: min-content min-content auto;
    }

    .criteria-header {
      padding: 20px 36px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      background: white;

      .action-buttons {
        display: flex;
        column-gap: 16px;
      }
    }

    .criteria-tabs-bar {
      padding: 0 36px;
      display: flex;
      justify-content: space-between;
      background: white;
      box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);

      .criteria-tab-label {
        padding: 16px 12px !important;
        height: auto !important;
        color: #646464;
      }
    }

    .criteria-body {
      padding: 36px;
      z-index: 1;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 434px;
        height: 398px;

        background: url(${setCriteriaBackground}), lightgray 50% / cover no-repeat;
        opacity: 0.05;

        background-size: cover;
        background-position-y: center;
        z-index: -1;
      }
    }
  }
`;
