/* eslint-disable react/jsx-props-no-spreading */

import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { t } from 'i18next';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { Track } from 'renderer/types';
import ArtistChips from '../artist-chips/ArtistChips';
import TrackImage from '../tracks/TrackImage';

type Props = {
  tracks: Track[];
  disableDragging?: boolean;
  allowDelete: boolean;
  onDelete: (track: Track, index: number) => void;
  onDragEnd: OnDragEndResponder;
};

export default function QueueList({
  tracks,
  disableDragging = false,
  allowDelete,
  onDelete,
  onDragEnd,
}: Props) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table>
        <Droppable droppableId="droppable">
          {(provided) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {tracks.map((x, i) => (
                <Draggable
                  key={x.id.toString()}
                  draggableId={x.title}
                  index={i}
                  isDragDisabled={disableDragging}
                >
                  {(provided2) => (
                    <TableRow
                      ref={provided2.innerRef}
                      {...provided2.draggableProps}
                      {...provided2.dragHandleProps}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell sx={{ p: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <TrackImage size={48} forceSize track={x} zoomable />
                          <div>
                            <span>{x.title}</span>
                            <ArtistChips
                              sx={{ ml: -1, mt: 0.5 }}
                              artist={x.artist}
                              small
                            />
                          </div>
                        </Stack>
                      </TableCell>
                      {allowDelete && (
                        <TableCell>
                          <Tooltip title={t('components.queue.remove')}>
                            <IconButton onClick={() => onDelete(x, i)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </Draggable>
              ))}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}
