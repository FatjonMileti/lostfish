import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { ArrowButton } from '../../../components/ArrowButton';
import { Icon } from '../../../components/Icon';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  indexStore?: [number, (i: number) => void];
  images: any[];
}

export const Carousel = styled(({ className, indexStore, images }: CarouselProps) => {
  const [index, setIndex] = indexStore || React.useState<number>(0);

  const handlePrevClick = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const handleNextClick = () => {
    setIndex(index === images.length - 1 ? 0 : index + 1);
  };

  return (
    <div className={`slider ${className}`}>
      <div className='slides-wrapper'>
        {images?.length === 0 && (
          <div className='no-images slide-item'>
            <Icon icon='image' size={128} />
          </div>
        )}
        {images.map((image: any, imageIndex: number) => (
          <motion.img
            src={image}
            className={`slide-item ${index < imageIndex ? 'next-item' : ''} ${
              index > imageIndex ? 'previous-item' : ''
            }`}
            key={imageIndex}
            animate={{ x: `${-100 * index}% ` }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
          />
        ))}
      </div>

      <div className='slider-footer'>
        {images.length >= 2 && (
          <ArrowButton
            hero
            direction='left'
            size='large'
            className='arrow-button previous-button'
            onClick={handlePrevClick}></ArrowButton>
        )}

        <div className='dots-wrapper'>
          {images.map((image: any, imageIndex: number) => (
            <motion.img
              key={imageIndex}
              src={image}
              className={`thumbnail dot ${imageIndex === index ? 'active' : ''}`}
              onClick={() => setIndex(imageIndex)}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 1 }}
            />
          ))}
        </div>
        {images.length >= 2 && (
          <ArrowButton
            hero
            direction='right'
            size='large'
            className='arrow-button next-button'
            onClick={handleNextClick}></ArrowButton>
        )}
      </div>
    </div>
  );
})`
  &.slider {
    position: relative;
    width: 100%;
    user-select: none;

    display: grid;
    justify-items: center;

    .slider-footer {
      display: flex;
      justify-content: space-between;
      column-gap: 24px;
      width: 100%;

      position: absolute;
      bottom: 0;

      padding: 32px;
      box-sizing: border-box;
      align-items: center;
      z-index: 1;

      background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 100%);

      .arrow-button {
        flex-shrink: 0;
        z-index: 1;
        .icon {
          color: white;
        }
        :hover {
          background-color: white;
          .icon {
            color: initial;
          }
        }
      }

      .dots-wrapper {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;

        .thumbnail {
          width: 92px;
          height: 61px;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0.7;
          box-sizing: border-box;

          &.active {
            border: 2px solid #f7f1e7;
            opacity: 1;
          }

          :hover {
            border: 2px solid #f7f1e7;
            opacity: 1;
            z-index: 1;
          }
        }
      }
    }

    .slides-wrapper {
      display: flex;
      width: 100%;
      overflow: hidden;
      position: relative;
      max-width: 100%;
      max-height: 640px;

      :before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .no-images {
        display: grid;
        align-items: center;
        justify-content: center;
        color: #a7a7a7;
        background-color: #8080800a;
      }

      .slide-item {
        flex-shrink: 0;
        width: 100%;
        aspect-ratio: 9 / 4;
        object-fit: contain;
      }
    }
  }
`;
