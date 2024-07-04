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

import { Modal } from '../components/Modal';
import { Checkbox } from '../components/Checkbox';
import { TextField } from '../components/TextField';

import { LoadingMatch } from '../components/LoadingMatch';

import { Tabs, Tab } from '../components/Tab';
import { ArrowButton } from '../components/ArrowButton';
import { Label } from '../components/Label';
import { Avatar } from '../components/Avatar';
import { avatars } from './HomeLoggedIn/avatars';
import { CloseButton } from '../components/CloseButton';
import { SocialAccountButton } from '../components/SocialAccountButton';
import { MatchButton } from '../components/MatchButton';
import { UnMatchButton } from '../components/UnMatchButton';

export const PreviewComponents = styled(({ className }: React.HTMLProps<any>) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={`preview-components ${className}`}>
      <LoadingMatch />
      <div className='grouped'>
        <div>
          <div>
            {'<MatchButton />'}
            <MatchButton />
          </div>
          <div>
            {"<MatchButton size='large'/>"}
            <MatchButton size='large' />
          </div>

          <div>
            {'<UnMatchButton />'}
            <UnMatchButton />
          </div>
          <div>
            {"<UnMatchButton size='large'/>"}
            <UnMatchButton size='large' />
          </div>
        </div>
        <div>
          <Typography variant='body5'>{"<SocialAccountButton icon='twitter'/> "}</Typography>
          <SocialAccountButton icon='twitter' />
        </div>
        <div className='close-buttons'>
          <Typography variant='body5'>{'<CloseButton />'}</Typography>
          <div className='content-wrapper'>
            <div>
              <CloseButton size='large' inverted={false} background={true} />
              <ul>
                <li>size: large</li>
                <li> inverted: false</li>
                <li>background: true</li>
              </ul>
            </div>
            <div>
              <CloseButton size='large' inverted={false} background={false} />
              <ul>
                <li>size: large</li>
                <li>inverted: false</li>
                <li>background: false</li>
              </ul>
            </div>
            <div>
              <CloseButton size='large' inverted={true} background={true} />
              <ul>
                <li>size: large</li>
                <li>inverted: true</li>
                <li>background: true</li>
              </ul>
            </div>

            <div>
              <CloseButton size='small' inverted={false} background={true} />
              <ul>
                <li>size: small</li>
                <li> inverted: false</li>
                <li>background: true</li>
              </ul>
            </div>
            <div>
              <CloseButton size='small' inverted={false} background={false} />
              <ul>
                <li>size: small</li>
                <li>inverted: false</li>
                <li>background: false</li>
              </ul>
            </div>
            <div>
              <CloseButton size='small' inverted={true} background={true} />
              <ul>
                <li>size: small</li>
                <li>inverted: true</li>
                <li>background: true</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <Typography variant='body5'>{'<Avatar image={avatar.png} />'}</Typography>
          <Avatar image={avatars[0].image} />
          <Avatar image={avatars[1].image} style={{ width: '100px', height: '100px' }} />
        </div>
        <div>
          <Label variant='primary' size='large' special>
            Label
          </Label>

          <Label variant='primary' size='large' special disabled>
            Label
          </Label>

          <Label>Label</Label>

          <Label active>Label</Label>
          <Label variant='tertiary'>tertiary</Label>
          <Label variant='tertiary' size='small'>
            tertiary small
          </Label>

          <Label size='medium' variant='primary'>
            medium primary
          </Label>

          <Label size='medium' variant='secondary'>
            medium secondary
          </Label>

          <Label inverted size='medium' variant='secondary'>
            medium secondary inverted
          </Label>
          <Label variant='primary' size='medium' disabled>
            medium primary disabled
          </Label>
        </div>
        <div>
          <ArrowButton />
          <ArrowButton direction='right' />
          <ArrowButton inverted />
          <ArrowButton hero />
          <ArrowButton size='large' />
          <ArrowButton size='small' />
        </div>
        <div>
          <Tabs value={activeTab} onChange={(i: number) => setActiveTab(i)}>
            <Tab label='Include' />
            <Tab label='Exclude' />
          </Tabs>

          <Tabs value={activeTab} onChange={(i: number) => setActiveTab(i)} variant='secondary'>
            <Tab label='Include' />
            <Tab label='Exclude' />
          </Tabs>

          <Tabs rounded value={activeTab} onChange={(i: number) => setActiveTab(i)}>
            <Tab label='Include' />
            <Tab label='Exclude' />
          </Tabs>

          <Tabs variant='tertiary' rounded value={activeTab} onChange={(i: number) => setActiveTab(i)}>
            <Tab label='Include' />
            <Tab label='Exclude' />
          </Tabs>
        </div>
        <div className='match-ctas'>
          <Typography>Match CTAs</Typography>

          <Button variant='primary' size='large' startIcon={<Icon icon='checked' size={14} />}>
            Match
          </Button>

          <Button variant='primary' inverted size='large' startIcon={<Icon icon='checked' size={14} />}>
            Match
          </Button>

          <Button variant='secondary' size='large' startIcon={<Icon icon='checked' size={14} />}>
            Match
          </Button>

          <Button variant='secondary' inverted size='large' startIcon={<Icon icon='checked' size={14} />}>
            Match
          </Button>
        </div>

        <div className='toggles'>
          <Typography>Switch</Typography>
          <Switch size='small' />
          <Switch defaultChecked size='small' />
          <Switch size='medium' />
          <Switch defaultChecked size='medium' />
        </div>

        <div className='checkboxes'>
          <Typography>Checkbox</Typography>
          <Checkbox />
          <Checkbox checked />
        </div>

        <div className='typoraphys'>
          <Typography>Typography</Typography>
          <Typography variant='h1'> h1 64/72</Typography>
          <Typography variant='h2'> h2 56/64</Typography>
          <Typography variant='h3'> h3 48/56</Typography>
          <Typography variant='body1'> body1 40/46</Typography>
          <Typography variant='body2'> body2 32/40</Typography>
          <Typography variant='body3'> body3 24/32</Typography>
          <Typography variant='body4'> body4 16/24</Typography>
          <Typography variant='body5'> body5 14/20</Typography>
          <Typography variant='body6'> body6 12/16</Typography>
          <Typography variant='menu'> menu 16/20</Typography>
        </div>

        <div className='typoraphys'>
          <Typography>Link</Typography>
          <Link>Link</Link>
          <Link size='medium'>Link medium</Link>
        </div>

        <div className='fields'>
          <Typography>Input</Typography>
          <TextField placeholder='Enter your email address' />
          <TextField value='john.doe@los' />
          <TextField value='john.doe@los' error />
          <TextField placeholder='Enter your password' type='password' />
          <TextField
            type='password'
            value='12345678'
            endAdornment={<IconButton noBackground>{<Icon icon='eye' />}</IconButton>}
          />
          <TextField
            type='text'
            value='12345678'
            endAdornment={<IconButton noBackground>{<Icon icon='eye-invisible' />}</IconButton>}
          />
          <TextField
            error
            type='password'
            value='12345678'
            endAdornment={<IconButton noBackground>{<Icon icon='eye' />}</IconButton>}
          />
          <TextField placeholder='Enter your first name' label='First Name' required />
          <TextField
            placeholder='Enter your first name'
            label='First Name'
            required
            error
            value='john.doe@lostfish.com'
            helperText='The email is already used'
          />

          <TextField
            value='07700 900000'
            startAdornment={
              <span style={{ marginLeft: '12px', fontSize: '14px', lineHeight: '24px' }}>+44</span>
            }
          />
          <TextField
            required
            label={
              <>
                <Icon icon='ruler' /> Ruler
              </>
            }
          />
        </div>

        <div className='icon-buttons'>
          <Typography>Icon buttons</Typography>

          <IconButton size='large'>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='large' inverted>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='large' noBackground>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='large' noBackground inverted>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='small'>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='small' inverted>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='small' noBackground>
            <Icon icon='close' size={12} />
          </IconButton>

          <IconButton size='small' noBackground inverted>
            <Icon icon='close' size={12} />
          </IconButton>
        </div>

        <div className='icons-list'>
          {iconList(iconSet).map((icon: any) => (
            <div className='icon-item'>
              <Icon icon={icon} size={20} color='black' />
              <p>{icon}</p>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => setShowModal(true)}>Show modal</Button>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <p>lalalaa</p>
        <Button variant='primary' inverted onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal>
      <Logo />

      <Link>Link Name</Link>

      <Button onClick={() => navigate('/')}>Button Go Home</Button>

      <div className='buttons'>
        <Button size='large' variant='primary'>
          Primary Large
        </Button>
        <Button size='medium' variant='primary'>
          Primary Medium
        </Button>

        <Button size='small' variant='primary'>
          Primary Small
        </Button>

        <Button size='large' variant='primary' inverted>
          Primary Large Inverted
        </Button>

        <Button size='medium' variant='primary' inverted>
          Primary Medium Inverted
        </Button>

        <Button size='small' variant='primary' inverted>
          Primary Small Inverted
        </Button>

        <Button size='large' variant='secondary'>
          Secondary Large
        </Button>
        <Button size='medium' variant='secondary'>
          Secondary Medium
        </Button>
        <Button size='small' variant='secondary'>
          Secondary Small
        </Button>

        <Button size='large' variant='secondary' inverted>
          Secondary Large Inverted
        </Button>

        <Button size='medium' variant='secondary' inverted>
          Secondary Medium Inverted
        </Button>

        <Button size='small' variant='secondary' inverted>
          Secondary Small Inverted
        </Button>
      </div>
    </div>
  );
})`
  &.preview-components {
    background-color: #e3e3e3;
    padding: 64px;
    row-gap: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .match-ctas,
    .toggles,
    .checkboxes,
    .fields,
    .typoraphys,
    .icon-buttons {
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      border: 1px dashed black;
      padding: 16px;
      align-items: flex-start;
    }

    .grouped {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }

    .close-buttons {
      .content-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }

    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 32px;
    }

    .icons-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;

      border: 1px dashed black;
      padding: 16px;

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
`;
