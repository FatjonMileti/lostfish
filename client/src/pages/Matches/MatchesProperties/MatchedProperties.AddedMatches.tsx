import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchedSlide, PropertyType } from './MatchesProperties';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../../components/Switch';

interface AddedMatchedProperty {
  _id: string;

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

    id: string;

    asset_address: any;

    created_by: {
      _id: string;
      email: string;
      first_name: string;
      last_name: string;
      avatar: string;
    };
  };

  matchId?: string;
  chosen: boolean;
  starred: boolean;
}

interface AddedMatchesProps extends HTMLAttributes<HTMLDivElement> {
  properties: AddedMatchedProperty[];
  setProperties: (
    properties: AddedMatchedProperty[] | ((properties: AddedMatchedProperty[]) => AddedMatchedProperty[])
  ) => void;
  removePropertyMatch: (matchId: string, propertyId?: string) => Promise<void>;
  getCheckedProperties: () => Promise<void>;
  matchedView: boolean;
  setMatchedView: (matchedView: boolean) => void;
  setPropertyToView: (propertyToView: PropertyType) => void;
}
export const AddedMatches = styled(
  ({
    className,
    properties,
    removePropertyMatch,
    getCheckedProperties,
    matchedView,
    setMatchedView,
    setPropertyToView
  }: AddedMatchesProps) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    const [viewPropertyModalVisibility, setViewPropertyModalVisibility] = React.useState(false);
    const navigate = useNavigate();
    const matchedProperty: AddedMatchedProperty = properties[activeSlide];
    const property = matchedProperty?.property;

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % properties?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    const chantWith = (userId: string) => {
      try {
        navigate(`/messages?userId=${userId}`);
      } catch (err) {}
    };

    return (
      <>
        <div className='page-title-section'>
          <div>
            <Typography>
              Matching with{' '}
              <span className='matching-with'>
                {' '}
                {properties.length} potential {properties.length > 1 ? 'properties' : 'propertry'}
              </span>
            </Typography>
            <Typography variant='body5' className='sub-title'>
              Displaying 1240 matches. Enter more details to refine your search.
            </Typography>
          </div>

          {((id: string) => (
            <div className='switch-to-matched-view-button-wrapper'>
              <>
                <label htmlFor={id}>Switch to matched view</label>
                <Switch id={id} checked={matchedView} onChange={(e) => setMatchedView(e.target.checked)} />
              </>
            </div>
          ))(React.useId())}
        </div>
        <div className={classNames('matches-slider', className)}>
          <div className='matches-slider-body'>
            <div className='trust-score-section'>
              <Typography variant='body3' className='improve-trust-score-title'>
                Did you know?
              </Typography>
              <Typography variant='body4' className='trust-score-description'>
                Once you decide on your perfect match you will be able to get in touch and discuss more. You
                can choose to view the property or have a Lostfish representative do that for you. Once
                finished you can close the deal through our assisted platform.
              </Typography>

              <Label variant='tertiary' size='medium' className='improve-link'>
                Find out more
              </Label>
            </div>
            <div className='slides-wrapper'>
              {properties.map((addedProperty, propertyIndex) => {
                const { property } = addedProperty;
                return (
                  <motion.div
                    animate={{
                      x:
                        propertyIndex < activeSlide
                          ? `calc(${-100 * propertyIndex}% - ${propertyIndex * 24}px)`
                          : `calc(${-100 * activeSlide}% - ${24 * activeSlide - propertyIndex}px)`,
                      scale: propertyIndex < activeSlide ? 0.9 : 1,
                      y: propertyIndex >= activeSlide ? `0` : `32px`,
                      opacity: propertyIndex === activeSlide ? 1 : 0.5
                    }}
                    transition={{ ease: 'easeOut', duration: 0.5 }}>
                    <MatchedSlide
                      key={propertyIndex}
                      className={classNames({ active: propertyIndex === activeSlide })}
                      image={`${property?.property_images?.[0].link || ''}`}
                      viewProperty={() => setPropertyToView(addedProperty)}
                      property={property}
                    />
                  </motion.div>
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
              <Button
                startIcon={<Icon icon='email' size={24} />}
                size='large'
                className={classNames({ active: false })}
                onClick={async () => {
                  chantWith(property.created_by._id);
                }}>
                Messages
              </Button>

              <Button
                variant='secondary'
                startIcon={<Icon icon='close' size={24} />}
                size='large'
                className={classNames({ active: false })}
                onClick={async () => {
                  console.log('unmatch');
                  await removePropertyMatch(matchedProperty._id, matchedProperty?.property?._id);
                  await getCheckedProperties();
                }}>
                Unmatch
              </Button>
            </div>
            <ArrowButton
              direction='right'
              onClick={next}
              size='large'
              style={{ visibility: properties.length === 1 ? 'hidden' : 'initial' }}
            />
          </div>
        </div>
      </>
    );
  }
)`
  &.matches-slider {
    display: grid;
    align-content: space-between;

    .matches-slider-body {
      display: grid;
      grid-template-columns: 1fr 3fr;
      column-gap: 24px;

      .trust-score-section {
        display: grid;
        align-content: center;

        .improve-trust-score-title {
          margin-top: 16px;
          font-family: At Gambit, serif;
        }

        .trust-score-description {
          margin-top: 16px;
        }

        .improve-link {
          margin-top: 24px;
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

        padding-top: 24px;
        margin-top: -24px;
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
`;
