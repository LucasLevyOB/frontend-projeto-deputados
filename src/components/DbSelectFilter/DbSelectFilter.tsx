import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  type SelectChangeEvent,
  type SxProps,
  type Theme,
} from '@mui/material';
import { Clear } from '@mui/icons-material';

export interface SelectFilterOption {
  value: string;
  label: string;
}

export interface DbSelectFilterProps {
  label: string;
  value?: string;
  options: SelectFilterOption[];
  allLabel?: string;
  onChange: (value: string | undefined) => void;
  id?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export const DbSelectFilter = ({
  label,
  value,
  options,
  allLabel = 'Todos',
  onChange,
  id,
  fullWidth = true,
  size = 'small',
  sx,
}: DbSelectFilterProps) => {
  const generatedId = id || label.toLowerCase().replace(/\s+/g, '-');
  const labelId = `${generatedId}-label`;

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    const selected = e.target.value;
    onChange(selected ? selected : undefined);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} sx={{ mb: 2, ...sx }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={generatedId}
        value={value || ''}
        label={label}
        onChange={handleChange}
        endAdornment={
          value ? (
            <IconButton
              size="small"
              aria-label="Limpar seleção"
              onClick={handleClear}
              sx={{
                position: 'absolute',
                right: 28,
                p: 0.5,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <Clear fontSize="small" />
            </IconButton>
          ) : undefined
        }
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                maxHeight: { xs: 260, sm: 320 },
                maxWidth: { xs: 'calc(100vw - 32px)', sm: 'none' },
              },
            },
          },
        }}
        sx={{
          '& .MuiSelect-select': {
            pr: value ? '56px !important' : undefined,
          },
        }}
      >
        <MenuItem value="" sx={{ fontStyle: 'italic', whiteSpace: 'normal' }}>
          <em>{allLabel}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              py: 1,
              lineHeight: 1.3,
              fontSize: '0.875rem',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DbSelectFilter;
