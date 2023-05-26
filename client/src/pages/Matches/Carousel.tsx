import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { motion } from 'framer-motion';

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
        <IconButton size='large' className='arrow-button previous-button' onClick={handlePrevClick}>
          <Icon icon='arrow-left' size={28} />
        </IconButton>

        {images.map((image: any, imageIndex: number) => (
          <motion.img
            src={image}
            className={`slide-item ${index < imageIndex ? 'next-item' : ''} ${
              index > imageIndex ? 'previous-item' : ''
            }`}
            key={imageIndex}
            animate={{ x: `calc(${-100 * index}% - ${index * 24}px + 27%)` }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
          />
        ))}

        <IconButton size='large' className='arrow-button next-button' onClick={handleNextClick}>
          <Icon icon='arrow-right' size={28} />
        </IconButton>
      </div>

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
    </div>
  );
})`
  &.slider {
    position: relative;
    width: 100%;
    user-select: none;

    display: grid;
    justify-items: center;
    padding-top: 53px;
    padding-bottom: 37px;

    .arrow-button {
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      z-index: 1;
      background-color: white;
      padding: 22px;
      > .icon {
        color: #184d6d;
      }

      &.next-button {
        right: 10px;
      }

      &.previous-button {
        left: 10px;
      }
    }
    .dots-wrapper {
      display: flex;
      gap: 8px;
      margin-top: 51px;
      flex-wrap: wrap;
      justify-content: center;

      .thumbnail {
        width: 96px;
        height: 61px;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0.7;
        box-sizing: border-box;

        &.active {
          border: 2px solid #184d6d;
          opacity: 1;
        }

        :hover {
          border: 2px solid #184d6d;
          opacity: 1;
          z-index: 1;
        }
      }
    }

    .slides-wrapper {
      display: flex;
      width: 100%;
      overflow: hidden;
      column-gap: 24px;
      position: relative;
      max-width: 1440px;
      max-height: 602px;

      .slide-item {
        flex-shrink: 0;
        width: 65%;

        aspect-ratio: 3 / 2;

        &.next-item {
          mask: linear-gradient(270deg, rgba(255, 255, 255, 0) 75%, #ffffff 100%);
        }

        &.previous-item {
          mask: linear-gradient(90deg, rgba(255, 255, 255, 0) 75%, #ffffff 100%);
        }
      }
    }
  }
`;
