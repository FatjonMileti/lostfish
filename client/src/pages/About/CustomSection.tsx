import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';

type CustomSectionProps = {
    title: string;
    description: string;
};

type CustomSectionHTMLProps = React.HTMLProps<HTMLDivElement> & CustomSectionProps;
export const CustomSection = styled (({className, title, description, ...rest}: CustomSectionHTMLProps) => {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    const toggleDescription = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (
        <div className={`section-wrapper ${className}`}>
            <div className='title-button'>
                <Typography variant='body3' className='title'>
                    {title}
                </Typography>
                <IconButton size='small' onClick={toggleDescription}>
                    <Icon icon={isDescriptionVisible ? 'minus' : 'plus'} size={20} />
                </IconButton>
            </div>
            {isDescriptionVisible && (
                <Typography variant='body4' className='text'>
                    {description}
                </Typography>
            )}
        </div>
    )
})`
&.section-wrapper {
        display: grid;
        padding: 16px 0px;
        align-items: flex-start;
        gap: 24px;
        border-bottom: 1px solid #E7E7E7;

        .title-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          

          .title {
            font-weight: 700;
            line-height: 32px;
          }
        }

        .text {
          line-height: 24px;
        }
      }
`