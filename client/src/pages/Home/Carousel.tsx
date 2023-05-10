import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { motion } from 'framer-motion';

export const Carousel = styled(({ children, className }: HTMLAttributes<HTMLDivElement>) => {
  const [index, setIndex] = React.useState(0);

  const childrenArray = Array.isArray(children) ? children : [children];

  const handlePrevClick = () => {
    setIndex(index === 0 ? childrenArray.length - 1 : index - 1);
  };

  const handleNextClick = () => {
    setIndex(index === childrenArray.length - 1 ? 0 : index + 1);
  };

  return (
    <div className={`slider ${className}`}>
      <IconButton
        className='arrow-button'
        style={{ zIndex: 1, position: 'absolute', left: 0 }}
        noBackground
        onClick={handlePrevClick}>
        <Icon icon='arrow-left' />
      </IconButton>

      <div className='slides-wrapper'>
        {childrenArray.map((child: any, i: number) => (
          <motion.div
            className='slide-item'
            key={i}
            style={{
              x: `${100 * (i - index)}%`
            }}
            animate={{ x: `${-100 * index}%` }}
            transition={{ ease: 'easeOut', duration: 0.5 }}>
            {child}
          </motion.div>
        ))}
      </div>

      <div className='dots-wrapper'>
        {childrenArray.map((child: any, i: number) => (
          <div className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} />
        ))}
      </div>

      <IconButton
        className='arrow-button'
        style={{ zIndex: 1, position: 'absolute', right: '0' }}
        noBackground
        onClick={handleNextClick}>
        <Icon icon='arrow-right' />
      </IconButton>
    </div>
  );
})`
  &.slider {
    position: relative;
    width: 100%;

    display: grid;
    justify-items: center;
    row-gap: 24px;

    .arrow-button {
      top: 50%;
      transform: translateY(-50%);
    }
    .dots-wrapper {
      display: flex;
      column-gap: 4px;

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background-color: #f3f4f5;
        cursor: pointer;

        :hover {
          background-color: #e7e7e7;
        }

        &.active {
          width: 32px;
          background-color: #e7e7e7;
        }
      }
    }

    .slides-wrapper {
      display: flex;
      width: 100%;
      overflow: hidden;

      .slide-item {
        flex-shrink: 0;
        width: 100%;
      }
    }
  }
`;
