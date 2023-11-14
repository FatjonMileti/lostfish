import { styled } from '@mui/system';
import { Header } from '../../HomeLoggedIn/Header';
import classNames from 'classnames';
import { useMutation } from '@tanstack/react-query';

import { ShowGlobalLoading } from '../../../components/ShowGlobalLoading';
import React, { HTMLAttributes } from 'react';

import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';

import { Footer } from '../../Home/Footer';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';

import { ViewProperty } from './ViewProperty';
import { PropertyCard } from '../../../components/PropertyCard';
import { useMatchedProperties } from './useMatchedProperties';
import { useMatchesCount } from '../useMatchesCount';
import { PropertiesReviewHeader } from './PropertiesReviewHeader';
import { useSuggestedProperties } from '../../Suggestions/SuggestionsProperties/useSuggestedProperties';
import { SuggestedPropertyType } from '../matches.type';
import { CloseButton } from '../../../components/CloseButton';
import { Radio } from '../../../components/Radio';
import { Select } from '../../../components/Select/Select';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';

interface MyMatchesProperties extends HTMLAttributes<HTMLDivElement> {}

export const MyMatchesProperties = styled(({ className }: MyMatchesProperties) => {
  const [propertyToView, setPropertyToView] = React.useState<SuggestedPropertyType | null>(null);
  const [filterMatchesModal, setFilterMatchesModal] = React.useState(false);
  const [filter, setFilter] = React.useState({
    withOffers: false,
    matchRate: 20
  });
  const navigate = useNavigate();
  const userStore = useUserStore();

  const matchedProperties = useMatchedProperties({
    params: { chosen: true, matchRate: filter.matchRate },
    options: {
      refetchOnMount: true
    }
  });
  const suggestedProperties = useSuggestedProperties({ params: { disliked: false, chosen: false } });

  const matchesCount = useMatchesCount({
    params: { chosen: true, disliked: false }
  });

  const chatWith = ({ userId, propertyId }: { userId: string; propertyId: string }) => {
    try {
      navigate(`/messages?userId=${userId}`, { state: { propertyId } });
    } catch (err) {}
  };

  const dislikeProperty = useMutation({
    mutationFn: ({ matchId }: { matchId: string }) => {
      return axios(userStore.auth.access_token).delete(`/api/match/${matchId}`);
    },
    onSuccess: () => {
      if (propertyToView) {
        setPropertyToView(null);
      }
      matchedProperties.refetch();
      matchesCount.refetch();
      suggestedProperties.refetch();
    }
  });

  const onCloseFilterModal = () => {
    setFilterMatchesModal(false);
  };

  return (
    <>
      {(matchedProperties.isFetching || dislikeProperty.isLoading) && <ShowGlobalLoading />}
      <div className={classNames('my-matches-properties', className)}>
        <FilterMatchesModal disableScrollLock open={filterMatchesModal} onBackdropClick={onCloseFilterModal}>
          <div className='modal-header'>
            <Typography variant='body2'>Filter your matches</Typography>
            <CloseButton onClick={onCloseFilterModal} />
          </div>
          <div className='modal-body'>
            <div className='matches-with-offers'>
              <Typography variant='body4' className='show-only-matches-with-offers'>
                Show only matches with offers
              </Typography>
              <Radio />
            </div>
            <Select
              label='Match rate:'
              className='match-rate'
              onChange={(e) => {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  matchRate: Number(e.target.value)
                }));
              }}>
              {[20, 30, 40, 50, 60, 70, 80, 90].map((value) => (
                <option key={value} value={value} selected={filter.matchRate === value}>
                  {`${value}% and above`}
                </option>
              ))}
            </Select>
            <div className='actions'>
              <Button
                size='large'
                variant='secondary'
                onClick={() =>
                  setFilter((prevFilter) => ({
                    ...prevFilter,
                    matchRate: 20
                  }))
                }>
                Reset filters
              </Button>
              <Button
                size='large'
                onClick={() => {
                  matchedProperties.refetch(), onCloseFilterModal();
                }}>
                Set filters
              </Button>
            </div>
          </div>
        </FilterMatchesModal>
        <div className='header-and-content-wrapper'>
          <Header
            middleContent={
              <>
                <PropertiesReviewHeader />
              </>
            }
          />
          <div className='content-wrapper'>
            <div className='content-header'>
              <div className='header-left-content'>
                <Typography>My matches</Typography>
                <Typography variant='body5'>
                  Here you can find all your matches as well as people/locations you are already matched with.
                </Typography>
              </div>

              <Label
                variant='secondary'
                className='filters-button'
                onClick={() => setFilterMatchesModal(true)}>
                <Icon icon='filter' />
                Filter matches
              </Label>
            </div>

            <div className='content'>
              {matchedProperties.data.map((suggestion, suggestionIndex) => {
                const { property } = suggestion;

                return (
                  <PropertyCard
                    key={suggestionIndex}
                    name={`${property.created_by?.first_name} ${property.created_by?.last_name}`}
                    avatar={getAvatarFormIndex(property.created_by?.avatar)}
                    inView={true}
                    matched={suggestion.matched}
                    percentage={property.percentage}
                    onViewPropertyClick={() => setPropertyToView(suggestion)}
                    image={`${property?.property_images?.[0]?.link || ''}`}
                    size='large'
                    property={property}
                    awaitingMatch={suggestion.chosen && !suggestion.matched}
                    chatWith={() => {
                      chatWith({
                        userId: suggestion.property.created_by._id,
                        propertyId: suggestion.property._id
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {propertyToView && (
        <ViewProperty
          open={true}
          starProperty={() => {}}
          closeModal={() => setPropertyToView(null)}
          onBackdropClick={() => setPropertyToView(null)}
          propertyToView={propertyToView}
          disableLikeProperty
          dislikeProperty={() => dislikeProperty.mutate({ matchId: propertyToView?.matchId || '' })}
        />
      )}
    </>
  );
})`
  &.my-matches-properties {
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto min-content;
    width: 100%;

    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%);

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;
      box-sizing: border-box;

      .content-wrapper {
        padding: 36px;
        display: grid;
        grid-template-rows: min-content auto;
        row-gap: 48px;
        box-sizing: border-box;

        .content-header {
          display: flex;
          justify-content: space-between;
          column-gap: 24px;
          align-items: center;
          box-sizing: border-box;

          .header-left-content {
            display: grid;
            row-gap: 8px;
          }

          .filters-button {
            display: flex;
            column-gap: 8px;
            padding: 16px 20px;
            height: 56px;
          }
        }

        .content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          box-sizing: border-box;

          gap: 24px;
          justify-items: center;
          justify-self: center;
          align-content: flex-start;
        }
      }
    }
  }
`;
const FilterMatchesModal = styled(Modal)`
  & {
    .modal-container {
      padding: 0;
    }
    padding: 24px;
    max-width: 440px;
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      .close-button {
        width: 48px;
        height: 48px;
        padding: 12px;
      }
    }
    .modal-body {
      display: grid;
      padding-top: 16px;
      gap: 32px;
      .matches-with-offers {
        display: flex;
        padding: 24px;
        border: 1px solid #e7e7e7;
        border-radius: 8px;
        justify-content: space-between;
        align-items: center;
        gap: 16px;

        .show-only-matches-with-offers {
          font-weight: 700;
        }
        .radio-button {
          border: 2px solid #184d6d;
        }
      }
      .match-rate {
        label {
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
          color: #cfd5d5;
        }
        .input-wrapper {
          select {
            border: 1px solid #a7a7a7;
            font-size: 16px;
            line-height: 24px;
            font-weight: 700;
          }
        }
      }
      .actions {
        display: flex;
        column-gap: 16px;
        .button {
          width: 188px;
          padding: 20px 32px;
          flex-grow: 1;
        }
      }
    }
  }
`;
