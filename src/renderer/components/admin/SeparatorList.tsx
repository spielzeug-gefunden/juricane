import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
};

export default function SeparatorList({ label, values, onChange }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    if (draft === '' || values.includes(draft)) return;
    onChange([...values, draft]);
    setDraft('');
  };

  return (
    <Box>
      <Typography gutterBottom>{label}</Typography>
      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
        {values.map((value) => (
          <Chip
            key={value}
            label={`"${value}"`}
            sx={{ height: 48, fontSize: 16 }}
            onDelete={() => onChange(values.filter((x) => x !== value))}
          />
        ))}
      </Box>
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          label={t('components.admin_page.add_separator')}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button variant="outlined" sx={{ minWidth: 140 }} onClick={handleAdd}>
          {t('components.admin_page.add')}
        </Button>
      </Box>
    </Box>
  );
}
