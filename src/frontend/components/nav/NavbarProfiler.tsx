import {
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppRoutes } from '../../core/enums';
import { useThemeStore } from '../../store/system/useThemeStore';
import { useProfileStore } from '../../store/useProfileStore';
import { BadgeOutlined, LightModeOutlined, LogoutOutlined } from '../icons';
import { ProfileAvatar } from '../profile/ProfileAvatar';

import type { MouseEvent } from 'react';

/**
 * Profile Avatar and menu designed to use inside AppBar
 * TODO: add navigation links/actions
 */
export const NavbarProfiler = () => {
  const { t } = useTranslation();
  const profile = useProfileStore((state) => state.profile);
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore((state) => state);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUiTheme = () => {
    setThemeMode(themeMode !== 'dark' ? 'dark' : 'light');
  };

  const handleSignOut = () => {
    console.log('Signed Out');
  };

  return (
    <>
      <Tooltip arrow title={t('app.openProfileMenu')}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
          {profile?.user && (
            <ProfileAvatar username={profile.user.name} alt={profile.user.name} src={profile.user.avatar} />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        id='menu-appbar'
        keepMounted
        anchorEl={anchorElUser}
        open={!!anchorElUser}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: { xs: 5, sm: 6 } }}
        slotProps={{ paper: { sx: { maxWidth: 300 } } }}
        onClose={handleCloseUserMenu}
      >
        <ListItem dense>
          {profile?.user && (
            <ListItemText disableTypography sx={{ my: 0 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', lineHeight: 1.5 }} noWrap>
                {profile.user.name}
              </Typography>
              <Typography variant='subtitle2' sx={{ fontWeight: 'regular' }} noWrap>
                {profile.user.email}
              </Typography>
            </ListItemText>
          )}
        </ListItem>
        <Divider variant='middle' sx={{ my: 1 }} />
        <MenuItem key='toUiTheme' onClick={handleUiTheme}>
          <ListItemIcon>
            <LightModeOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{`${t('app.uiTheme')}: ${t(`theme.${themeMode}`)}`}</ListItemText>
        </MenuItem>
        <MenuItem key='toProfile' component={Link} to={AppRoutes.profile}>
          <ListItemIcon>
            <BadgeOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{t('app.profile')}</ListItemText>
        </MenuItem>
        <MenuItem key='toLogOut' onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText disableTypography>{t('app.logout')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
