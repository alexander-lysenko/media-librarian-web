import { Box, Button, styled, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { AppRoutes } from '../core/enums';

export const Route = createFileRoute(AppRoutes.emailConfirmation)({
  component: EmailConfirmation,
});

/**
 * Represents a simple component used to display a confirmation message
 * when an email address has been successfully confirmed.
 */
function EmailConfirmation() {
  const { t } = useTranslation();

  return (
    <FullscreenContainer>
      <Typography variant='h5' component='h1' textAlign='center' sx={{ p: 3 }}>
        {t('notifications.emailAddressConfirmed')}
      </Typography>
      <Button variant='contained' href={AppRoutes.appHome}>
        {t('app.backToApplication')}
      </Button>
    </FullscreenContainer>
  );
}

const FullscreenContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '66vh',
});
