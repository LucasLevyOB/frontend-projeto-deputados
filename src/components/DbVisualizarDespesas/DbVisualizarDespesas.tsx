import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { formatCurrency } from '@/utils';

import type { Despesa } from '@/types';
import type { ResumoGastos } from '@/types/Deputado';

interface Props {
  id: number;
  resumoGastos?: ResumoGastos[];
  ano?: number;
}

const DbVisualizarDespesas = ({ id, resumoGastos, ano }: Props) => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [pageDespesas, setPageDespesas] = useState<number>(1);
  const [hasMoreDespesas, setHasMoreDespesas] = useState<boolean>(true);
  const [loadingDespesas, setLoadingDespesas] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastDespesaElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingDespesas) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreDespesas) {
          setPageDespesas((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loadingDespesas, hasMoreDespesas]
  );

  const fetchDespesasData = async () => {
    setLoadingDespesas(true);
    const api = new DepudadosAPI();
    const response = await api.getDespesasDeputado(
      Number(id),
      pageDespesas,
      20,
      ano
    );
    setDespesas((prev) => [...prev, ...response.data]);
    setHasMoreDespesas(pageDespesas < response.totalPages);
    setLoadingDespesas(false);
  };

  useEffect(() => {
    if (id) {
      fetchDespesasData();
    }
  }, [id, pageDespesas, ano]);

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Despesas
      </Typography>

      {resumoGastos && !!ano && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {resumoGastos
            .find((r) => r.ano === ano)
            ?.categorias.map((cat, idx) => (
              <Chip
                key={idx}
                label={`${cat.descricao}: ${formatCurrency(cat.totalGasto)}`}
                variant="outlined"
              />
            ))}
        </Box>
      )}

      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <List>
          {despesas.map((despesa, index) => {
            const isLast = despesas.length === index + 1;
            return (
              <Box key={index} ref={isLast ? lastDespesaElementRef : null}>
                <ListItem>
                  <ListItemText
                    primary={despesa.descricao}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          {despesa.descricaoEspecificacao}
                        </Typography>
                        <Typography component="span" variant="body2">
                          {formatCurrency(Number(despesa.valorLiquido))}
                        </Typography>
                        {` - Fornecedor: ${despesa.fornecedor} | Data: ${new Date(despesa.dataEmissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`}
                      </>
                    }
                  />
                </ListItem>
                {!isLast && <Divider />}
              </Box>
            );
          })}
          {loadingDespesas && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default DbVisualizarDespesas;
