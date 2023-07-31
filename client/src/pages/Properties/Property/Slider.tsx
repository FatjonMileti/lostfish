import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Icon } from '../../../components/Icon';

interface SliderProps extends HTMLAttributes<HTMLDivElement> {
  images?: any[];
}
export const Slider = styled(({ className, images = [] }: SliderProps) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0);

  const next = () => setActiveSlide((activeSlide) => Math.abs((activeSlide + 1) % images?.length));
  const previous = () => setActiveSlide((activeSlide) => Math.abs((activeSlide - 1) % images?.length));

  return (
    <div className={`slider ${className}`}>
      <div className='slide-list'>
        {images.map((image, imageIndex) => {
          return (
            <Slide
              key={imageIndex}
              image={image?.link}
              className='image-holder'
              animate={{ x: `${-100 * activeSlide}%` }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
            />
          );
        })}
      </div>

      <div className='slider-footer'>
        <div className='arrow' onClick={previous}>
          <Icon icon='arrow-left-1' size={26} />
        </div>

        <div className='dots'>
          {images.map((_, imageIndex) => (
            <motion.div
              key={imageIndex}
              className={`dot ${activeSlide === imageIndex ? 'active' : ''}`}
              // animate={{ backgroundColor: i === index ? '32px' : '12px' }}

              onClick={() => setActiveSlide(imageIndex)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <div className='arrow' onClick={next}>
          <Icon icon='arrow-right-1' size={28} />
        </div>
      </div>
    </div>
  );
})`
  &.slider {
    position: relative;
    width: 100%;

    .slide-list {
      display: flex;
      overflow-x: hidden;
      width: 100%;
      aspect-ratio: 1.6/1;
      border-radius: 16px 0 0 16px;

      .image-holder {
        width: 100%;
        aspect-ratio: 1.6/1;
      }
    }

    .slider-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 16px 24px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      column-gap: 16px;
      align-items: center;

      .arrow {
        color: white;
        cursor: pointer;
        padding: 16px;
        user-select: none;
      }

      .dots {
        display: flex;
        column-gap: 4px;
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          background: var(--neutral-dark-grey, #646464);
          cursor: pointer;

          background-color: #646464;
          &.active {
            background-color: white;
          }
        }
      }
    }
  }
`;

interface SlideProps extends HTMLMotionProps<'div'> {
  image: string;
}
export const Slide = styled(({ className, ...rest }: SlideProps) => {
  return <motion.div className={`slide ${className}`} {...rest} />;
})`
  &.slide {
    background-image: url('${(props) => props.image}');
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
