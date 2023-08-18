import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import { Avatar } from '../../../components/Avatar';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { ImproveTrustScoreModal } from '../ImproveTrustScoreModal';
import { SetCriteria } from '../../SetCriteria/SetCriteria';
import { SuggestedMatches } from './MatchedProperties.SuggestedMatches';
import { AddedMatches } from './MatchedProperties.AddedMatches';
import { avatars } from '../../HomeLoggedIn/avatars';
import { ViewProperty } from './ViewProperty';
import { NewSetCriteria } from '../../SetCriteria/NewSetCriteria/NewSetCriteria';
import { useProfileStore } from '../../../globalState/profile';

export interface PropertyType {
  property: {
    _id: string;
    property_images: { link: string }[];
    area_of_interest: string;
    title: string;
    description: string;
    location_details: string;
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
    percentage: number;
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

  const [propertyToView, setPropertyToView] = React.useState<PropertyType | null>(null);

  const { auth } = useUserStore();

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
    const { data } = await axios(auth?.access_token).get('/api/suggestion/asset');
    setProperties(data.docs.map((doc: any) => ({ ...doc, id: doc._id })));
  };

  const addOrUpdateTenantMatch = async (
    propertyId: string,
    chosen: boolean = false,
    starred: boolean = false
  ) => {
    const match = properties.find((p) => p.property._id === propertyId);

    const response = match?.matchId
      ? await axios(auth.access_token).put(`/api/match/${match.matchId}`, { chosen, starred })
      : await axios(auth.access_token).post('/api/match/property', { property: propertyId, chosen, starred });

    if (response.status === 200 || response.status === 201) {
      setProperties((prevArray) =>
        prevArray.map((obj) =>
          obj.property._id === propertyId ? { ...obj, chosen, starred, matchId: response.data._id } : obj
        )
      );
      if (propertyToView && propertyToView?.property._id === propertyId) {
        setPropertyToView((prevState) => {
          return prevState ? { ...prevState, chosen, starred } : null;
        });
      }
    } else if (response.status === 204) {
      setProperties((prevArray) =>
        prevArray.map((obj) =>
          obj.property._id === propertyId
            ? { ...obj, chosen: false, starred: false, matchId: undefined }
            : obj
        )
      );
    }
  };

  const starProperty = async (propertyId: string, chosen: boolean, starred: boolean) => {
    await addOrUpdateTenantMatch(propertyId, chosen, starred);
  };

  const checkProperty = async (propertyId: string, chosen: boolean, starred: boolean) => {
    await addOrUpdateTenantMatch(propertyId, chosen, starred);
  };

  const removePropertyMatch = async (matchId: string, propertyId?: string) => {
    try {
      await axios(auth.access_token).delete(`/api/match/${matchId}`);

      if (propertyId) {
        setProperties((prevArray) =>
          prevArray.map((obj) =>
            obj.property._id === propertyId
              ? { ...obj, chosen: false, starred: false, matchId: undefined }
              : obj
          )
        );
      }
    } catch (err) {
      throw err;
    } finally {
    }
  };

