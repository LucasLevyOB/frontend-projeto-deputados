import { useEffect, useState } from 'react';
import { Box, Grid, Pagination, Container, Typography } from '@mui/material';
import { DbCardDeputado } from '@/components/DbCardDeputado';
import DepudadosAPI from '@/services/DepudadosAPI';
import { useSearchParams } from 'react-router-dom';
import DbSkeletonCard from '@/components/DbSkeletonCard';
import { DbFiltragemDeputados } from '@/components/DbFiltragemDeputados';
import DbEmptyState from '@/components/DbEmptyState/DbEmptyState';

import type { Deputado, PagedResponse } from '@/types';

export const Deputados = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const ufParam = searchParams.get('uf') || '';
  const partidoParam = searchParams.get('siglaPartido') || '';
  const nomeParam = searchParams.get('nome') || '';

  const [pagination, setPagination] = useState<PagedResponse<Deputado>>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDeputados = async (page: number = 1, limit: number = 20, uf?: string, siglaPartido?: string, nome?: string) => {
    setLoading(true);
    const api = new DepudadosAPI();
    const response = await api.getDeputados(page, limit, uf, siglaPartido, nome);

    setPagination(response);
    setLoading(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleFilterChange = (filterName: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  useEffect(() => {
    fetchDeputados(pageParam, 20, ufParam, partidoParam, nomeParam);
  }, [pageParam, ufParam, partidoParam, nomeParam]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 4, gap: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Deputados Federais
          </Typography>
          {nomeParam && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              Resultados encontrados para "{nomeParam}"
            </Typography>
          )}
        </Box>
        <DbFiltragemDeputados uf={ufParam} partido={partidoParam} handleFilterChange={handleFilterChange} />
      </Box>

      {!loading && pagination?.data.length === 0 ? (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DbEmptyState 
            title="Nenhum deputado encontrado" 
            description="Tente ajustar os filtros de busca (nome, estado ou partido) para encontrar o parlamentar desejado." 
          />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container direction="row" rowSpacing={{ sm: 4, md: 6 }} columnSpacing={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }} sx={{ justifyContent: 'start', alignItems: 'center', pb: 4, width: '100%' }}>
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <DbSkeletonCard />
                </Grid>
              ))
            ) : (
              pagination?.data.map((deputado) => (
                <Grid key={deputado._id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <DbCardDeputado deputado={deputado} />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}

      {(!loading && (pagination?.totalPages || 0) > 1) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={pagination?.totalPages || 1} 
            page={pagination?.page ?? 1} 
            onChange={handlePageChange} 
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};
