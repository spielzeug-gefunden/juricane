/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Chip, Fab, TableCell, TableRow } from '@mui/material';
import { TFunction } from 'i18next';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Track } from 'renderer/types';
import TrackImage from '../tracks/TrackImage';
import VirtualizedJumpTable from './VirtualizedJumpTable';

export type ColumnName = 'title' | 'artist' | 'duration' | 'album' | 'genre';

export type TrackNavigationRoute = {
  type: 'artists' | 'albums' | 'genres';
  name: string;
};

export type ConfigProps = {
  hiddenColumns?: ColumnName[];
  queuedTracks: number[];
  currentlyPlaying: number | undefined;
  onAddToQueue: (track: Track) => void;
  onNavigate: (route: TrackNavigationRoute) => void;
};

type Props = ConfigProps & {
  tracks: Track[];
  disableJumpBar?: boolean;
};

type Column = {
  name: ColumnName;
  txName: string;
  renderContent: (
    track: Track,
    onNavigate: (route: TrackNavigationRoute) => void
  ) => React.ReactNode;
  offsetHeader?: boolean;
  width?: number;
};

type ActionCellProps = {
  text: string | null | undefined;
  onClick: () => void;
};

function ActionCell({ text, onClick }: ActionCellProps) {
  if (!text) {
    return null;
  }

  return (
    <Chip
      label={text}
      onClick={onClick}
      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
    />
  );
}

const columns: Column[] = [
  {
    name: 'artist',
    txName: 'components.track_list.artist',
    renderContent: (track, onNavigate) => (
      <>
        {track.artist.map((x, i) => (
          <ActionCell
            key={i.toString()}
            text={x}
            onClick={() => onNavigate({ type: 'artists', name: x })}
          />
        ))}
      </>
    ),
    offsetHeader: true,
  },
  {
    name: 'album',
    txName: 'components.track_list.album',
    renderContent: (track, onNavigate) => (
      <ActionCell
        text={track.album}
        onClick={() => onNavigate({ type: 'albums', name: track.album! })}
      />
    ),
    offsetHeader: true,
  },
  {
    name: 'genre',
    txName: 'components.track_list.genre',
    renderContent: (track, onNavigate) => (
      <>
        {track.genre.map((x, i) => (
          <ActionCell
            key={i.toString()}
            text={x}
            onClick={() => onNavigate({ type: 'genres', name: x })}
          />
        ))}
      </>
    ),
    width: 160,
    offsetHeader: true,
  },
];

function createFixedHeaderContent({ hiddenColumns }: ConfigProps) {
  // eslint-disable-next-line react/function-component-definition
  return () => {
    const { t } = useTranslation();
    const bgColor = 'rgb(51 51 51)';

    return (
      <TableRow>
        <TableCell
          variant="head"
          style={{ width: 140, backgroundColor: bgColor }}
        />
        <TableCell variant="head" style={{ backgroundColor: bgColor }}>
          {t('components.track_list.title')}
        </TableCell>
        {columns
          .filter((x) => !hiddenColumns?.includes(x.name))
          .map(({ name, txName, width, offsetHeader }) => (
            <TableCell
              key={name}
              variant="head"
              style={{ width, backgroundColor: bgColor }}
            >
              <span style={{ marginLeft: offsetHeader ? 16 : 0 }}>
                {t(txName as any)}
              </span>
            </TableCell>
          ))}
      </TableRow>
    );
  };
}

function rowContent(
  _index: number,
  row: Track,
  {
    hiddenColumns,
    onAddToQueue,
    onNavigate,
    queuedTracks,
    currentlyPlaying,
  }: ConfigProps,
  t: TFunction
) {
  const queuePosition = _.indexOf(queuedTracks, row.id);
  const queued = queuePosition > -1;
  const playing = currentlyPlaying === row.id;
  const buttonText = (() => {
    if (queued) {
      return `${t('components.track_list.pos')} ${queuePosition + 1}`;
    }

    if (playing) {
      return t('components.track_list.playing');
    }

    return t('components.track_list.waitlist');
  })();

  return (
    <>
      <TableCell>
        <Fab
          onClick={() => onAddToQueue(row)}
          variant="extended"
          size="small"
          color="primary"
          aria-label="add to waitlist"
          sx={{ zIndex: 0, width: 120 }}
          disabled={queued || playing}
        >
          {queued ? <CheckIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
          <span style={{ flex: 1, textAlign: 'left' }}>{buttonText}</span>
        </Fab>
      </TableCell>

      <TableCell>
        <Box display="flex" alignItems="center">
          <TrackImage size={48} track={row} forceSize zoomable />
          <Box ml={2}>{row.title}</Box>
        </Box>
      </TableCell>

      {columns
        .filter((x) => !hiddenColumns?.includes(x.name))
        .map(({ name, renderContent }) => (
          <TableCell key={name}>{renderContent(row, onNavigate)}</TableCell>
        ))}
    </>
  );
}

export default function TracksTable({
  tracks,
  disableJumpBar,
  ...configProps
}: Props) {
  const { t } = useTranslation();

  return (
    <VirtualizedJumpTable
      items={tracks}
      getItemName={(track) => track.title}
      fixedHeaderContent={createFixedHeaderContent(configProps)}
      // @ts-ignore
      itemContent={(index, data) => rowContent(index, data, configProps, t)}
      disableJumpBar={disableJumpBar}
    />
  );
}
