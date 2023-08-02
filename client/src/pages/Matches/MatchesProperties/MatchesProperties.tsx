import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import { Avatar } from '../../../components/Avatar';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { useCriteriaStore } from '../../../globalState/criteria';
import { ImproveTrustScoreModal } from '../ImproveTrustScoreModal';
import { SetCriteria } from '../../SetCriteria/SetCriteria';
import { Switch } from '../../../components/Switch';
import { SuggestedMatches } from './MatchedProperties.SuggestedMatches';
import { AddedMatches } from './MatchedProperties.AddedMatches';

export interface PropertyType {
  property: {
    _id: string;
    property_images: { link: string }[];
    area_of_interest: string;
    property_type?: string;
    floor_size: string;
    specific_property_features?: string[];
    contract_details?: string[];

    room_details: {
      number_of_bathrooms: string;
      number_of_bedrooms: string;
    };

    asset_rent: {
      rental_amount?: string;
    };
    created_by: {
      email: string;
      first_name: string;
      last_name: string;
      avatar: string;
    };

    asset_address: any;
  };
  matchId?: string;
  chosen: boolean;
  starred: boolean;
}

interface MatchesPropertiesProps extends HTMLAttributes<HTMLDivElement> {}
export const MatchesProperties = styled(({ className }: MatchesPropertiesProps) => {
  const [properties, setProperties] = React.useState<PropertyType[]>([]);

  const [improveTrustScoreModalVisibility, setImproveTrustScoreModalVisibility] = React.useState(false);
  const [criteriaModalVisibility, setCriteriaModalVisibility] = React.useState(false);
  const [checkedProperties, setCheckedProperties] = React.useState<any[]>([]);
  const [matchedView, setMatchedView] = React.useState<boolean>(false);

  const { auth } = useUserStore();

  const criteriaStore = useCriteriaStore();

  React.useEffect(() => {
    getCheckedProperties();
  }, [properties]);

  const getCheckedProperties = async () => {
    try {
      const { data } = await axios(auth.access_token).get('/api/match', { params: { chosen: true } });
      setCheckedProperties(data.docs);
    } catch (err) {
      throw err;
    }
  };
  const getProperties = async () => {
    const { data } = await axios(auth.access_token).get('/api/asset/matches-example');
    setProperties(data.docs.map((doc: any) => ({ ...doc, chosen: false, starred: false, id: doc._id })));
    await Promise.all(
      data.docs.map(async (d: PropertyType) => {
        await isPropertyChosen(d.property._id);
      })
    );
  };

  const isPropertyChosen = async (propertyId: string): Promise<void> => {
    try {
      const {
        data: { chosen, starred, _id }
      } = await axios(auth.access_token).get(`/api/match/check?property=${propertyId}`);

      const match = {
        chosen,
        starred,
        matchId: _id
      };

      setProperties((properties) => {
        const propertiesCopy = [...properties];

        const property = propertiesCopy.find((p: any) => p.property._id === propertyId);
        if (property) {
          const propertyIndex = propertiesCopy.indexOf(property);
          propertiesCopy[propertyIndex].chosen = match.chosen;
          propertiesCopy[propertyIndex].starred = match.starred;
          propertiesCopy[propertyIndex].matchId = match.matchId;
        }

        return propertiesCopy;
      });
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setProperties((properties) => {
          const propertiesCopy = [...properties];

          const property = propertiesCopy.find((p: any) => p.property._id === propertyId);
          if (property) {
            const propertyIndex = propertiesCopy.indexOf(property);
            propertiesCopy[propertyIndex].chosen = false;
            propertiesCopy[propertyIndex].starred = false;
            propertiesCopy[propertyIndex].matchId = undefined;
          }
          return propertiesCopy;
        });

        return;
      } else {
        throw err;
      }
    }
  };

  const addOrUpdateTenantMatch = async (
    propertyId: string,
    chosen: boolean = false,
    starred: boolean = false
  ) => {
    const matchId = properties.find((p) => p.property._id === propertyId)?.matchId || false;

    if (matchId) {
      await axios(auth.access_token).put(`/api/match/${matchId}`, { chosen, starred });
    } else {
      await axios(auth.access_token).post('/api/match/property', { property: propertyId, chosen, starred });
    }

    isPropertyChosen(propertyId);
  };

  const starProperty = async (propertyId: string, chosen: boolean) => {
    await addOrUpdateTenantMatch(propertyId, chosen, true);
  };

  const checkProperty = async (propertyId: string, starred: boolean) => {
    await addOrUpdateTenantMatch(propertyId, true, starred);
  };

  const removePropertyMatch = async (propertyId: string, matchId: string) => {
    try {
      await axios(auth.access_token).delete(`/api/match/${matchId}`);
      isPropertyChosen(propertyId);
    } catch (err) {
      throw err;
    } finally {
    }
  };

  return (
    <div className={`${className}`}>
      <div className='page-title-section'>
        <div>
          <Typography>
            Matching with{' '}
            <span className='matching-with'>properties in {criteriaStore.areaOfInterest} +</span>
          </Typography>
          <Typography variant='body5' className='sub-title'>
            Displaying 1240 matches. Enter more details to refine your search.
          </Typography>
        </div>

        {((id: string) => (
          <div className='switch-to-matched-view-button-wrapper'>
            {checkedProperties.length > 0 && (
              <>
                <label htmlFor={id}>Switch to matched view</label>
                <Switch id={id} checked={matchedView} onChange={(e) => setMatchedView(e.target.checked)} />
              </>
            )}
          </div>
        ))(React.useId())}
      </div>

      {!matchedView ? (
        <SuggestedMatches
          properties={properties}
          setProperties={setProperties}
          getProperties={getProperties}
          improveTrustScore={() => setImproveTrustScoreModalVisibility(true)}
          removePropertyMatch={removePropertyMatch}
          starProperty={starProperty}
          checkProperty={checkProperty}
        />
      ) : (
        <AddedMatches
          properties={checkedProperties}
          setProperties={setCheckedProperties}
          removePropertyMatch={removePropertyMatch}
          starProperty={() => {}}
          checkProperty={() => {}}
        />
      )}

      <ImproveTrustScoreModal
        open={improveTrustScoreModalVisibility}
        closeModal={() => setImproveTrustScoreModalVisibility(false)}
        refineYourSearchClick={() => {
          setImproveTrustScoreModalVisibility(false);
          setCriteriaModalVisibility(true);
        }}
      />
      {criteriaModalVisibility && (
        <SetCriteria
          setShowModal={setCriteriaModalVisibility}
          afterRefineSearch={() => {
            setCriteriaModalVisibility(false);
            getProperties();
          }}
        />
      )}
    </div>
  );
})`
  & {
    display: grid;
    row-gap: 48px;
    grid-template-rows: min-content auto;

    .page-title-section {
      display: flex;
      column-gap: 24px;
      justify-content: space-between;
      align-items: center;

      .matching-with {
        color: #184d6d;
        border-bottom: 1px solid #184d6d;
      }

      .sub-title {
        margin-top: 8px;
      }

      .switch-to-matched-view-button-wrapper {
        display: flex;
        column-gap: 16px;
        align-items: center;

        label {
          font-family: Roobert, serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
          color: #646464;
        }
      }
    }
  }
`;