  return (
    <div className={`${className}`}>
      {!matchedView ? (
        <SuggestedMatches
          properties={properties}
          getProperties={getProperties}
          improveTrustScore={() => setImproveTrustScoreModalVisibility(true)}
          removePropertyMatch={removePropertyMatch}
          starProperty={starProperty}
          checkProperty={checkProperty}
          showSwitchToMatchedViewSwitch={checkedProperties.length > 0}
          matchedView={matchedView}
          setMatchedView={setMatchedView}
          setPropertyToView={setPropertyToView}
        />
      ) : (
        <AddedMatches
          properties={checkedProperties}
          setProperties={setCheckedProperties}
          removePropertyMatch={removePropertyMatch}
          getCheckedProperties={getCheckedProperties}
          matchedView={matchedView}
          setMatchedView={setMatchedView}
          setPropertyToView={setPropertyToView}
        />
      )}

      {propertyToView && (
        <ViewProperty
          open={true}
          starProperty={() =>
            starProperty(propertyToView?.property?._id, propertyToView.chosen, !propertyToView?.starred)
          }
          closeModal={() => setPropertyToView(null)}
          onBackdropClick={() => setPropertyToView(null)}
          propertyToView={propertyToView}
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

      <>
        <NewSetCriteria
          open={criteriaModalVisibility}
          setOpen={setCriteriaModalVisibility}
          afterRefineSearch={async () => {
            await getProperties();
          }}
        />
        {/*<SetCriteria*/}
        {/*  setShowModal={setCriteriaModalVisibility}*/}
        {/*  afterRefineSearch={() => {*/}
        {/*    setCriteriaModalVisibility(false);*/}
        {/*    getProperties();*/}
        {/*  }}*/}
        {/*/>*/}
      </>
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

interface MatchedSlideProps extends Omit<HTMLMotionProps<'div'>, 'property'> {
  image: string;
  viewProperty: () => void;
  property?: PropertyType['property'];
}

export const MatchedSlide = styled(
  ({ className, image, viewProperty, property, ...rest }: MatchedSlideProps) => {
    const deleted = !property;

    let parsedProperty: any = {};

    if (!deleted) {
      parsedProperty.avatar = !isNaN(parseInt(property.created_by.avatar || ''))
        ? avatars[parseInt(property.created_by.avatar || '')]?.image
        : '';

      parsedProperty.title = property.title;

      parsedProperty.image = property?.property_images[0].link || '';

      parsedProperty.propertyOwnerName = `${property.created_by.first_name} ${property.created_by.last_name}`;

      parsedProperty.areaOfInterest = property.area_of_interest;

      parsedProperty.numberOfBedrooms = property?.room_details?.number_of_bedrooms;

      parsedProperty.numberOfBathrooms = property?.room_details?.number_of_bathrooms;

      parsedProperty.numberOfBedroomsWord =
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
        }[property?.room_details?.number_of_bedrooms] || property?.room_details?.number_of_bedrooms;

      parsedProperty.rentingPrice = property.asset_rent?.rental_amount;
      parsedProperty.percentage = property?.percentage;
    }

    return (
      <>
        <motion.div className={`match-property-slide ${className}`} {...rest}>
          {deleted && (
            <div className='not-available'>
              <Typography>Not available!</Typography>
            </div>
          )}
          {!deleted && (
            <>
              <div className='slide-header'>
                <Avatar image={parsedProperty.avatar} />
                <Typography variant='body4'>
                  {parsedProperty.propertyOwnerName} • {property.percentage}%
                </Typography>
              </div>
              <div className='slide-footer'>
                <div className='left-part'>
                  <Typography className='property-name'>{parsedProperty.title}</Typography>
                  <div className='property-details'>
                    <div className='detail'>
                      <Icon icon='location' />
                      <Typography variant='body5'>{parsedProperty.areaOfInterest}</Typography>
                    </div>
                    •
                    <div className='detail'>
                      <Icon icon='banknote' />
                      <Typography variant='body5'>
                        £{parsedProperty.rentingPrice?.toLocaleString()} PCM
                      </Typography>
                    </div>
                    •
                    <div className='detail'>
                      <Icon icon='double-bed' />
                      <Typography variant='body5'>{parsedProperty.numberOfBedrooms}</Typography>
                    </div>
                    •
                    <div className='detail'>
                      <Icon icon='bathtub' />
                      <Typography variant='body5'>{parsedProperty.numberOfBathrooms}</Typography>
                    </div>
                  </div>
                </div>
                <Label variant='secondary' inverted onClick={viewProperty}>
                  View property
                </Label>
              </div>
            </>
          )}
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

    .not-available {
      width: 100%;
      height: 100%;
      display: grid;
      align-items: center;
      justify-content: center;
      margin-top: 32px;
      .typography {
        color: gray;
      }
    }

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
