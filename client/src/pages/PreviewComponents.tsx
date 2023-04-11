import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

import { Logo } from './Home/Logo';
import { Link } from './Home/Link';
import { Button } from './Home/Button';
import { Typography } from './Home/Typography';

export const PreviewComponents = styled(({ className }: React.HTMLProps<any>) => {
  const navigate = useNavigate();

  return (
    <div className={`preview-components ${className}`}>
      <Logo />

      <Link>Link Name</Link>

      <Button onClick={() => navigate('/')}>Button Go Home</Button>

      <Typography variant='h1'>Typography h1</Typography>
      <Typography variant='h2'>Typography h1</Typography>
      <Typography variant='h3'>Typography h1</Typography>
      <Typography variant='body1'>Typography body1</Typography>
      <Typography variant='body2'>Typography body2</Typography>
      <Typography variant='body3'>Typography body3</Typography>
      <Typography variant='body4'>Typography body4</Typography>
      <Typography variant='body5'>Typography body5</Typography>
    </div>
  );
})`
  &.preview-components {
    padding: 64px;
    row-gap: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
