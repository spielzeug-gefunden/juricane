import { getTrackImagePath } from 'consts';
import { Dialog } from '@mui/material';
import { ComponentProps, useState } from 'react';
import { useConfig } from 'renderer/app/queries';
import { Track } from 'renderer/types';

type Props = ComponentProps<'img'> & {
  track: Track;
  size: number;
  forceSize?: boolean;
  zoomable?: boolean;
};

export default function TrackImage({
  track,
  size,
  style,
  forceSize,
  zoomable,
  ...imgProps
}: Props) {
  const [open, setOpen] = useState(false);
  const { data: config } = useConfig();
  if (!config) return null;

  if (!track.hasImage) {
    if (!forceSize) return null;
    return <div style={{ width: size, height: size }} />;
  }

  const src = `file://${getTrackImagePath(config.trackDirectory, track.id)}`;

  if (!zoomable) {
    return (
      <img
        src={src}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: 4,
          ...style,
        }}
        alt=""
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...imgProps}
      />
    );
  }

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            setOpen(true);
          }
        }}
      >
        <img
          src={src}
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            borderRadius: 4,
            ...style,
          }}
          alt=""
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...imgProps}
        />
      </span>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClick={() => setOpen(false)}
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <img
          src={src}
          alt=""
          style={{
            maxWidth: '80vw',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: 4,
          }}
        />
      </Dialog>
    </>
  );
}
