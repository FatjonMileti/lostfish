import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../components/Typography';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { ArrowButton } from '../../components/ArrowButton';

import propertyImage1 from './images/gallery-1.png';
import propertyImage2 from './images/gallery-2.png';

const properties = [{ images: [propertyImage1] }, { images: [propertyImage2] }];

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
          <div className='trust-score'>
            <Typography variant='body5' className='your-trust-score-text'>
              Your trust score
            </Typography>
            <Typography variant='body3'>Improve your trust score and find better matches </Typography>
            <Typography variant='body4'>
              Go through the steps below to improve your trust score. Remember that you can’t close a certain
              deal without maximum trust score.
            </Typography>
          </div>
          <div className='slides-wrapper'>
            {properties.map(({ images }) => {
              return (
                <MatchedSlide
                  image={images[0]}
                  animate={{ x: `${-100 * activeSlide}%` }}
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

        .trust-score {
          .your-trust-score-text {
            line-height: 16px;
            color: #a7a7a7;
          }
        }

        .slides-wrapper {
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
}

const MatchedSlide = styled(({ className, ...rest }: MatchedSlideProps) => {
  return <motion.div className={`match-property-slide ${className}`} {...rest}></motion.div>;
})`
  &.match-property-slide {
    width: 672px;
    height: 452px;
    flex-shrink: 0;

    border-radius: 12px;
    background-image: url('${(props) => props.image}');
  }
`;
