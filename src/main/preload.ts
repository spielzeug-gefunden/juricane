// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import Config from 'config';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { MusicLibrary, OwnPlaylist, OwnPlaylistConfig } from 'renderer/types';

export type Channels = 'ipc-example' | 'open-playlists';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    loadConfig(): Promise<Config | null> {
      return ipcRenderer.invoke('config:load');
    },
    importConfig(): Promise<Config | null> {
      return ipcRenderer.invoke('config:import');
    },
    createDefaultConfig(): Promise<Config> {
      return ipcRenderer.invoke('config:createDefault');
    },
    saveConfig(config: Config): Promise<Config> {
      return ipcRenderer.invoke('config:save', config);
    },
    selectDirectory(current?: string): Promise<string | null> {
      return ipcRenderer.invoke('dialog:selectDirectory', current);
    },
    loadMusicLibrary(config: Config): Promise<MusicLibrary> {
      return ipcRenderer.invoke('files:loadLibrary', config);
    },
    loadOwnPlaylists(
      config: Config,
      library: MusicLibrary
    ): Promise<OwnPlaylist[]> {
      return ipcRenderer.invoke('files:loadOwnPlaylists', config, library);
    },
    updateOwnPlaylist(
      config: Config,
      playlist: OwnPlaylist,
      library: MusicLibrary
    ) {
      return ipcRenderer.invoke(
        'files:updateOwnPlaylist',
        config,
        playlist,
        library
      );
    },
    deleteOwnPlaylist(config: Config, playlistName: string) {
      return ipcRenderer.invoke(
        'files:deleteOwnPlaylist',
        config,
        playlistName
      );
    },
    loadOwnPlaylistConfig(config: Config): Promise<OwnPlaylistConfig> {
      return ipcRenderer.invoke('files:loadOwnPlaylistConfig', config);
    },
    saveOwnPlaylistConfig(
      config: Config,
      data: OwnPlaylistConfig
    ): Promise<void> {
      return ipcRenderer.invoke('files:saveOwnPlaylistConfig', config, data);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
