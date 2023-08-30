import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';
import { Icon } from '../../components/Icon';
import { avatars } from './avatars';
import { IconButton } from '../../components/IconButton';
import { useProfileStore } from '../../globalState/profile';
import { ImproveTrustScoreModal } from '../PagesComponents/ImproveTrustScoreModal';
import { useNavigate } from 'react-router-dom';
import { NewSetCriteria } from '../SetCriteria/NewSetCriteria/NewSetCriteria';
import Can from '../../components/Can';
import { CASLAction } from '../../utils/ability.util';
import { TPropertyDetails, usePropertyDetailsHook } from './hooks/usePropertyDetails.hook';
import { useCriteriaStore } from '../../globalState/criteria';

export const SectionOne = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const profileStore = useProfileStore();
  const [improveTrustScoreModalVisibility, setImproveTrustScoreModalVisibility] = React.useState(false);
  const [criteriaModalVisibility, setCriteriaModalVisibility] = React.useState(false);

  const { property, propertyDetails } = usePropertyDetailsHook();

  const navigate = useNavigate();

  return (
    <>
      <ImproveTrustScoreModal
        open={improveTrustScoreModalVisibility}
        closeModal={() => setImproveTrustScoreModalVisibility(false)}
      />

      {profileStore.role === 'Tenant' && (
        <NewSetCriteria open={criteriaModalVisibility} setOpen={setCriteriaModalVisibility} />
      )}

      <div className={className}>
        <div className='section-content'>
          <div className='wellcome'>
            <Typography>Hi, {profileStore.first_name}</Typography>
            <Typography variant='body4' className='center texts'>
              Our goal is to revolutionise the property industry by using technology and data to empower and
              inform customers in the buying, selling, and renting process.
            </Typography>
          </div>
          <div className='section'>
            <Can do={CASLAction.Read} on='LandlordMatches'>
              {property && propertyDetails && (
                <LandlordSectionMatches property={property} propertyDetails={propertyDetails} />
              )}
            </Can>
            <Can do={CASLAction.Read} on='ClientMatches'>
              {property && propertyDetails && (
                <TenantSectionMatches
                  property={property}
                  propertyDetails={propertyDetails}
                  setCriteriaModalVisibility={setCriteriaModalVisibility}
                />
              )}
            </Can>
            <div className='slider-wrapper'>
              <div className='recommandation-wrapper'>
                <div className='recommandation-buttons'>
                  <div className='recommandation'>
                    <Typography variant='body5' className='title'>
                      Recommendation • 1/5
                    </Typography>
                    <Typography variant='body4' className='bold'>
                      Improve your trust score for curated matches
                    </Typography>
                  </div>
                  <div className='buttons'>
                    <IconButton size='large'>
                      <Icon icon='chevron-left' size={16} />
                    </IconButton>
                    <IconButton size='large'>
                      <Icon icon='chevron-right' size={16} />
                    </IconButton>
                  </div>
                </div>
                <Typography variant='body4' className='texts'>
                  Our goal is to revolutionise the property industry by using technology and data to empower
                  and inform customers in the buying, selling, and renting process.
                </Typography>
                <div className='cta'>
                  <Label
                    variant='tertiary'
                    size='medium'
                    className='improve-link'
                    onClick={() => setImproveTrustScoreModalVisibility(true)}>
                    Improve trust score
                    <Icon icon='arrow-right-1' size={16} />
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
})`
  & {
    display: flex;
    padding: 64px 36px;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;

    .section-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 48px;

      .texts {
        color: #000;
        font-style: normal;
        font-weight: 400;
        align-self: stretch;
      }
      .wellcome {
        display: flex;
        width: 672px;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        .center {
          text-align: center;
        }
      }
      .section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;

        .bold {
          font-size: 18px;
          font-weight: 700;
        }

        .title {
          color: #646464;
          font-style: normal;
          font-weight: 500;
          line-height: 16px;
        }

        .current-search-wrapper {
          display: flex;
          width: 672px;
          padding: 24px;
          flex-direction: column;
          align-items: flex-start;
          gap: 32px;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);

          .current-search {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-self: stretch;

            .match {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;

              .matching-with {
                color: #184d6d;
              }
            }

            .matches {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 8px;

              .number {
                color: #e5155a;
                text-align: center;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
              }
            }
          }
          .hr-line {
            height: 1px;
            align-self: stretch;
            background: #f3f4f5;
          }
          .avatars-buttons {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-self: stretch;

            button {
              color: #184d6d;
              border: 1px solid #184d6d;
              border-radius: 250px;
              font-family: Roobert;
              font-size: 18px;
              font-weight: 600;

              &:hover {
                background: #184d6d;
                color: #fff;
              }
            }

            .active {
              background: #184d6d;
              color: #fff;
            }

            .potential-matches-list {
              display: flex;
              .avatar {
                height: 64px;
                width: 64px;
                margin-left: -8px;
                z-index: 1;
                &:first-of-type {
                  margin-left: 0;
                }
              }

              .others-number {
                height: 64px;
                width: 64px;
                border-radius: 50%;
                background-color: #f7f1e7;
                font-weight: 700;
                display: flex;
                flex-shrink: 0;
                align-items: center;
                justify-content: center;
                margin-left: -8px;
                color: #0d2a38;
              }
            }
            .buttons {
              display: flex;
              align-items: flex-start;
              gap: 8px;
            }
          }
        }

        .slider-wrapper {
          .recommandation-wrapper {
            display: flex;
            width: 672px;
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
            z-index: 1;

            .recommandation-buttons {
              display: flex;
              justify-content: space-between;
              align-items: center;
              align-self: stretch;

              .recommandation {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
              }
              .buttons {
                display: flex;
                align-items: center;
                gap: 8px;

                .icon-button {
                  background: #fff;
                  border: 2px solid #f3f4f5;
                  padding: 14px;
                }

                .icon-button:hover {
                  background-color: #0d2a38;
                  color: #fff;
                }
              }
            }
            .cta {
              display: flex;
              padding: 8px 0px;
              align-items: flex-start;
              gap: 8px;
            }
          }
          /* .card-one {
            position: relative;
            z-index: 1;
          }

          .card-two {
            position: relative;
            transform: translateY(-230px) scaleX(0.95);
            z-index: 0;
          } */
        }
      }
    }
  }
`;

