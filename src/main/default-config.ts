import Config from 'config';
import path from 'path';

/**
 * Vorlage für eine neu angelegte Konfiguration (entspricht der Beispiel-
 * config.json, aber mit Verzeichnissen unterhalb des Musikordners des Nutzers).
 */
export default function createDefaultConfig(musicDirectory: string): Config {
  return {
    playlistDirectory: path.join(musicDirectory, 'Playlisten'),
    ownPlaylistDirectory: path.join(musicDirectory, 'eigene_playlisten'),
    trackDirectory: musicDirectory,
    adminPassword: 'test',
    showNextTrackButton: false,
    showPlayButton: false,
    defaultPlaylistName: '',
    artistSeparators: [
      ' featuring ',
      ' ft\\. ',
      ' ft ',
      ' feat\\. ',
      ' feat ',
      ' & ',
    ],
    genreSeparators: [','],
    adminModeTimeoutSeconds: 30,
    backToWaitlistTimeoutSeconds: 60,
    playOwnPlaylistNowDelaySeconds: 10,
  };
}
