import styled from '@emotion/styled';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ListIcon from '@mui/icons-material/List';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, ButtonGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useConfig } from 'renderer/app/queries';
import { toggleAdminMode } from 'renderer/slices/admin-slice';
import to from 'renderer/utils/to';
import logo from '../../../../assets/logo.png';
import UserInteractionTimeoutHandler from './UserInteractionTimeoutHandler';
import { selectAdminMode } from './selectors';

const tabs = [
  { name: 'Playing', Icon: PlayArrowIcon },
  { name: 'Playlists', Icon: ListIcon },
  { name: 'Tracks', Icon: MusicNoteIcon },
  { name: 'Artists', Icon: PeopleIcon },
  { name: 'Genres', Icon: LibraryMusicIcon },
];

const HeaderContainer = styled('div')({
  backgroundColor: 'rgb(32, 32, 32)',
  transition: 'background-color 0.2s ease',
  maxHeight: 140,
  minHeight: 80,
  flex: 1,
  display: 'flex',
});

export default function Header() {
  const getPathFromTab = (tabname: string) => {
    return `/${tabname.toLowerCase()}`;
  };
  const navigate = useNavigate();
  const adminMode = useSelector(selectAdminMode);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { data: config } = useConfig();

  const handleToggleAdminMode = () => {
    if (adminMode) {
      dispatch(toggleAdminMode());
    } else {
      dispatch(toggleAdminMode());
    }
  };

  // Beim Verlassen des Admin-Modus (auch per Timeout) die Admin-Seite verlassen
  useEffect(() => {
    if (!adminMode && pathname.startsWith('/admin')) {
      navigate('/playing', { replace: true });
    }
  }, [adminMode, pathname, navigate]);

  const navigateBackToWaitlist = () => {
    navigate(getPathFromTab(tabs[0].name));
  };

  return (
    <HeaderContainer>
      <Box flex={1} display="flex" alignItems="flex-end" sx={{ p: 2 }}>
        <Box display="flex" alignItems="center">
          <ButtonGroup
            variant="text"
            size="small"
            aria-label="navigation buttons"
          >
            <Button style={{ width: 80 }} onClick={() => navigate(-1)}>
              <ArrowBackIosIcon />
            </Button>
            <Button style={{ width: 80 }} onClick={() => navigate(1)}>
              <ArrowForwardIosIcon />
            </Button>
          </ButtonGroup>
          <Box pl={2}>
            {tabs.map(({ name, Icon }) => (
              <Button
                key={name}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...to(getPathFromTab(name), NavLink)}
                // @ts-ignore
                style={({ isActive }) => ({
                  color: isActive ? 'white' : undefined,
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.04)'
                    : undefined,
                })}
                sx={{
                  p: 2,
                  fontSize: 16,
                  transition: 'color 0.2s ease',
                }}
              >
                {Icon && <Icon sx={{ mr: 1 }} />}
                {name}
              </Button>
            ))}
            <Button
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...to(`${getPathFromTab('Tracks')}?search`, NavLink)}
              sx={{
                p: 2,
                fontSize: 16,
                transition: 'color 0.2s ease',
              }}
            >
              <SearchIcon />
            </Button>
            {adminMode && (
              <Button
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...to('/admin', NavLink)}
                // @ts-ignore
                style={({ isActive }) => ({
                  color: isActive ? 'white' : undefined,
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.04)'
                    : undefined,
                })}
                sx={{
                  p: 2,
                  fontSize: 16,
                  transition: 'color 0.2s ease',
                }}
              >
                <SettingsIcon sx={{ mr: 1 }} />
                {t('components.admin_page.nav')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" p={2}>
        <img
          src={logo}
          height="100%"
          alt="Lienke SounDevices"
          onDoubleClick={
            config?.enableHiddenAdminAccess === false
              ? undefined
              : handleToggleAdminMode
          }
        />
      </Box>
      {adminMode && config?.adminModeTimeoutSeconds && (
        <UserInteractionTimeoutHandler
          handler={handleToggleAdminMode}
          timeoutSeconds={config.adminModeTimeoutSeconds}
        />
      )}
      {config?.backToWaitlistTimeoutSeconds && (
        <UserInteractionTimeoutHandler
          timeoutSeconds={config.backToWaitlistTimeoutSeconds}
          handler={navigateBackToWaitlist}
        />
      )}
    </HeaderContainer>
  );
}
