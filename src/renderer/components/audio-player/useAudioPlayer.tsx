import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'renderer/app/store';
import Player from 'renderer/audio/player';
import { playNextTrack } from 'renderer/slices/music-player-slice';
import { selectCurrentTrack } from '../main/selectors';

export default function useAudioPlayer() {
  const player = useRef(new Player());
  const dispatch = useDispatch();
  const currentTrack = useSelector(selectCurrentTrack);
  const playToken = useSelector(
    (state: RootState) => state.musicPlayer.playToken
  );
  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;

  useEffect(() => {
    const p = player.current;
    const handler = () => {
      dispatch(playNextTrack());
    };
    p.on('requestNextSong', handler);

    return () => {
      p.off('requestNextSong', handler);
    };
  }, [dispatch]);

  useEffect(() => {
    const p = player.current;

    return () => {
      p.destroy();
    };
  }, []);

  useEffect(() => {
    const track = currentTrackRef.current;
    if (!track) return;

    player.current.nextTrack(
      `file://${encodeURI(track.url).replace('#', '%23')}`
    );
    // Nur bei neuem Titel starten, nicht wenn das Track-Objekt nach einem
    // Neueinlesen der Bibliothek ersetzt wird.
  }, [playToken]);

  return player.current;
}
