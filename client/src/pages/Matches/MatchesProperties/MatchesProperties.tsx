import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import { ArrowButton } from '../../../components/ArrowButton';

import { Label } from '../../../components/Label';
import { Avatar } from '../../../components/Avatar';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { useCriteriaStore } from '../../../globalState/criteria';
import { ImproveTrustScoreModal } from '../ImproveTrustScoreModal';
import { SetCriteria } from '../../SetCriteria/SetCriteria';

interface PropertyType {
  property_images: any[];
  area_of_interest: string;
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  asset_rent: {
    rental_amount?: string;
  };

  id: string;
  created_by: any;
  matchId?: string;
  chosen: boolean;
  starred: boolean;
}

interface MatchesPropertiesProps extends HTMLAttributes<HTMLDivElement> {}
export const MatchesProperties = styled(({ className }: MatchesPropertiesProps) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [properties, setProperties] = React.useState<PropertyType[]>([]);
  const [improveTrustScoreModalVisibility, setImproveTrustScoreModalVisibility] = React.useState(false);
  const [criteriaModalVisibility, setCriteriaModalVisibility] = React.useState(false);

  const { auth } = useUserStore();

  const criteriaStore = useCriteriaStore();

  React.useEffect(() => {
    getProperties();
  }, []);

  const property = properties[activeSlide];
  const getProperties = async () => {
    const { data } = await axios(auth.access_token).get('/api/asset/matches-example');
    setProperties(data.docs.map((doc: any) => ({ ...doc, chosen: false, starred: false, id: doc._id })));

    await Promise.all(
      data.docs.map(async (d: any) => {
        await isPropertyChosen(d._id);
      })
    );
  };

  const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % properties?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
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

        const property = propertiesCopy.find((p: any) => p.id === propertyId);
        if (property) {
          const tenantIndex = propertiesCopy.indexOf(property);
          propertiesCopy[tenantIndex].chosen = match.chosen;
          propertiesCopy[tenantIndex].starred = match.starred;
          propertiesCopy[tenantIndex].matchId = match.matchId;
        }

        return propertiesCopy;
      });
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setProperties((properties) => {
          const propertiesCopy = [...properties];

          const property = propertiesCopy.find((p: any) => p.id === propertyId);
          if (property) {
            const tenantIndex = propertiesCopy.indexOf(property);
            propertiesCopy[tenantIndex].chosen = false;
            propertiesCopy[tenantIndex].starred = false;
            propertiesCopy[tenantIndex].matchId = undefined;
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
    tenantId: string,
    chosen: boolean = false,
    starred: boolean = false
  ) => {
    const matchId = properties.find((p) => p.id === tenantId)?.matchId || false;

    if (matchId) {
      await axios(auth.access_token).put(`/api/match/${matchId}`, { chosen, starred });
    } else {
      await axios(auth.access_token).post('/api/match/property', { property: tenantId, chosen, starred });
    }

    isPropertyChosen(property?.id);
  };

  const removeTenantMatch = async (matchId: string) => {
    try {
      await axios(auth.access_token).delete(`/api/match/${matchId}`);
      isPropertyChosen(property.id);
    } catch (err) {
      throw err;
    } finally {
    }
  };

  return (
    <div className={`${className}`}>
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

      <div>
        <Typography>
          Matching with <span className='matching-with'>properties in {criteriaStore.areaOfInterest} +</span>
        </Typography>
        <Typography variant='body5' className='sub-title'>
          Displaying 1240 matches. Enter more details to refine your search.
        </Typography>
      </div>

      <div className='matches-slider'>
        <div className='matches-slider-body'>
          <div className='trust-score-section'>
            <Typography variant='body5' className='your-trust-score-text'>
              Your trust score
            </Typography>
            <Typography variant='h3' className='trust-score'>
              45%
            </Typography>
            <Typography variant='body3' className='improve-trust-score-title'>
              Improve your trust score and find better matches
            </Typography>
            <Typography variant='body4' className='trust-score-description'>
              Go through the steps below to improve your trust score. Remember that you can’t close a certain
              deal without maximum trust score.
            </Typography>

            <Label
              variant='tertiary'
              size='medium'
              className='improve-link'
              onClick={() => setImproveTrustScoreModalVisibility(true)}>
              Improve trust score
              <Icon icon='arrow-right-1' size={16} />
            </Label>
          </div>
          <div className='slides-wrapper'>
            {properties.map((property, propertyIndex) => {
              const property_images: any = property?.property_images;
              return (
                <MatchedSlide
                  key={propertyIndex}
                  className={`${propertyIndex === activeSlide ? 'active' : ''}`}
                  image={`${property_images?.[0]}`}
                  propertyOwnerName={`${property.created_by.first_name} ${property.created_by.last_name}`}
                  avatar={''}
                  animate={{
                    x:
                      propertyIndex < activeSlide
                        ? `calc(${-100 * propertyIndex}% - ${propertyIndex * 24}px)`
                        : `calc(${-100 * activeSlide}% - ${24 * activeSlide - propertyIndex}px)`,
                    scale: propertyIndex < activeSlide ? 0.9 : 1,
                    y: propertyIndex >= activeSlide ? `0` : `32px`,
                    opacity: propertyIndex === activeSlide ? 1 : 0.5
                  }}
                  transition={{ ease: 'easeOut', duration: 0.5 }}
                  areaOfInterest={property.area_of_interest}
                  numberOfBedrooms={property?.room_details?.number_of_bedrooms}
                  rentingPrice={property.asset_rent?.rental_amount}
                  numberOfBathrooms={property?.room_details?.number_of_bathrooms}
                />
              );
            })}
          </div>
        </div>
        <div className='matches-slider-footer'>
          <ArrowButton
            direction='left'
            onClick={previous}
            style={{ visibility: activeSlide === 0 ? 'hidden' : 'initial' }}
            size='large'
          />
          <div className='match-actions'>
            <IconButton
              className='remove-button'
              size='large'
              onClick={() => {
                if (property?.matchId) {
                  removeTenantMatch(property?.matchId);
                }
              }}
              disabled={!property?.matchId}>
              <Icon icon='close' size={28} />
            </IconButton>

            <IconButton
              size='large'
              inverted
              className={`check-button ${property?.chosen ? 'active' : ''}`}
              onClick={() => {
                addOrUpdateTenantMatch(property.id, true, property?.starred);
              }}>
              <Icon icon='checked' size={28} />
            </IconButton>

            <IconButton
              size='large'
              className={`star-button ${property?.starred ? 'active' : ''}`}
              onClick={() => {
                addOrUpdateTenantMatch(property.id, property?.chosen, true);
              }}>
              <Icon icon='star-solid' size={28} />
            </IconButton>
          </div>
          <ArrowButton
            direction='right'
            onClick={next}
            size='large'
            style={{ visibility: properties.length === 1 ? 'hidden' : 'initial' }}
          />
        </div>
      </div>
    </div>
  );
})`
  & {
    display: grid;
    row-gap: 48px;
    grid-template-rows: min-content auto;

    .matches-slider {
      display: grid;
      align-content: space-between;

      .matches-slider-body {
        display: grid;
        grid-template-columns: 1fr 3fr;
        column-gap: 24px;

        .trust-score-section {
          display: grid;
          align-content: center;

          .trust-score {
            margin-top: 4px;
            line-height: 64px;
            color: #e5155a;
            font-family: Roobert, serif;
            font-weight: 700;
          }

          .improve-trust-score-title {
            margin-top: 16px;
          }

          .trust-score-description {
            margin-top: 16px;
          }

          .improve-link {
            margin-top: 24px;
          }

          .your-trust-score-text {
            line-height: 16px;
            color: #a7a7a7;
          }
        }

        .slides-wrapper {
          padding-bottom: 40px;
          padding-left: 24px;
          margin-left: -24px;
          margin-right: -36px;
          display: flex;
          column-gap: 24px;

          overflow-x: hidden;
        }
      }

      .matches-slider-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 84px;

        .match-actions {
          display: flex;
          column-gap: 24px;
          align-items: center;

          .star-button {
            padding: 16px;
            border: 2px solid #0d2a38;

            &.active {
              border: 2px solid #184d6d;
              background: #184d6d;
              color: white;

              :hover {
                border: 2px solid #0d2a38;
                background: #0d2a38;
              }
            }

            :hover {
              border: 2px solid white;
              background-color: white;
            }
          }

          .remove-button {
            padding: 16px;
            border: 2px solid #b4263b;
            color: #b4263b;

            :hover {
              border: 2px solid white;
              background-color: white;
            }

            &:disabled {
              border: 2px solid #a7a7a7;
              color: #a7a7a7;
            }
          }

          .check-button {
            padding: 30px;
            border: 2px solid #184d6d;
            :hover {
              background-color: #0d2a38;
              color: white;
            }

            &.active {
              border: 2px solid #408140;
              background: #408140;
            }
          }
        }
      }
    }

    .matching-with {
      color: #184d6d;
      border-bottom: 1px solid #184d6d;
    }

    .sub-title {
      margin-top: 8px;
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
}

const MatchedSlide = styled(
  ({
    className,
    image,
    avatar,
    areaOfInterest = '',
    numberOfBedrooms = '',
    numberOfBathrooms = '',
    rentingPrice = '',
    propertyOwnerName = '',
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
          <Label variant='secondary' inverted>
            View property
          </Label>
        </div>
      </motion.div>
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

    .slide-header {
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
