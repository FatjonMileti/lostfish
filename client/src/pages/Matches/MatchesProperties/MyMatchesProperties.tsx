import { styled } from '@mui/system';
import { Header } from '../../HomeLoggedIn/Header';
import classNames from 'classnames';

import { Backdrop } from '../../../components/Backdrop';
import React, { HTMLAttributes } from 'react';

import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';

import { Footer } from '../../Home/Footer';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../../components/Typography';
import { Icon } from '../../../components/Icon';
import { Label } from '../../../components/Label';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';

import { SuggestedPropertyType } from './MatchesProperties';
import { ViewProperty } from './ViewProperty';
import { useSuggestedProperties } from '../../Suggestions/SuggestionsProperties/useSuggestedProperties';
import { PropertyCard } from '../../../components/PropertyCard';
import { useMatchedProperties } from './useMatchedProperties';

interface MyMatchesProperties extends HTMLAttributes<HTMLDivElement> {}

export const MyMatchesProperties = styled(({ className }: MyMatchesProperties) => {
  const [propertyToView, setPropertyToView] = React.useState<SuggestedPropertyType | null>(null);
  const navigate = useNavigate();
  const userStore = useUserStore();

  const suggestedProperties = useMatchedProperties({ chosen: true });

  const chatWith = ({ userId, propertyId }: { userId: string; propertyId: string }) => {
    try {
      navigate(`/messages?userId=${userId}`, { state: { propertyId } });
    } catch (err) {}
  };

  const likeProperty = async ({ propertyId }: { propertyId: string }) => {
    try {
      await axios(userStore.auth.access_token).post('/api/match/properties', {
        property: propertyId
      });

      if (propertyToView) {
        setPropertyToView(null);
      }

      await suggestedProperties.reFetch();
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <Backdrop open={suggestedProperties.loading}></Backdrop>
      <div className={classNames('my-matches-properties', className)}>
        <div className='header-and-content-wrapper'>
          <Header />
          <div className='content-wrapper'>
            <div className='content-header'>
              <div className='header-left-content'>
                <Typography>My matches</Typography>
                <Typography variant='body5'>
                  Here you can find all your matches as well as people/locations you are already matched with.
                </Typography>
              </div>

              <Label variant='secondary' className='filters-button'>
                <Icon icon='filter' />
                Filter matches
              </Label>
            </div>

            <div className='content'>
              {suggestedProperties.properties.map((suggestion, suggestionIndex) => {
                const { property } = suggestion;

                console.log('suggestion: ', suggestion);

                return (
                  <PropertyCard
                    key={suggestionIndex}
                    name={`${property.created_by?.first_name} ${property.created_by?.last_name}`}
                    avatar={getAvatarFormIndex(property.created_by?.avatar)}
                    inView={true}
                    // matched={}
                    percentage={property.percentage}
                    onViewPropertyClick={() => setPropertyToView(suggestion)}
                    image={`${property?.property_images?.[0]?.link || ''}`}
                    size='large'
                    property={property}
                    awaitingMatch={suggestion.chosen}
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
          likeProperty={() => {
            likeProperty({
              propertyId: propertyToView.property._id
            });
          }}
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
          min-height: calc(100vh - 112px);
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
