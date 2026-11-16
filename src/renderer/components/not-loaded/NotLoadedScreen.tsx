import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  useConfig,
  useCreateDefaultConfig,
  useImportConfig,
  useMusicLibrary,
} from 'renderer/app/queries';
import { startInAdminPage } from 'renderer/slices/admin-slice';

export default function NotLoadedScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: config, isFetched: configFetched, refetch } = useConfig();
  const importConfig = useImportConfig();
  const createConfig = useCreateDefaultConfig();
  const { isLoading } = useMusicLibrary();

  const handleCreate = async () => {
    await createConfig.mutateAsync();
    dispatch(startInAdminPage());
  };

  // Keine config.json vorhanden: Import oder neu anlegen
  if (configFetched && !config) {
    const hasError = importConfig.isError || createConfig.isError;
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          maxWidth={600}
          p={2}
          gap={2}
        >
          <Typography variant="h5">
            {t('components.not_loaded.no_config_title')}
          </Typography>
          <Typography align="center">
            {t('components.not_loaded.no_config_text')}
          </Typography>
          {hasError && (
            <Typography color="error">
              {t('components.not_loaded.error')}
            </Typography>
          )}
          <Box display="flex" gap={2}>
            <LoadingButton
              variant="contained"
              size="large"
              sx={{ minHeight: 64, minWidth: 200, fontSize: 18 }}
              loading={importConfig.isLoading}
              onClick={() => importConfig.mutate()}
            >
              {t('components.not_loaded.import')}
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              size="large"
              sx={{ minHeight: 64, minWidth: 200, fontSize: 18 }}
              loading={createConfig.isLoading}
              onClick={handleCreate}
            >
              {t('components.not_loaded.create_new')}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box display="flex" alignItems="center" flexDirection="column">
        <Typography gutterBottom>{t('components.not_loaded.text')}</Typography>
        <LoadingButton loading={isLoading} onClick={() => refetch()}>
          {t('components.not_loaded.button_text')}
        </LoadingButton>
      </Box>
    </Box>
  );
}