const LandlordSectionMatches = ({
  property,
  propertyDetails
}: {
  property: IProperty;
  propertyDetails: TPropertyDetails;
}) => {
  const navigate = useNavigate();

  return (
    <div className='current-search-wrapper'>
      <div className='current-search'>
        <div className='match'>
          <Typography variant='body5' className='title'>
            Current search
          </Typography>
          <Typography variant='body4' className='bold'>
            Matching with <span className='matching-with'>Tenants from {property.area_of_interest}</span>
          </Typography>
        </div>
        <div className='matches'>
          <Typography variant='body5' className='title'>
            Matches
          </Typography>
          <Typography variant='body4' className='number'>
            {propertyDetails?.my_chosen_matches || 0}
          </Typography>
        </div>
      </div>
      <div className='hr-line'></div>
      <div className='avatars-buttons'>
        <div className='potential-matches-list'>
          {propertyDetails?.tenants?.slice(0, 3).map((item: any, index) => (
            <Avatar image={avatars[parseInt(item.avatar)].image} key={index} />
          ))}
          {propertyDetails?.tenants && propertyDetails?.tenants?.length > 3 && (
            <div className='others-number'>
              <Typography variant='body4'>+49</Typography>
            </div>
          )}
        </div>
        <div className='buttons'>
          <Button active={true} inverted size='large' onClick={() => navigate('/matches')}>
            View matches
          </Button>
        </div>
      </div>
    </div>
  );
};

const TenantSectionMatches = ({
  property,
  propertyDetails,
  setCriteriaModalVisibility
}: {
  property: IProperty;
  propertyDetails: TPropertyDetails;
  setCriteriaModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const criteria = useCriteriaStore();
  return (
    <div className='current-search-wrapper'>
      <div className='current-search'>
        <div className='match'>
          <Typography variant='body5' className='title'>
            Current search
          </Typography>
          <Typography variant='body4' className='bold'>
            Matching with <span className='matching-with'>Properties from {criteria.areaOfInterest}</span>
          </Typography>
        </div>
        <div className='matches'>
          <Typography variant='body5' className='title'>
            Matches
          </Typography>
          <Typography variant='body4' className='number'>
            {propertyDetails?.my_chosen_matches || 0}
          </Typography>
        </div>
      </div>
      <div className='hr-line'></div>
      <div className='avatars-buttons'>
        <div className='potential-matches-list'>
          {propertyDetails?.tenants?.slice(0, 3).map((item: any, index: number) => (
            <Avatar image={avatars[parseInt(item.avatar)].image} key={index} />
          ))}
          {propertyDetails?.tenants && propertyDetails?.tenants?.length > 3 && (
            <div className='others-number'>
              <Typography variant='body4'>+49</Typography>
            </div>
          )}
        </div>
        <div className='buttons'>
          <Button active={true} inverted size='large' onClick={() => navigate('/matches')}>
            View matches
          </Button>
          <Button active={false} inverted size='large' onClick={() => setCriteriaModalVisibility(true)}>
            Refine search
          </Button>
        </div>
      </div>
    </div>
  );
};
