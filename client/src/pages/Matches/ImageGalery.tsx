import React, { HTMLAttributes } from 'react';
import { styled } from '@mui/system';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Typography } from '../../components/Typography';
import { Carousel } from './Carousel';

import gallery1 from './images/gallery-1.png';
import gallery2 from './images/gallery-2.png';
import gallery3 from './images/gallery-3.png';
import gallery4 from './images/gallery-4.png';
import gallery5 from './images/gallery-5.png';
import gallery6 from './images/gallery-6.png';
import gallery7 from './images/gallery-7.png';
import gallery8 from './images/gallery-8.png';
import gallery9 from './images/gallery-9.png';
import gallery10 from './images/gallery-10.png';

const images = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10

  // 'https://picsum.photos/900/600?random=1',
  // 'https://picsum.photos/900/600?random=2',
  // 'https://picsum.photos/900/600?random=3',
  // 'https://picsum.photos/900/600?random=4'
  // 'https://picsum.photos/900/600?random=1',
  // 'https://picsum.photos/900/600?random=2',
  // 'https://picsum.photos/900/600?random=3',
  // 'https://picsum.photos/900/600?random=4'

  // add more images as needed
];

export const ImageGallery = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [modalVisibility, setModalVisibility] = React.useState<boolean>(false);
  const indexStore = React.useState(0);

  return (
    <>
      <Modal
        className={`gallery-modal ${className}`}
        open={modalVisibility}
        onBackdropClick={() => setModalVisibility(false)}>
        <div className='header'>
          <Typography variant='body2'>Image Gallery</Typography>
          <IconButton size='large' noBackground onClick={() => setModalVisibility(false)}>
            <Icon icon='close' size={12} />
          </IconButton>
        </div>
        <Carousel indexStore={indexStore} images={images}></Carousel>
      </Modal>
      <Button
        style={{ position: 'absolute', left: '110px', top: '26px' }}
        onClick={() => setModalVisibility(true)}>
        Open Gallery
      </Button>
    </>
  );
})`
  &.gallery-modal {
    width: 100vw;
    height: 100vh;

    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;

    .modal-container {
      display: grid;
      grid-template-rows: min-content auto;
      padding: 0;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
      }
    }
  }
`;
