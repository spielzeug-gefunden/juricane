import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { MusicLibrary, Track } from 'renderer/types';
import { reorder } from 'renderer/utils/dragndrop';

type CurrentPlaylist = {
  url: string;
  name: string;
  tracks: Track[];
};

export type MusicPlayerState = {
  currentTrack: Track | null;
  currentPlaylist: CurrentPlaylist | null;
  playedTracksHistory: number[];
  waitlist: Track[];
  libraryPath: string | null;
  /** Wird bei jedem Start eines Titels erhöht; löst die Wiedergabe aus. */
  playToken: number;
};

const initialState: MusicPlayerState = {
  currentTrack: null,
  currentPlaylist: null,
  playedTracksHistory: [],
  waitlist: [],
  libraryPath: null,
  playToken: 0,
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    setLibraryPath(state, { payload }: PayloadAction<string>) {
      state.libraryPath = payload;
    },
    addToWaitlist(state, { payload }: PayloadAction<Track>) {
      state.waitlist.push(payload);
    },
    setCurrentTrack(state, { payload }: PayloadAction<Track>) {
      state.currentTrack = payload;
      state.playToken += 1;

      if (state.waitlist.length > 0 && state.waitlist[0].id === payload.id) {
        state.waitlist = state.waitlist.slice(1);
      }

      state.playedTracksHistory = [payload.id, ...state.playedTracksHistory];
    },
    setCurrentPlaylist(state, { payload }: PayloadAction<CurrentPlaylist>) {
      state.currentPlaylist = payload;
    },
    removeFromWaitlist(state, { payload }: PayloadAction<number>) {
      state.waitlist = state.waitlist.filter((x) => x.id !== payload);
    },
    waitlistReorder(
      state,
      {
        payload: { startIndex, endIndex },
      }: PayloadAction<{ startIndex: number; endIndex: number }>
    ) {
      state.waitlist = reorder(state.waitlist, startIndex, endIndex);
    },
    // Nach dem Neuaufbau der Bibliothek ändern sich die Track-IDs. Titel werden
    // über ihre URL wiedergefunden; nicht mehr vorhandene Titel fliegen aus
    // Warteschlange und Verlauf. Der laufende Titel bleibt unverändert, falls
    // er nicht mehr gefunden wird. playToken bleibt gleich, die Wiedergabe
    // wird also nicht neu gestartet.
    remapTracksToLibrary(
      state,
      {
        payload: { oldLibrary, newLibrary },
      }: PayloadAction<{ oldLibrary: MusicLibrary; newLibrary: MusicLibrary }>
    ) {
      const newByUrl = new Map(newLibrary.tracks.map((x) => [x.url, x]));
      const oldUrlById = new Map(oldLibrary.tracks.map((x) => [x.id, x.url]));

      if (state.currentTrack) {
        state.currentTrack =
          newByUrl.get(state.currentTrack.url) ?? state.currentTrack;
      }
      if (state.currentPlaylist) {
        state.currentPlaylist.tracks = state.currentPlaylist.tracks.flatMap(
          (x) => {
            const t = newByUrl.get(x.url);
            return t ? [t] : [];
          }
        );
      }
      state.waitlist = state.waitlist.flatMap((x) => {
        const t = newByUrl.get(x.url);
        return t ? [t] : [];
      });
      state.playedTracksHistory = state.playedTracksHistory.flatMap((id) => {
        const url = oldUrlById.get(id);
        const t = url === undefined ? undefined : newByUrl.get(url);
        return t ? [t.id] : [];
      });
    },
    enqueueTracksAndPlayFirst(state, { payload }: PayloadAction<Track[]>) {
      if (payload.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        state.currentTrack = payload[0];
        state.playToken += 1;
        state.playedTracksHistory = [
          payload[0].id,
          ...state.playedTracksHistory,
        ];
      }
      const payloadTrackIds = new Set(payload.map((x) => x.id));
      state.waitlist = [
        ...payload.slice(1),
        ...state.waitlist.filter((x) => !payloadTrackIds.has(x.id)),
      ];
    },
  },
});

export const playNextTrack = createAction('musicPlayer/playNextTrack');

export const {
  setLibraryPath,
  addToWaitlist,
  setCurrentPlaylist,
  setCurrentTrack,
  removeFromWaitlist,
  waitlistReorder,
  enqueueTracksAndPlayFirst,
  remapTracksToLibrary,
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
