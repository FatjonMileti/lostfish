import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Modal } from '../../components/Modal';
import { Typography } from '../../components/Typography';
import { Backdrop } from '../../components/Backdrop';
import { useUserStore } from '../../globalState/user';
import axios from '../../utils/axios';
import { mapTenant } from '../Matches/MatchesTenants/serializers';
import { Label } from '../../components/Label';
import { motion } from 'framer-motion';
import { MatchedSlide } from '../Matches/MatchesTenants/MatchesTenants';
import { getAvatarFormIndex } from './avatars';
import { ArrowButton } from '../../components/ArrowButton';

import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import ellipse from '../../assets/svg/Ellipse.svg';
import { ViewProfile } from '../Matches/MatchesTenants/ViewProfile';

export interface TenantType {
  id: string;
  criteria: any;
  property: any;
  chosen: boolean;
  starred: boolean;
  unread_messages: number;
  matchId?: string;
}

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId: string;
  matchType: 'match' | 'starred';
  propertyTitle: string;
}

export const PotentialMatches = styled(
  ({ className, showStore, propertyId, matchType, propertyTitle }: NewPropertyProps) => {
    const [modalVisibility, setModalVisibility] = showStore;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    const [checkedTenants, setCheckedTenants] = React.useState<TenantType[]>([]);
    const [criteriaToView, setCriteriaToView] = React.useState<TenantType | null>(null);
    const selectedTenant = checkedTenants[activeSlide];
    const { auth } = useUserStore();

    const navigate = useNavigate();

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % checkedTenants?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    React.useEffect(() => {
      getCheckedTenants();
    }, [matchType]);

    const getCheckedTenants = async () => {
      setLoading(true);
      try {
        let params: any = {
          propertyId
        };

        if (matchType === 'match') {
          params.chosen = true;
        } else if (matchType === 'starred') {
          params.starred = true;
        }

        const { data } = await axios(auth.access_token).get(
          matchType === 'match' ? `/api/match` : `/api/match/property`,
          {
            params
          }
        );
        setCheckedTenants(data.docs.map(mapTenant));
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const chatWith = (userId: string) => {
      try {
        navigate(`/messages?userId=${userId}`, { state: { propertyId: selectedTenant.property._id } });
      } catch (err) {}
    };

    return (
      <Modal
        className={`matches-modal ${className}`}
        open={modalVisibility}
        onBackdropClick={() => setModalVisibility(false)}
        onClose={() => setModalVisibility(false)}>
        <Backdrop open={loading}></Backdrop>
        <div className='header'>
          {matchType === 'starred' && (
            <Typography variant='body2'>
              Tenants that liked <span className='matching-with'>{propertyTitle}</span>
            </Typography>
          )}
          {matchType === 'match' && (
            <Typography variant='body2'>
              Potential perfect matches for <span className='matching-with'>{propertyTitle}</span>
            </Typography>
          )}
        </div>
        {criteriaToView && (
          <ViewProfile criteria={criteriaToView} closeViewProfile={() => setCriteriaToView(null)} />
        )}
        {checkedTenants.length > 0 && (
          <div className='container'>
            <div className={classNames('matches-slider', className)}>
              <div className='matches-slider-body'>
                <div className='trust-score-section'>
                  <Typography variant='body3' className='improve-trust-score-title'>
                    Did you know?
                  </Typography>
                  <Typography variant='body4' className='trust-score-description'>
                    Once you decide on your perfect match you will be able to get in touch and discuss more.
                    You can choose to view the property or have a Lostfish representative do that for you.
                    Once finished you can close the deal through our assisted platform.
                  </Typography>

                  <Label variant='tertiary' size='medium' className='improve-link'>
                    Find out more
                  </Label>
                </div>
                <div className='slides-wrapper'>
                  {checkedTenants.map((addedTenant, tenantIndex) => {
                    const { criteria: tenantCriteria, property } = addedTenant;

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
                          onViewProfileClick={() => setCriteriaToView(tenantCriteria)}
                          setActiveSlide={() => {}}
                          percentage={property.percentage || 0}
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
                      chatWith(selectedTenant.criteria.tenantId);
                    }}>
                    Message
                    {selectedTenant?.unread_messages > 0 && (
                      <img className='unread-message-indicator' src={ellipse} alt='Message indicator' />
                    )}
                  </Button>

                  <Button
                    variant='secondary'
                    startIcon={<Icon icon='user' size={24} />}
                    size='large'
                    className={classNames({ active: false })}
                    onClick={async () => navigate(`/matches`)}>
                    Go to Matches
                  </Button>
                </div>
                <ArrowButton
                  direction='right'
                  onClick={next}
                  size='large'
                  style={{ visibility: checkedTenants.length === 1 ? 'hidden' : 'initial' }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  }
)`
  &.matches-modal {
    overflow-y: auto;
    max-height: calc(100vh - 80px);
    height: auto;
    width: 80vw;
    top: calc(50% + 40px);

    border-radius: 12px 12px 0px 0px;

    .modal-container {
      padding: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 36px 36px 16px 36px;

      .body2 {
        font-weight: 400;
        line-height: 40px;

        .matching-with {
          color: #184d6d;
          border-bottom: 1px solid #184d6d;
        }
      }
    }
    .container {
      padding: 32px 36px;
      display: grid;
      justify-content: space-between;
      align-items: start;
      box-sizing: border-box;
      column-gap: 24px;

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
    }
    .delete-confirm-modal {
      .modal-container {
        padding: 0;
      }
      padding: 24px;
      max-width: 440px;
      .modal-header {
        display: flex;
        justify-content: flex-end;
      }
      .title {
        margin-top: 24px;
        text-align: center;
      }

      .description {
        margin-top: 16px;
        text-align: center;
      }
      .actions {
        margin-top: 48px;
        display: flex;
        column-gap: 16px;
        .button {
          flex-grow: 1;
        }
      }
    }
  }
`;
