import Config from 'config';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useConfig,
  useMusicLibrary,
  useRebuildMusicLibrary,
  useSaveConfig,
} from 'renderer/app/queries';
import NumberStepper from './NumberStepper';
import SeparatorList from './SeparatorList';

type DirectoryKey =
  | 'playlistDirectory'
  | 'ownPlaylistDirectory'
  | 'trackDirectory';
type BooleanKey = 'showNextTrackButton' | 'showPlayButton';

const directoryKeys: DirectoryKey[] = [
  'trackDirectory',
  'playlistDirectory',
  'ownPlaylistDirectory',
];
const booleanKeys: BooleanKey[] = ['showNextTrackButton', 'showPlayButton'];

export default function AdminPage() {
  const { t } = useTranslation();
  const { data: config } = useConfig();
  const { data: library } = useMusicLibrary();
  const save = useSaveConfig();
  const rebuild = useRebuildMusicLibrary();

  const [draft, setDraft] = useState<Config | undefined>(config ?? undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmRebuild, setConfirmRebuild] = useState(false);

  useEffect(() => {
    if (config) setDraft(config);
  }, [config]);

  if (!draft) return null;

  const update = (patch: Partial<Config>) =>
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleBrowse = async (key: DirectoryKey) => {
    const dir = await window.electron.ipcRenderer.selectDirectory(draft[key]);
    if (dir) update({ [key]: dir });
  };

  const playlistNames = library?.playlists.map((x) => x.name) ?? [];
  if (
    draft.defaultPlaylistName &&
    !playlistNames.includes(draft.defaultPlaylistName)
  ) {
    playlistNames.push(draft.defaultPlaylistName);
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(config);

  return (
    <Box
      flex={1}
      minWidth={0}
      overflow="auto"
      p={3}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <Typography variant="h5">{t('components.admin_page.title')}</Typography>

      <Typography variant="h6">
        {t('components.admin_page.section_paths')}
      </Typography>
      {directoryKeys.map((key) => (
        <Box key={key} display="flex" gap={1}>
          <TextField
            fullWidth
            label={t(`components.admin_page.${key}`)}
            value={draft[key]}
            onChange={(e) => update({ [key]: e.target.value })}
          />
          <Button
            variant="outlined"
            sx={{ minWidth: 140, minHeight: 56 }}
            onClick={() => handleBrowse(key)}
          >
            {t('components.admin_page.browse')}
          </Button>
        </Box>
      ))}

      <Typography variant="h6">
        {t('components.admin_page.section_ui')}
      </Typography>
      <Box display="flex" gap={1} alignItems="center">
        <TextField
          fullWidth
          label={t('components.admin_page.adminPassword')}
          type={showPassword ? 'text' : 'password'}
          value={draft.adminPassword}
          onChange={(e) => update({ adminPassword: e.target.value })}
        />
        <FormControlLabel
          sx={{ minWidth: 220 }}
          control={
            <Switch
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          }
          label={t('components.admin_page.showPassword')}
        />
      </Box>
      <TextField
        select
        fullWidth
        label={t('components.admin_page.defaultPlaylistName')}
        value={draft.defaultPlaylistName ?? ''}
        onChange={(e) => update({ defaultPlaylistName: e.target.value })}
      >
        <MenuItem value="" sx={{ minHeight: 56 }}>
          {t('components.admin_page.none')}
        </MenuItem>
        {playlistNames.map((name) => (
          <MenuItem key={name} value={name} sx={{ minHeight: 56 }}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      {booleanKeys.map((key) => (
        <FormControlLabel
          key={key}
          sx={{ minHeight: 56, justifyContent: 'space-between', ml: 0 }}
          labelPlacement="start"
          control={
            <Switch
              size="medium"
              checked={draft[key]}
              onChange={(e) => update({ [key]: e.target.checked })}
            />
          }
          label={t(`components.admin_page.${key}`)}
        />
      ))}

      <Typography variant="h6">
        {t('components.admin_page.section_timeouts')}
      </Typography>
      <NumberStepper
        label={t('components.admin_page.adminModeTimeoutSeconds')}
        value={draft.adminModeTimeoutSeconds}
        disabledLabel={t('components.admin_page.disabled')}
        onChange={(v) => update({ adminModeTimeoutSeconds: v })}
      />
      <NumberStepper
        label={t('components.admin_page.backToWaitlistTimeoutSeconds')}
        value={draft.backToWaitlistTimeoutSeconds}
        disabledLabel={t('components.admin_page.disabled')}
        onChange={(v) => update({ backToWaitlistTimeoutSeconds: v })}
      />
      <NumberStepper
        label={t('components.admin_page.playOwnPlaylistNowDelaySeconds')}
        value={draft.playOwnPlaylistNowDelaySeconds}
        step={1}
        onChange={(v) => update({ playOwnPlaylistNowDelaySeconds: v ?? 0 })}
      />

      <Typography variant="h6">
        {t('components.admin_page.section_tags')}
      </Typography>
      <SeparatorList
        label={t('components.admin_page.artistSeparators')}
        values={draft.artistSeparators}
        onChange={(artistSeparators) => update({ artistSeparators })}
      />
      <SeparatorList
        label={t('components.admin_page.genreSeparators')}
        values={draft.genreSeparators}
        onChange={(genreSeparators) => update({ genreSeparators })}
      />

      <Typography variant="h6">
        {t('components.admin_page.section_library')}
      </Typography>
      {rebuild.isSuccess && (
        <Alert severity="success">
          {t('components.admin_page.rebuild_success', {
            count: rebuild.data.tracks.length,
          })}
        </Alert>
      )}
      {rebuild.isError && (
        <Alert severity="error">
          {t('components.admin_page.rebuild_error')}
        </Alert>
      )}
      {rebuild.isLoading && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={28} />
          <Typography>{t('components.admin_page.rebuild_running')}</Typography>
        </Box>
      )}
      <Box>
        <Button
          variant="outlined"
          size="large"
          sx={{ minHeight: 64, minWidth: 200, fontSize: 18 }}
          disabled={rebuild.isLoading}
          onClick={() => setConfirmRebuild(true)}
        >
          {t('components.admin_page.rebuild')}
        </Button>
      </Box>
      <Dialog open={confirmRebuild} onClose={() => setConfirmRebuild(false)}>
        <DialogTitle>{t('components.admin_page.rebuild')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('components.admin_page.rebuild_confirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{ minHeight: 56, minWidth: 140 }}
            onClick={() => setConfirmRebuild(false)}
          >
            {t('components.admin_page.cancel')}
          </Button>
          <Button
            size="large"
            variant="contained"
            sx={{ minHeight: 56, minWidth: 140 }}
            onClick={() => {
              setConfirmRebuild(false);
              rebuild.mutate();
            }}
          >
            {t('components.admin_page.rebuild_start')}
          </Button>
        </DialogActions>
      </Dialog>

      {save.isSuccess && !dirty && (
        <Alert severity="success">{t('components.admin_page.saved')}</Alert>
      )}
      {save.isError && (
        <Alert severity="error">{t('components.admin_page.save_error')}</Alert>
      )}
      <Box display="flex" gap={2} pb={2}>
        <Button
          variant="contained"
          size="large"
          sx={{ minHeight: 64, minWidth: 200, fontSize: 18 }}
          disabled={!dirty || save.isLoading}
          onClick={() => save.mutate(draft)}
        >
          {t('components.admin_page.save')}
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ minHeight: 64, minWidth: 200, fontSize: 18 }}
          disabled={!dirty}
          onClick={() => config && setDraft(config)}
        >
          {t('components.admin_page.reset')}
        </Button>
      </Box>
    </Box>
  );
}
