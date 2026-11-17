import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, TableCell, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Track } from 'renderer/types';
import VirtualizedJumpTable from '../grouped-tracks/VirtualizedJumpTable';
import TrackImage from '../tracks/TrackImage';

function createFixedHeaderContent() {
  // eslint-disable-next-line react/function-component-definition
  return () => {
    const { t } = useTranslation();
    const bgColor = 'rgb(51 51 51)';

    return (
      <TableRow>
        <TableCell
          variant="head"
          style={{ width: 180, backgroundColor: bgColor }}
        />
        <TableCell variant="head" style={{ backgroundColor: bgColor }}>
          {t('components.track_list.title')}
        </TableCell>
        <TableCell variant="head" style={{ backgroundColor: bgColor }}>
          {t('components.track_list.artist')}
        </TableCell>
        <TableCell variant="head" style={{ backgroundColor: bgColor }}>
          {t('components.track_list.album')}
        </TableCell>
        <TableCell
          variant="head"
          style={{ backgroundColor: bgColor }}
          width={160}
        >
          {t('components.track_list.genre')}
        </TableCell>
      </TableRow>
    );
  };
}

function rowContent(
  _index: number,
  row: Track,
  onAddTrack: (track: Track) => void,
  addedTracks: number[]
) {
  return (
    <>
      <TableCell>
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="add to waitlist"
          sx={{ zIndex: 0, width: 150 }}
          onClick={() => onAddTrack(row)}
          disabled={addedTracks.includes(row.id)}
        >
          <AddIcon sx={{ mr: 1 }} />
          <span style={{ flex: 1, textAlign: 'left' }}>Hinzufügen</span>
        </Fab>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <TrackImage size={48} track={row} forceSize zoomable />
          <Box ml={2}>{row.title}</Box>
        </Box>
      </TableCell>
      <TableCell>{row.artist}</TableCell>
      <TableCell>{row.album}</TableCell>
      <TableCell>{row.genre}</TableCell>
    </>
  );
}

type Props = {
  tracks: Track[];
  onAddTrack: (track: Track) => void;
  addedTracks: number[];
};

export default function EditOwnPlaylistTrackSelection({
  tracks,
  onAddTrack,
  addedTracks,
}: Props) {
  return (
    <VirtualizedJumpTable
      items={tracks}
      getItemName={(track) => track.title}
      fixedHeaderContent={createFixedHeaderContent()}
      itemContent={(index, data) =>
        rowContent(index, data, onAddTrack, addedTracks)
      }
    />
  );
}
