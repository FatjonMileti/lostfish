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

        <div className='cta-labels'>
          <Typography>CTA Labels</Typography>

          {/* Primary Variants */}
          <Label variant='primary' size='large'>
            <Icon icon='chevron-down' />
            Label Primary Large
          </Label>
          <Label variant='primary' size='medium'>
            <Icon icon='chevron-down' />
            Label Primary Medium
          </Label>
          <Label variant='primary' size='small'>
            <Icon icon='chevron-down' />
            Label Primary Small
          </Label>

          {/* Primary Variants Inverted*/}
          <Label variant='primary' size='large' inverted>
            <Icon icon='chevron-down' />
            Label Primary Large Inverted
          </Label>

          <Label variant='primary' size='medium' inverted>
            <Icon icon='chevron-down' />
            Label Primary Medium Inverted
          </Label>

          <Label variant='primary' size='small' inverted>
            <Icon icon='chevron-down' />
            Label Primary Small Inverted
          </Label>

          {/* Secondary Variants */}
          <Label variant='secondary' size='large'>
            <Icon icon='chevron-down' />
            Label Secondary Large
          </Label>

          <Label variant='secondary' size='medium'>
            <Icon icon='chevron-down' />
            Label Secondary Medium
          </Label>

          <Label variant='secondary' size='small'>
            <Icon icon='chevron-down' />
            Label Secondary Small
          </Label>

          {/* Secondary Variants Inverted*/}
          <Label variant='secondary' size='large' inverted>
            <Icon icon='chevron-down' />
            Label Secondary Large Inverted
          </Label>
          <Label variant='secondary' size='medium' inverted>
            <Icon icon='chevron-down' />
            Label Secondary Medium Inverted
          </Label>
          <Label variant='secondary' size='small' inverted>
            <Icon icon='chevron-down' />
            Label Secondary Small Inverted
          </Label>

          {/* Tertiary Variants */}
          <Label variant='tertiary' size='large'>
            <Icon icon='chevron-down' />
            Label Tertiary Large
          </Label>
          <Label variant='tertiary' size='medium'>
            <Icon icon='chevron-down' />
            Label Tertiary Medium
          </Label>
          <Label variant='tertiary' size='small'>
            <Icon icon='chevron-down' />
            Label Tertiary Small
          </Label>

          {/* Special Variants */}
          <Label variant='special' size='large'>
            <Icon icon='chevron-down' />
            Label Special Large
          </Label>

          <Label variant='special' size='medium'>
            <Icon icon='chevron-down' />
            Label Special Medium
          </Label>

          <Label variant='special' size='small'>
            <Icon icon='chevron-down' />
            Label Special Small
          </Label>

          {/**/}

          <Label variant='special' size='large' inverted>
            <Icon icon='chevron-down' />
            Label Special Large Inverted
          </Label>

          <Label variant='special' size='medium' inverted>
            <Icon icon='chevron-down' />
            Label Special Medium Inverted
          </Label>

          <Label variant='special' size='small' inverted>
            <Icon icon='chevron-down' />
            Label Special Small Inverted
          </Label>
          {/**/}

          <Label variant='primary' size='large' special>
            <Icon icon='chevron-down' />
            Label Primary Large Special
          </Label>
          <Label variant='primary' size='medium' special>
            <Icon icon='chevron-down' />
            Label Primary Medium Special
          </Label>
          <Label variant='primary' size='small' special>
            <Icon icon='chevron-down' />
            Label Primary Small Special
          </Label>
          <Label variant='secondary' size='large' special>
            <Icon icon='chevron-down' />
            Label Secondary Large Special
          </Label>
          <Label variant='secondary' size='medium' special>
            <Icon icon='chevron-down' />
            Label Secondary Medium Special
          </Label>
          <Label variant='secondary' size='small' special>
            <Icon icon='chevron-down' />
            Label Secondary Small Special
          </Label>
          <Label variant='tertiary' size='large' special>
            <Icon icon='chevron-down' />
            Label Tertiary Large Special
          </Label>
          <Label variant='tertiary' size='medium' special>
            <Icon icon='chevron-down' />
            Label Tertiary Medium Special
          </Label>
          <Label variant='tertiary' size='small' special>
            <Icon icon='chevron-down' />
            Label Tertiary Small Special
          </Label>

          {/* Inverted Variants */}
          <Label variant='primary' size='large' inverted>
            <Icon icon='chevron-down' />
            Label Primary Large Inverted
          </Label>
          <Label variant='primary' size='medium' inverted>
            <Icon icon='chevron-down' />
            Label Primary Medium Inverted
          </Label>
          <Label variant='primary' size='small' inverted>
            <Icon icon='chevron-down' />
            Label Primary Small Inverted
          </Label>
          <Label variant='secondary' size='large' inverted>
            <Icon icon='chevron-down' />
            Label Secondary Large Inverted
          </Label>
          <Label variant='secondary' size='medium' inverted>
            <Icon icon='chevron-down' />
            Label Secondary Medium Inverted
          </Label>
          <Label variant='secondary' size='small' inverted>
            <Icon icon='chevron-down' />
            Label Secondary Small Inverted
          </Label>
          <Label variant='tertiary' size='large' inverted>
            <Icon icon='chevron-down' />
            Label Tertiary Large Inverted
          </Label>
          <Label variant='tertiary' size='medium' inverted>
            <Icon icon='chevron-down' />
            Label Tertiary Medium Inverted
          </Label>
          <Label variant='tertiary' size='small' inverted>
            <Icon icon='chevron-down' />
            Label Tertiary Small Inverted
          </Label>

          {/* Disabled Variants */}
          <Label variant='primary' size='large' disabled>
            <Icon icon='chevron-down' />
            Label Primary Large Disabled
          </Label>
          <Label variant='primary' size='medium' disabled>
            <Icon icon='chevron-down' />
            Label Primary Medium Disabled
          </Label>
          <Label variant='primary' size='small' disabled>
            <Icon icon='chevron-down' />
            Label Primary Small Disabled
          </Label>
          <Label variant='secondary' size='large' disabled>
            <Icon icon='chevron-down' />
            Label Secondary Large Disabled
          </Label>
          <Label variant='secondary' size='medium' disabled>
            <Icon icon='chevron-down' />
            Label Secondary Medium Disabled
          </Label>
          <Label variant='secondary' size='small' disabled>
            <Icon icon='chevron-down' />
            Label Secondary Small Disabled
          </Label>
          <Label variant='tertiary' size='large' disabled>
            <Icon icon='chevron-down' />
            Label Tertiary Large Disabled
          </Label>
          <Label variant='tertiary' size='medium' disabled>
            <Icon icon='chevron-down' />
            Label Tertiary Medium Disabled
          </Label>
          <Label variant='tertiary' size='small' disabled>
            <Icon icon='chevron-down' />
            Label Tertiary Small Disabled
          </Label>
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
    .icon-buttons,
    .cta-labels {
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
