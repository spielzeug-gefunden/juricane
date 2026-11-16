import Config from 'config';

/**
 * Vorlage für eine neu angelegte Konfiguration. Muss mit der
 * `config.example.json` im Projektwurzelordner übereinstimmen.
 */
export default function createDefaultConfig(): Config {
  return {
    playlistDirectory: 'C:/Musik/Playlisten',
    ownPlaylistDirectory: 'C:/Musik/eigene_playlisten',
    trackDirectory: 'C:/Musik',
    adminPassword: 'change-me',
    showNextTrackButton: false,
    showPlayButton: false,
    defaultPlaylistName: 'Playlist_Ordner_2',
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
