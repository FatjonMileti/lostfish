import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../components/Typography';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { ArrowButton } from '../../components/ArrowButton';

import propertyImage1 from './images/gallery1.png';
import propertyImage2 from './images/gallery2.png';
import propertyImage3 from './images/gallery3.png';
import propertyImage4 from './images/gallery-4.png';

import { avatars } from '../HomeLoggedIn/avatars';

import { Label } from '../../components/Label';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';

const properties = [
  { images: [propertyImage1], avatar: avatars[0].image },
  { images: [propertyImage2], avatar: avatars[1].image },
  { images: [propertyImage3], avatar: avatars[2].image },
  { images: [propertyImage4], avatar: avatars[3].image }
];

interface MatchesPropertiesProps extends HTMLAttributes<HTMLDivElement> {}
export const MatchesProperties = styled(({ className }: MatchesPropertiesProps) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0);

  const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % properties?.length));
  const previous = () => setActiveSlide((activeSlide) => Math.abs((activeSlide - 1) % properties?.length));

  return (
    <div className={`${className}`}>
      <div>
        <Typography>
          Matching with <span className='matching-with'>buyers in Bristol +</span>
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

            <Label variant='tertiary' size='medium' className='improve-link'>
              Improve trust score
              <Icon icon='arrow-right-1' size={16} />
            </Label>
          </div>
          <div className='slides-wrapper'>
            {properties.map(({ images, avatar }, propertyIndex) => {
              return (
                <MatchedSlide
                  key={propertyIndex}
                  className={`${propertyIndex === activeSlide ? 'active' : ''}`}
                  image={images[0]}
                  avatar={avatar}
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
                />
              );
            })}
          </div>
        </div>
        <div className='matches-slider-footer'>
          <ArrowButton direction='left' hero onClick={previous} />
          <div className='match-actions'>
            <IconButton>
              <Icon icon='close' />
            </IconButton>

            <IconButton size='large' inverted>
              <Icon icon='checked' />
            </IconButton>

            <IconButton>
              <Icon icon='star-solid' />
            </IconButton>
          </div>
          <ArrowButton direction='right' hero onClick={next} />
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

        column-gap: 84px;
        .match-actions {
          display: flex;
          column-gap: 24px;
          align-items: center;
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
}

const MatchedSlide = styled(({ className, image, avatar, ...rest }: MatchedSlideProps) => {
  return (
    <motion.div className={`match-property-slide ${className}`} {...rest}>
      <div className='slide-header'>
        <Avatar image={avatar} />
        <Typography variant='body4'>Nancy Jones • 34%</Typography>
      </div>
      <div className='slide-footer'>
        <div className='left-part'>
          <Typography className='property-name'>Two bedroom apartment for rent</Typography>
          <div className='property-details'>
            <div className='detail'>
              <Icon icon='location' />
              <Typography variant='body5'>Bristol, UK</Typography>
            </div>
            •
            <div className='detail'>
              <Icon icon='banknote' />
              <Typography variant='body5'>£1,150 PCM</Typography>
            </div>
            •
            <div className='detail'>
              <Icon icon='double-bed' />
              <Typography variant='body5'>2</Typography>
            </div>
            •
            <div className='detail'>
              <Icon icon='bathtub' />
              <Typography variant='body5'>1</Typography>
            </div>
          </div>
        </div>
        <Label variant='secondary' inverted>
          View property
        </Label>
      </div>
    </motion.div>
  );
})`
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
