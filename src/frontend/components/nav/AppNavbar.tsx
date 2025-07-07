import { AppBar, Box, Container, Skeleton, Toolbar, useScrollTrigger } from '@mui/material';
import { cloneElement } from 'react';

import { useProfileGetRequest } from '../../requests/profileRequests';
import { AppLogo } from '../ui/AppLogo';
import { NavbarProfiler } from './NavbarProfiler';
import { NotificationsPopover } from './NotificationsPopover';

import type { ReactElement, ReactNode } from 'react';

interface Props {
  children: ReactElement<{ elevation?: number }>;
}

/**
 * Application's Top navigation bar.
 * Add here some links, notifications, interactions, and more.
 * @constructor
 */
export const AppNavbar = ({ children }: { children?: ReactNode }) => {
  const request = useProfileGetRequest();

  return (
    <>
      <ElevationScroll>
        <AppBar position='fixed' sx={{ mb: 3 }}>
          <Container maxWidth='xl'>
            <Toolbar disableGutters>
              <AppLogo />
              <Box sx={{ display: 'inline-flex', flex: 1, justifyContent: 'flex-end' }}>
                {/*{prettier.ignore}*/}
                {children}
              </Box>
              <NotificationsPopover />
              {request.status === 'success' ? <NavbarProfiler /> : <ProfileSkeleton />}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar sx={{ mb: 2 }} />
    </>
  );
};

const ElevationScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, { elevation: trigger ? 4 : 0 });
};

const ProfileSkeleton = () => {
  return <Skeleton variant='circular' width={40} height={40} sx={{ ml: 1 }} />;
};
