import { useEffect, useState } from 'react';
import { Box, Grid, Pagination } from '@mui/material';
import { DbCardDeputado } from '@/components/DbCardDeputado';
import DepudadosAPI from '@/services/DepudadosAPI';
import { useSearchParams } from 'react-router-dom';

import type { Deputado, PagedResponse } from '@/types';
import DbSkeletonCard from '@/components/DbSkeletonCard';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [pagination, setPagination] = useState<PagedResponse<Deputado>>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDeputados = async (page: number = 1, limit: number = 20) => {
    setLoading(true);
    const api = new DepudadosAPI();
    const response = await api.getDeputados(page, limit);

    setPagination(response);
    setLoading(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    fetchDeputados(newPage);
  };

  useEffect(() => {
    fetchDeputados(pageParam);
  }, [pageParam]);

  return (
    <Box sx={
      {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }>
      <Grid container direction="row" rowSpacing={{ sm: 4, md: 6 }} columnSpacing={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }} sx={{ justifyContent: 'start', alignItems: 'center', p: '32px 16px 28px' }}>
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
      <Pagination count={pagination?.totalPages || 1} page={pagination?.page ?? 1} onChange={handlePageChange} />
    </Box>
  );
};
