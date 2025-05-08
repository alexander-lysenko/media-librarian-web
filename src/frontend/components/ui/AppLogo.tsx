import { Button, styled, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

import { AppRoutes } from '../../core/enums';

export const AppLogo = () => {
  return (
    <Button color='inherit' component={Link} to={AppRoutes.appHome} sx={{ flexShrink: 0, alignSelf: 'stretch' }}>
      <Logo />
      <Typography variant='h6' sx={{ px: 1, display: { xs: 'none', sm: 'inherit' } }}>
        {'Media Librarian'}
      </Typography>
    </Button>
  );
};

const Logo = styled('div')({
  width: 40,
  height: 40,
  maxWidth: 40,
  flex: '1 0',
  backgroundImage: `url(${new URL('/icons/logo.svg', import.meta.url)})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
});
