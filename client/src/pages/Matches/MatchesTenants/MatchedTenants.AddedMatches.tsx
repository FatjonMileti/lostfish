import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Icon } from '../../../components/Icon';
import { ArrowButton } from '../../../components/ArrowButton';
import { MatchedSlide, SuggestedTenantType } from './MatchesTenants';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../../components/Switch';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
import ellipse from '../../../assets/svg/Ellipse.svg';

interface AddedTenantsProps extends HTMLAttributes<HTMLDivElement> {
  tenants: SuggestedTenantType[];
  setTenants: (
    tenants: SuggestedTenantType[] | ((tenants: SuggestedTenantType[]) => SuggestedTenantType[])
  ) => void;
  removeTenantMatch: (matchId: string) => Promise<void>;
  getCheckedTenants: () => Promise<void>;
  matchedView: boolean;
  setMatchedView: (matchedView: boolean) => void;
  setTenantToView: (propertyToView: SuggestedTenantType) => void;
}
export const AddedTenants = styled(
  ({
    className,
    tenants,
    removeTenantMatch,
    getCheckedTenants,
    matchedView,
    setMatchedView,
    setTenantToView
  }: AddedTenantsProps) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    const navigate = useNavigate();
    const suggestedTenant: SuggestedTenantType = tenants[activeSlide];
    const criteria = suggestedTenant?.criteria;
    const property = suggestedTenant?.property;

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % tenants?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    useEffect(() => {
      if (tenants.length === 0) {
        setMatchedView(false);
      }
    }, [tenants.length]);

    const chatWith = (userId: string) => {
      try {
        navigate(`/messages?userId=${userId}`, { state: { propertyId: property._id } });
      } catch (err) {}
    };

    return (
      <>
        <div className='page-title-section'>
          <div>
            <Typography>
              Matched with{' '}
              <span className='matching-with'>
                {' '}
                {tenants.length} potential {tenants.length > 1 ? 'tenants' : 'tenant'}
              </span>
            </Typography>
            <Typography variant='body5' className='sub-title'>
              Congratulations! Review your matches and select the one perfect for you.
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
              {tenants.map((addedTenant, tenantIndex) => {
                const { criteria: tenantCriteria } = addedTenant;
                return (
                  <motion.div
                    key={tenantIndex}
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
                    style={{ marginLeft: '-32px' }}>
                    <MatchedSlide
                      active={tenantIndex === activeSlide}
                      avatar={getAvatarFormIndex(tenantCriteria.avatar)}
                      name={`${tenantCriteria.firstName} ${tenantCriteria.lastName}`}
                      onViewProfileClick={() => setTenantToView(suggestedTenant)}
                      setActiveSlide={() => {}}
                      percentage={property?.percentage}
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
                className={classNames('message-button', { active: false })}
                onClick={async () => {
                  chatWith(criteria.tenantId);
                }}>
                Messages
                {suggestedTenant?.unread_messages > 0 && (
                  <img className='unread-message-indicator' src={ellipse} alt='Message indicator' />
                )}
              </Button>

              <Button
                variant='secondary'
                startIcon={<Icon icon='close' size={24} />}
                size='large'
                className={classNames({ active: false })}
                onClick={async () => {
                  await removeTenantMatch(suggestedTenant.matchId as string);
                  await getCheckedTenants();
                }}>
                Unmatch
              </Button>
            </div>
            <ArrowButton
              direction='right'
              onClick={next}
              size='large'
              style={{ visibility: tenants.length === 1 ? 'hidden' : 'initial' }}
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
      grid-template-columns: 1fr 2fr;
      column-gap: 24px;

      .trust-score-section {
        display: grid;
        align-content: center;
        max-width: 324px;

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

        margin-right: -36px;
        display: flex;

        overflow-x: hidden;

        padding-left: calc(32px + 32px);
        margin-left: -32px;

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

        .message-button {
          display: flex;
          align-items: flex-end;
          gap: -20px;
          justify-content: space-between;
          position: relative;

          .unread-message-indicator {
            position: absolute;
            top: 10px;
            right: -5px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
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
