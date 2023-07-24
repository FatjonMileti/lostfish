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

import { avatars } from '../../HomeLoggedIn/avatars';
import { Backdrop } from '../../../components/Backdrop';
import { Button } from '../../../components/Button';
import { ViewProfile } from './ViewProfile';

interface TenantType {
  id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  propertyType: string[];
  propertyPreferences: string[];
  areaOfInterest: string;
  radius: string;
  moveIn: string;
  budget: string;
  nrOfBedrooms: string;
  nrOfBathrooms: string;
  specificPropertyFeatures: string[];
  depositAmount: string;
  chosen: boolean;
  starred: boolean;
}

interface MatchesTenantsProps extends HTMLAttributes<HTMLDivElement> {}
export const MatchesTenants = styled(({ className }: MatchesTenantsProps) => {
  const [loadingTenants, setLoadingTenants] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const [tenants, setTenants] = React.useState<TenantType[]>([]);
  const [improveTrustScoreModalVisibility, setImproveTrustScoreModalVisibility] = React.useState(false);
  const [viewProfileVisibility, setViewProfileVisibility] = React.useState(false);

  const { auth } = useUserStore();

  const criteriaStore = useCriteriaStore();

  React.useEffect(() => {
    getTenants();
  }, []);

  React.useEffect(() => {
    if (tenants[activeSlide]) {
      isTenantChosen(tenants[activeSlide].id);
    }
  }, [activeSlide]);

  const isTenantChosen = async (tenantId: string) => {
    const { data } = await axios(auth.access_token).get(`/api/match/check?tenant=${tenantId}`);

    console.log('isChosen: ', data);
  };

  const getTenants = async () => {
    try {
      setLoadingTenants(true);
      const { data } = await axios(auth.access_token).get('/api/criteria/user-example-matches');

      setTenants(
        data.docs.map((doc: any) => ({
          id: doc._id,
          avatar: doc.avatar,
          firstName: doc.first_name,
          lastName: doc.last_name,
          propertyType: doc?.criteria?.property_type || [],
          propertyPreferences: doc?.criteria?.property_preferences || [],
          areaOfInterest: doc?.criteria?.area_of_interest || '',
          radius: doc?.criteria?.radius ? `${doc?.criteria?.radius} mi` : '',
          moveIn: doc?.criteria?.moving_time || '',
          budget: (doc?.criteria?.budget || '')
            .split(' - ')
            .map((v: string) => (!isNaN(parseInt(v)) ? `£${parseInt(v).toLocaleString()}` : ''))
            .join(' - '),
          nrOfBedrooms: doc?.criteria?.room_details?.number_of_bedrooms || '',
          nrOfBathrooms: doc?.criteria?.room_details?.number_of_bathrooms || '',
          specificPropertyFeatures: doc?.criteria?.specific_property_features || [],
          depositAmount: doc?.criteria?.deposit_amount || '',
          chosen: false,
          starred: false
        }))
      );
    } catch (err) {
      throw err;
    } finally {
      setLoadingTenants(false);
    }
  };

  const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % tenants?.length));
  const previous = () => {
    activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
  };

  const tenant = tenants[activeSlide];

  const addTenantMatch = async (tenantId: string) => {
    try {
      await axios(auth.access_token).post('/api/match/tenant', { tenant: tenantId, chosen: true });
    } catch (err) {
      throw err;
    } finally {
    }
  };

  return (
    <div className={`${className}`}>
      <Backdrop open={loadingTenants}></Backdrop>
      <ImproveTrustScoreModal
        open={improveTrustScoreModalVisibility}
        closeModal={() => setImproveTrustScoreModalVisibility(false)}
      />
      {viewProfileVisibility && (
        <ViewProfile
          avatar={avatars[parseInt(tenant.avatar || '')].image}
          closeViewProfile={() => setViewProfileVisibility(false)}
          name={`${tenant.firstName} ${tenant.lastName}`}
          propertyType={tenant.propertyType.join(', ')}
          propertyPreferences={tenant.propertyPreferences.join(', ')}
          areaOfInterest={tenant.areaOfInterest}
          radius={tenant.radius}
          moveIn={tenant.moveIn}
          budget={tenant.budget}
          nrOfBedrooms={tenant.nrOfBedrooms}
          nrOfBathrooms={tenant.nrOfBathrooms}
          parkingNeeded={tenant.specificPropertyFeatures.includes('Parking spot') ? 'Yes' : 'No'}
          depositAmount={!isNaN(parseInt(tenant.depositAmount)) ? `£${parseInt(tenant.depositAmount)}` : ''}
        />
      )}
      <div>
        <Typography>
          Matching with <span className='matching-with'>renters in {criteriaStore.areaOfInterest} +</span>
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
            {tenants.map((tenant, tenantIndex) => {
              return (
                <MatchedSlide
                  key={tenantIndex}
                  className={`${tenantIndex === activeSlide ? 'active' : ''}`}
                  avatar={
                    !isNaN(parseInt(tenant.avatar || ''))
                      ? avatars[parseInt(tenant.avatar || '')].image
                      : undefined
                  }
                  animate={{
                    x:
                      tenantIndex < activeSlide
                        ? `calc(${-100 * tenantIndex}% +  ${32 * tenantIndex}px) `
                        : `calc(${-100 * activeSlide}% + ${32 * activeSlide}px)`,

                    scale: tenantIndex < activeSlide ? 0.9 : 1,
                    y: tenantIndex >= activeSlide ? `0` : `32px`,
                    opacity: tenantIndex === activeSlide ? 1 : 0.5
                  }}
                  transition={{ ease: 'easeOut', duration: 0.5 }}
                  active={tenantIndex === activeSlide}
                  onViewProfileClick={() => {
                    setViewProfileVisibility(true);
                  }}
                  setActiveSlide={() => setActiveSlide(tenantIndex)}
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
            <IconButton className='remove-button' size='large'>
              <Icon icon='close' size={28} />
            </IconButton>

            <IconButton
              size='large'
              inverted
              className='check-button'
              onClick={() => {
                addTenantMatch(tenant.id);
              }}>
              <Icon icon='checked' size={28} />
            </IconButton>

            <IconButton className='star-button' size='large'>
              <Icon icon='star-solid' size={28} />
            </IconButton>
          </div>
          <ArrowButton
            direction='right'
            onClick={next}
            size='large'
            style={{ visibility: avatars.length === 1 ? 'hidden' : 'initial' }}
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
        grid-template-columns: 1fr 2fr;
        column-gap: 24px;

        .trust-score-section {
          display: grid;
          align-content: center;
          max-width: 324px;

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
          display: flex;
          overflow-x: hidden;

          margin-right: -36px;
          padding-right: 36px;

          padding-left: calc(32px + 32px);

          padding-bottom: 24px;
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
            :hover {
              border: 2px solid white;
              background-color: white;
            }
          }

          .remove-button {
            padding: 16px;
            border: 2px solid #0d2a38;
            :hover {
              border: 2px solid white;
              background-color: white;
            }
          }

          .check-button {
            padding: 30px;
            :hover {
              background-color: #0d2a38;
              color: white;
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
  avatar?: string;
  active?: boolean;
  onViewProfileClick: () => void;
  setActiveSlide: () => void;
}

const MatchedSlide = styled(
  ({ className, avatar, active = false, onViewProfileClick, setActiveSlide, ...rest }: MatchedSlideProps) => {
    return (
      <motion.div className={`match-property-slide ${className}`} {...rest}>
        <Avatar image={avatar} className={`${active ? 'active' : ''}`} onClick={setActiveSlide} />

        <motion.div
          className='action-buttons'
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ ease: 'easeOut', duration: 0.5 }}>
          <div className='tenant-details'>
            <Typography variant='body4' className='tenant-name'>
              Nancy Jones
            </Typography>
            <Typography variant='body4' className='tenant-dot'>
              •
            </Typography>
            <Typography variant='body4' className='tenant-match-percentage'>
              34%
            </Typography>
          </div>
          <Button size='small' variant='secondary' onClick={onViewProfileClick}>
            View profile
          </Button>
        </motion.div>
      </motion.div>
    );
  }
)`
  &.match-property-slide {
    display: grid;
    row-gap: 16px;
    width: 372px;
    height: auto;
    flex-shrink: 0;
    align-content: space-between;
    opacity: 0.5;

    margin-left: -32px;

    &.active {
      z-index: 1;
      opacity: 1;
    }

    .avatar {
      position: relative;
      width: 372px;
      height: 372px;
      overflow: hidden;
      flex-shrink: 0;
      cursor: pointer;
      box-sizing: border-box;

      &.active {
        box-shadow: 0 7.7px 23.2px 0 rgba(0, 0, 0, 0.25);
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;

      .tenant-details {
        display: flex;
        column-gap: 8px;
        padding: 20px 32px;
        font-weight: 700;

        .tenant-dot,
        .tenant-match-percentage {
          color: #c4b1a3;
        }
      }
    }
  }
`;
