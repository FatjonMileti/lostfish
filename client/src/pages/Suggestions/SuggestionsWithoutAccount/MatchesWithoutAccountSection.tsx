import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';

import { Typography } from '../../../components/Typography';
import { Avatar } from '../../../components/Avatar';
import { Button } from '../../../components/Button';
import TenantImg from '../../About/tenant_img.png';
import HomeImg from '../../About/89.png';

import backgroundImg from '../../About/forest.jpeg';
import { useSuggestedPropertiesWithoutAccount } from './useSuggestedPropertiesWithoutAccount';
import { motion } from 'framer-motion';
import { PropertyCard } from '../../../components/PropertyCard';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';

interface MatchesWithoutAccountSectionProps extends HTMLAttributes<HTMLDivElement> {}

export const MatchesWithoutAccountSection = styled(({ className }: MatchesWithoutAccountSectionProps) => {
  const suggestedProperties = useSuggestedPropertiesWithoutAccount();

  return (
    <div className={classNames('matches-without-account-section', className)}>
      <motion.div className='slides-wrapper'>
        {suggestedProperties.data.map((propertySuggestion, tenantIndex) => {
          const { property } = propertySuggestion;

          return (
            <PropertyCard
              key={tenantIndex}
              animate={{
                x: `calc(${-100 * activeSlide}% - ${activeSlide * 24}px)`
              }}
              transition={{ duration: 0.4 }}
              name={`${property.created_by?.first_name} ${property.created_by?.last_name}`}
              avatar={getAvatarFormIndex(property.created_by?.avatar)}
              inView={tenantIndex === activeSlide}
              percentage={property.percentage}
              onViewPropertyClick={() => setPropertyToView(suggestedProperty)}
              image={`${property?.property_images?.[0]?.link || ''}`}
              size='large'
              property={property}
            />
          );
        })}
      </motion.div>
    </div>
  );
})`
  &.matches-without-account-section {
    position: relative;
    min-height: calc(100vh - 112px);
    display: grid;
    padding: 176px 36px 64px 36px;
    justify-content: center;
    align-content: space-between;
    box-sizing: border-box;
    row-gap: 32px;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 251, 243, 0.9) 20%, rgba(255, 255, 255, 0.9) 100%)
        no-repeat;
      z-index: -1;
      top: -112px;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url(${backgroundImg});
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.4;
      z-index: -2;
      top: -112px;
    }

    .section-content {
      display: grid;
      align-items: center;
      justify-content: center;
      gap: 48px;

      .welcome {
        width: 904px;
        display: grid;
        align-items: center;
        gap: 24px;

        .perfect-match {
          text-align: center;
          font-size: 56px;
          font-weight: 400;
          line-height: 64px;

          .perfect-match-red {
            color: #e5155a;
          }
        }

        .texts {
          text-align: center;
          font-weight: 400;
        }
      }

      .refine-search {
        width: max-content;
        display: flex;
        padding: 12px;
        box-sizing: border-box;
        align-items: center;
        margin: 0 auto;
        gap: 24px;
        background-color: #fff;
        border-radius: 25000px;
        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.05);

        .match-intersection {
          display: flex;

          .thumbnail {
            border-radius: 50%;
            height: 64px;
            width: 64px;
          }

          .left-side {
            position: relative;
            margin-right: -16px;
            overflow: hidden;
            :after {
              background-color: #ffffff;
              clip-path: circle(50%);
              width: 100%;
              height: 100%;
              content: '';
              position: absolute;
              left: calc(100% - 16px);
            }
          }

          .right-side {
            background-image: url(${HomeImg});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
        }

        .start-matching {
          background-color: #e5155a;
          border: 1px solid #b4263b;
        }
      }
    }
  }
`;
