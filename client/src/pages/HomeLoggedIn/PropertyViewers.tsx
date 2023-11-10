import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Modal } from '../../components/Modal';
import { Typography } from '../../components/Typography';
import { Backdrop } from '../../components/Backdrop';
import { useUserStore } from '../../globalState/user';
import axios from '../../utils/axios';
import { motion } from 'framer-motion';
import { MatchedSlide } from '../Matches/MatchesTenants/MatchesTenants';
import { getAvatarFormIndex } from './avatars';
import { ArrowButton } from '../../components/ArrowButton';
import { mapCriteria } from '../Matches/MatchesTenants/serializers';
import { ViewProfile } from '../Matches/MatchesTenants/ViewProfile';
import { SuggestedTenantType } from '../Matches/matches.type';

export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId: string;
  propertyTitle: string;
}

type UserType = {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  criteria: any;
  match_similarity: number;
};

export const PropertyViewers = styled(
  ({ className, showStore, propertyId, propertyTitle }: NewPropertyProps) => {
    const [modalVisibility, setModalVisibility] = showStore;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    const [users, setUsers] = React.useState<UserType[]>([]);
    const [criteriaToView, setCriteriaToView] = React.useState<SuggestedTenantType | null>(null);
    const { auth } = useUserStore();

    const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % users?.length));
    const previous = () => {
      activeSlide >= 1 && setActiveSlide((activeSlide) => activeSlide - 1);
    };

    React.useEffect(() => {
      getPropertyViewers();
    }, []);

    const getPropertyViewers = async () => {
      setLoading(true);
      try {
        const { data } = await axios(auth.access_token).get(`/api/asset/${propertyId}/viewed-by`);
        setUsers(
          data.docs.map((user: any) => {
            const { criteria, ...rest } = user;
            criteria.created_by = rest;
            return {
              ...rest,
              criteria: mapCriteria(criteria)
            };
          })
        );
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal
        className={`matches-modal ${className}`}
        open={modalVisibility}
        onBackdropClick={() => setModalVisibility(false)}
        onClose={() => setModalVisibility(false)}>
        <Backdrop open={loading}></Backdrop>
        <div className='header'>
          <Typography variant='body2'>
            Viewers of <span className='matching-with'>{propertyTitle}</span>
          </Typography>
        </div>
        {criteriaToView && (
          <ViewProfile criteria={criteriaToView} closeViewProfile={() => setCriteriaToView(null)} />
        )}
        {users.length === 0 && <div className='container'>No data</div>}
        {users.length > 0 && (
          <div className='container'>
            <div className={classNames('matches-slider', className)}>
              <div className='matches-slider-body'>
                <div className='slides-wrapper'>
                  {users.map((user, tenantIndex) => {
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
                          avatar={getAvatarFormIndex(user.avatar)}
                          name={`${user.first_name} ${user.last_name}`}
                          onViewProfileClick={() => setCriteriaToView(user.criteria)}
                          setActiveSlide={() => {}}
                          percentage={user.match_similarity || 0}
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
                <div className='match-actions'></div>
                <ArrowButton
                  direction='right'
                  onClick={next}
                  size='large'
                  style={{ visibility: users.length === 1 ? 'hidden' : 'initial' }}
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
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      .matches-slider {
        display: grid;
        align-content: space-between;

        .matches-slider-body {
          display: flex;
          justify-content: center;
          align-items: center;

          .slides-wrapper {
            justify-content: center;
            align-items: center;
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
