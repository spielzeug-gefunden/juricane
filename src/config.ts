type Config = {
  playlistDirectory: string;
  ownPlaylistDirectory: string;
  trackDirectory: string;
  adminPassword: string;
  showNextTrackButton: boolean;
  showPlayButton: boolean;
  defaultPlaylistName: string;
  artistSeparators: string[];
  genreSeparators: string[];
  enableHiddenAdminAccess?: boolean;
  adminModeTimeoutSeconds: number | undefined;
  backToWaitlistTimeoutSeconds: number | undefined;
  playOwnPlaylistNowDelaySeconds: number;
};

export default Config;
