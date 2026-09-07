import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { VirtualListbox, VirtualListboxContext } from './VirtualListbox';
import type { DeputadoResumo } from '@/types';

interface DeputadoAutocompleteProps {
  onSelect: (_deputado: DeputadoResumo) => void;
  loading?: boolean;
  placeholder?: string;
}

export const DeputadoAutocomplete = ({
  onSelect,
  loading = false,
  placeholder = 'Buscar Deputado',
}: DeputadoAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DeputadoResumo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);

  const debouncedInput = useDebounce(inputValue, 300);

  const carregarMais = useCallback(async () => {
    if (fetchingOptions || fetchingMore || !hasMore) return;

    setFetchingMore(true);
    try {
      const proximaPagina = page + 1;
      const api = new DepudadosAPI();
      const response = await api.buscarDeputados(
        debouncedInput.trim() || undefined,
        proximaPagina,
        10
      );

      setOptions((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const novos = (response.data || []).filter(
          (item) => !existingIds.has(item._id)
        );
        return [...prev, ...novos];
      });

      setPage(proximaPagina);
      setHasMore(proximaPagina < response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar mais deputados para autocomplete:', error);
    } finally {
      setFetchingMore(false);
    }
  }, [fetchingOptions, fetchingMore, hasMore, page, debouncedInput]);

  useEffect(() => {
    let ativo = true;

    const buscarDeputados = async () => {
      setFetchingOptions(true);
      try {
        const api = new DepudadosAPI();
        const response = await api.buscarDeputados(
          debouncedInput.trim() || undefined,
          1,
          10
        );

        if (ativo) {
          setOptions(response.data || []);
          setPage(1);
          setHasMore(1 < response.totalPages);
        }
      } catch (error) {
        console.error('Erro ao buscar deputados para autocomplete:', error);
      } finally {
        if (ativo) {
          setFetchingOptions(false);
        }
      }
    };

    if (open) {
      buscarDeputados();
    }

    return () => {
      ativo = false;
    };
  }, [debouncedInput, open]);

  return (
    <VirtualListboxContext.Provider value={{ onLoadMore: carregarMais }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={fetchingOptions || fetchingMore || loading}
        filterOptions={(x) => x}
        slots={{ listbox: VirtualListbox }}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.nome
        }
        isOptionEqualToValue={(option, val) => option._id === val._id}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(_, value) => {
          if (value && typeof value !== 'string') {
            onSelect(value);
          }
        }}
        fullWidth
        size="small"
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;

          return (
            <Box
              component="li"
              key={key}
              {...otherProps}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                height: 52,
                boxSizing: 'border-box',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&:active': {
                  bgcolor: 'action.active',
                },
              }}
            >
              <Avatar
                src={option.urlFoto}
                alt={option.nome}
                sx={{ width: 32, height: 32 }}
              >
                {option.nome.substring(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {option.nome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.siglaPartido} - {option.siglaUf}
                </Typography>
              </Box>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {fetchingOptions || fetchingMore ? (
                      <CircularProgress color="inherit" size={18} />
                    ) : null}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
    </VirtualListboxContext.Provider>
  );
};