interface MatchedSlideProps extends HTMLMotionProps<'div'> {
  image: string;
  avatar: string;
  propertyOwnerName: string;
  areaOfInterest?: string;
  numberOfBedrooms?: string;
  numberOfBathrooms?: string;
  rentingPrice?: string;
  viewProperty: () => void;
}

export const MatchedSlide = styled(
  ({
    className,
    image,
    avatar,
    areaOfInterest = '',
    numberOfBedrooms = '',
    numberOfBathrooms = '',
    rentingPrice = '',
    propertyOwnerName = '',
    viewProperty,
    ...rest
  }: MatchedSlideProps) => {
    const numberOfBedroomsWord =
      {
        '1': 'One',
        '2': 'Two',
        '3': 'Three',
        '4': 'Four',
        '5': 'Five',
        '6': 'Six',
        '7': 'Seven',
        '8': 'Eight',
        '9': 'Nine',
        '10': 'Ten'
      }[numberOfBedrooms] || numberOfBedrooms;

    return (
      <>
        <motion.div className={`match-property-slide ${className}`} {...rest}>
          <div className='slide-header'>
            <Avatar image={avatar} />
            <Typography variant='body4'>{propertyOwnerName} • 34%</Typography>
          </div>
          <div className='slide-footer'>
            <div className='left-part'>
              <Typography className='property-name'>
                {numberOfBedroomsWord} bedroom apartment for rent
              </Typography>
              <div className='property-details'>
                <div className='detail'>
                  <Icon icon='location' />
                  <Typography variant='body5'>{areaOfInterest}</Typography>
                </div>
                •
                <div className='detail'>
                  <Icon icon='banknote' />
                  <Typography variant='body5'>£{rentingPrice?.toLocaleString()} PCM</Typography>
                </div>
                •
                <div className='detail'>
                  <Icon icon='double-bed' />
                  <Typography variant='body5'>{numberOfBedrooms}</Typography>
                </div>
                •
                <div className='detail'>
                  <Icon icon='bathtub' />
                  <Typography variant='body5'>{numberOfBathrooms}</Typography>
                </div>
              </div>
            </div>
            <Label variant='secondary' inverted onClick={viewProperty}>
              View property
            </Label>
          </div>
        </motion.div>
      </>
    );
  }
)`
  &.match-property-slide {
    width: 672px;
    height: 452px;

    flex-shrink: 0;

    border-radius: 12px;

    background-image: url('${(props) => props.image}');
    background-repeat: no-repeat;
    background-size: cover;

    box-shadow: 0 7.7px 23.2px 0 rgba(0, 0, 0, 0.25);

    display: grid;
    align-content: space-between;
    overflow: hidden;

    &.active {
      .slide-header,
      .slide-footer {
        visibility: visible;
      }
    }

    .slide-header {
      visibility: hidden;

      padding: 24px;
      background: linear-gradient(180deg, rgba(38, 38, 38, 0.7) 0%, rgba(38, 38, 38, 0) 100%);
      display: flex;
      column-gap: 8px;
      align-items: center;

      .typography {
        color: white;
        font-weight: 700;
      }
    }

    .slide-footer {
      visibility: hidden;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 43.75%);

      .left-part {
        display: grid;
        row-gap: 16px;
        .property-name {
          font-family: Roobert, serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
          color: white;
        }

        .property-details {
          color: white;
          font-weight: 700;
          display: flex;
          column-gap: 8px;
          align-items: center;

          .detail {
            display: flex;
            column-gap: 4px;
            align-items: center;
          }
        }
      }
    }
  }
`;
