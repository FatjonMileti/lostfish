import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from '../../../utils/axios';
import request from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';

import { CriteriaFormType } from '../criteria.types';

import { SetCriteriaHouseDetails } from './SetCriteria.HouseDetails';
import { SetCriteriaLocation } from './SetCriteria.Location';
import { SetCriteriaHouseType } from './SetCriteria.HouseType';
import { SetCriteriaBudget } from './SetCriteria.Budged';

import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Label } from '../../../components/Label';
import { Backdrop } from '../../../components/Backdrop';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import {
  BudgetFor,
  ContractDetail,
  CreditScore,
  criteriaFormSchema,
  DistanceUnit,
  PropertyType,
  SpecificPropertyFeature,
  Transaction
} from '../criteria.contants';
import { AreaUnit, Parking } from '../../Properties/NewProperties/property.constants';

const tabLabels = ['Location', 'House type', 'Budget', 'House details', 'Features', 'Amenities'];

interface SetCriteriaProps extends HTMLAttributes<HTMLDivElement> {
  afterRefineSearch?: () => void;
  onClose?: () => void;
}

export const SetCriteria = styled(
  ({ className, afterRefineSearch = () => {}, onClose, ...otherProps }: SetCriteriaProps) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

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

        mainForm.setValue('flatDetails.propertyPurpose', data?.flat_details?.property_purpose);

        mainForm.setValue('flatDetails.lift', data?.flat_details?.lift);
        mainForm.setValue('flatDetails.security', data?.flat_details?.security);
        if (data?.flat_details?.floor) {
          mainForm.setValue('flatDetails.floor', data.flat_details.floor);
        }

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

        if (data?.floor_size_unit) {
          mainForm.setValue('areaUnit', data?.floor_size_unit);
        }

        if (data.room_details?.number_of_bedrooms) {
          mainForm.setValue('nrOfBedrooms', [
            parseInt(data.room_details?.number_of_bedrooms?.split('-')[0] || '0'),
            parseInt(data.room_details?.number_of_bedrooms?.split('-')[1] || '0')
          ]);
        }

        if (data.room_details?.number_of_bathrooms) {
          mainForm.setValue('nrOfBathrooms', [
            parseInt(data.room_details?.number_of_bathrooms?.split('-')[0] || '0'),
            parseInt(data.room_details?.number_of_bathrooms?.split('-')[1] || '0')
          ]);
        }

        mainForm.setValue(
          'specificPropertyFeatures',
          data.specific_property_features.reduce((acc: { [key: string]: boolean }, spf: string) => {
            acc[spf] = true;
            return acc;
          }, {})
        );

        mainForm.setValue('parkingType.On street', data.parking_details?.includes(Parking.OnStreet));
        mainForm.setValue('parkingType.Off street', data.parking_details?.includes(Parking.OffStreet));
        mainForm.setValue('parkingType.Garage', data.parking_details?.includes(Parking.Garage));

        mainForm.setValue('idealBudget', [
          parseInt(data.budget.split('-')[0]),
          parseInt(data.budget.split('-')[1])
        ]);

        if (data.budget_for) {
          mainForm.setValue('budgetFor', data.budget_for);
        }

        mainForm.setValue('depositAmount', data.deposit_amount);
        mainForm.setValue('creditScore', data.credit_score_requirements);
        mainForm.setValue(
          'contractDetails',
          data.contract_details.reduce((acc: { [key: string]: boolean }, cd: string) => {
            acc[cd] = true;
            return acc;
          }, {})
        );

        if (data?.distance_from_underground) {
          mainForm.setValue('distanceFromUnderground', data.distance_from_underground);
        }

        if (data?.distance_from_schools) {
          mainForm.setValue('distanceFromSchools', data.distance_from_schools);
        }

        if (data?.distance_from_high_street) {
          mainForm.setValue('distanceFromHighStreet', data.distance_from_high_street);
        }

        if (data?.distance_from_gym) {
          mainForm.setValue('distanceFromGym', data.distance_from_gym);
        }
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
          flat_details: {
            property_purpose: mainForm.getValues('flatDetails.propertyPurpose'),
            floor: mainForm.getValues('flatDetails.floor'),
            lift: mainForm.getValues('flatDetails.lift'),
            security: mainForm.getValues('flatDetails.security')
          },
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
          floor_size_unit: mainForm.getValues('areaUnit'),
          room_details: {
            number_of_bedrooms: `${mainForm.getValues('nrOfBedrooms')[0]}-${
              mainForm.getValues('nrOfBedrooms')[1]
            }`,
            number_of_bathrooms: mainForm.getValues('nrOfBathrooms').join('-')
          },
          specific_property_features: Object.entries(mainForm.getValues('specificPropertyFeatures'))
            .filter(([key, value]) => value)
            .map(([key, value]) => key),

          parking_details: [
            mainForm.getValues('parkingType')[Parking.Garage] ? [Parking.Garage] : [],
            mainForm.getValues('parkingType')[Parking.OffStreet] ? [Parking.OffStreet] : [],
            mainForm.getValues('parkingType')[Parking.OnStreet] ? [Parking.OnStreet] : []
          ].flat(),

          distance_from_underground: mainForm.getValues('distanceFromUnderground'),
          distance_from_schools: mainForm.getValues('distanceFromSchools'),
          distance_from_high_street: mainForm.getValues('distanceFromHighStreet'),
          distance_from_gym: mainForm.getValues('distanceFromGym'),
          budget: `${mainForm.getValues('idealBudget')[0]} - ${mainForm.getValues('idealBudget')[1]}`,
          budget_for: mainForm.getValues('budgetFor'),
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
        propertyType: Object.fromEntries(Object.values(PropertyType).map((pt) => [pt, false])),
        flatDetails: {
          propertyPurpose: undefined
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
        },
        whenDoYouWantToMove: undefined,
        transactionType: Transaction.Rent,
        idealBudget: [1000, 5000],
        budgetFor: BudgetFor.Month,
        depositAmount: undefined,
        contractDetails: Object.fromEntries(Object.values(ContractDetail).map((cd) => [cd, false])),
        creditScore: CreditScore.Good,
        area: [50, 100],
        areaUnit: AreaUnit.SquareMeter,
        nrOfBedrooms: [1, 4],
        nrOfBathrooms: [1, 3],
        specificPropertyFeatures: Object.fromEntries(
          Object.values(SpecificPropertyFeature).map((spf) => [spf, false])
        ),
        distanceFromUnderground: {
          value: undefined,
          unit: DistanceUnit.Km
        },
        distanceFromSchools: {
          value: undefined,
          unit: DistanceUnit.Km
        },
        distanceFromHighStreet: {
          value: undefined,
          unit: DistanceUnit.Km
        },
        distanceFromGym: {
          value: undefined,
          unit: DistanceUnit.Km
        }
      },
      resolver: yupResolver(criteriaFormSchema),
      mode: 'all'
    });

    return (
      <>
        <Backdrop open={loading} />
        <div className={classNames(className, 'criteria-container')}>
          <div className='criteria-header'>
            <Typography variant='body2'>Refine your search</Typography>
            <div className='action-buttons'>
              <Button
                size='small'
                onClick={async () => {
                  await handleSubmit();
                  onClose && onClose();
                }}
                disabled={loading}>
                Save changes
              </Button>
              {onClose && (
                <IconButton size='large' onClick={onClose}>
                  <Icon icon='close' size={12} />
                </IconButton>
              )}
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
        </div>
      </>
    );
  }
)`
  &.criteria-container {
    display: grid;
    grid-template-rows: min-content min-content auto;

    .criteria-header {
      padding: 20px 0;
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
      padding: 0;
      display: flex;
      //justify-content: space-between;
      column-gap: 12px;
      background: white;
      box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);

      .criteria-tab-label {
        padding: 16px 12px !important;
        height: auto !important;
        color: #646464;
      }
    }

    .criteria-body {
      padding: 36px 0;
    }
  }
`;
