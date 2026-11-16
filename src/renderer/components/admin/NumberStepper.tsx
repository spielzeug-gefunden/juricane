import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Typography } from '@mui/material';

type Props = {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  step?: number;
  min?: number;
  /** Wenn gesetzt, steht 0 für "aus" und wird entsprechend angezeigt. */
  disabledLabel?: string;
};

export default function NumberStepper({
  label,
  value,
  onChange,
  step = 5,
  min = 0,
  disabledLabel,
}: Props) {
  const current = value ?? 0;
  const text = disabledLabel && current === 0 ? disabledLabel : String(current);

  const set = (next: number) => {
    const clamped = Math.max(min, next);
    onChange(disabledLabel && clamped === 0 ? undefined : clamped);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography flex={1}>{label}</Typography>
      <IconButton
        aria-label="-"
        size="large"
        sx={{ width: 56, height: 56 }}
        onClick={() => set(current - step)}
      >
        <RemoveIcon fontSize="large" />
      </IconButton>
      <Typography variant="h6" minWidth={80} align="center">
        {text}
      </Typography>
      <IconButton
        aria-label="+"
        size="large"
        sx={{ width: 56, height: 56 }}
        onClick={() => set(current + step)}
      >
        <AddIcon fontSize="large" />
      </IconButton>
    </Box>
  );
}
