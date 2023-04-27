import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import { Logo } from '../components/Logo';
import { Link } from '../components/Link';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { IconButton } from '../components/IconButton';

import { Icon } from '../components/Icon';

import { iconList } from 'react-icomoon';

import iconSet from '../assets/selection.json';
import React from 'react';

import { Switch } from '../components/Switch';

export const PreviewComponents = styled(({ className }: React.HTMLProps<any>) => {
  const navigate = useNavigate();

  console.log(iconList(iconSet));

  return (
    <div className={`preview-components ${className}`}>
      <Switch />
      <Logo />

      <Link>Link Name</Link>

      <Button onClick={() => navigate('/')}>Button Go Home</Button>

      <Button variant='contained' onClick={() => navigate('/')}>
        contained
      </Button>

      <Button variant='text' onClick={() => navigate('/')}>
        text
      </Button>

      <Button variant='outlined' onClick={() => navigate('/')}>
        outlined
      </Button>

      <Button size='small'>small</Button>
      <Button size='medium'>medium</Button>
      <Button size='large'>large</Button>

      <IconButton>
        <Icon icon='plus' />
      </IconButton>

      <Button variant='outlined' startIcon={<Icon icon='plus' size='20' />}>
        startIcon
      </Button>

      <Button variant='outlined' endIcon={<Icon icon='plus' size={20} />}>
        endIcon
      </Button>

      <Typography variant='h1'>Typography h1 64/72</Typography>
      <Typography variant='h2'>Typography h2 56/64</Typography>
      <Typography variant='h3'>Typography h3 48/56</Typography>
      <Typography variant='body1'>Typography body1 40/46</Typography>
      <Typography variant='body2'>Typography body2 32/40</Typography>
      <Typography variant='body3'>Typography body3 24/32</Typography>
      <Typography variant='body4'>Typography body4 16/24</Typography>
      <Typography variant='body5'>Typography body5 14/20</Typography>
      <Typography variant='menu'>Typography menu 16/20</Typography>

      <div className='icons-list'>
        {iconList(iconSet).map((icon) => (
          <div className='icon-item'>
            <Icon icon={icon} size={20} color='black' />
            <p>{icon}</p>
          </div>
        ))}
      </div>
    </div>
  );
})`
  &.preview-components {
    padding: 64px;
    row-gap: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .icons-list {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 24px;

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
`;
