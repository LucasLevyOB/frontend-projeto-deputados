import { Box, Grid, Pagination, Container, Typography } from '@mui/material';
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import { DbCardDeputado } from '@/components/DbCardDeputado';
import { DbFiltragemDeputados } from '@/components/DbFiltragemDeputados';
import DbEmptyState from '@/components/DbEmptyState/DbEmptyState';

import type { loader } from './loader';

export { loader } from './loader';
export { meta } from './meta';
export { ErrorBoundary } from './ErrorBoundary';

export const Deputados = () => {
  const { pagination, filters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isCarregando = navigation.state === 'loading';

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

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 4, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          mb: 6,
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            Deputados Federais
          </Typography>
          {filters.nome && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              Resultados encontrados para "{filters.nome}"
            </Typography>
          )}
        </Box>
        <DbFiltragemDeputados
          uf={filters.uf}
          partido={filters.siglaPartido}
          handleFilterChange={handleFilterChange}
        />
      </Box>

      {pagination.data.length === 0 ? (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DbEmptyState
            title="Nenhum deputado encontrado"
            description="Tente ajustar os filtros de busca (nome, estado ou partido) para encontrar o parlamentar desejado."
          />
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            opacity: isCarregando ? 0.6 : 1,
            transition: 'opacity 0.2s ease-in-out',
            pointerEvents: isCarregando ? 'none' : 'auto',
          }}
        >
          <Grid
            container
            direction="row"
            rowSpacing={{ xs: 4, sm: 4, md: 6 }}
            columnSpacing={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }}
            sx={{
              justifyContent: 'start',
              alignItems: 'center',
              pb: 4,
              width: '100%',
            }}
          >
            {pagination.data.map((deputado) => (
              <Grid
                key={deputado._id}
                size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <DbCardDeputado deputado={deputado} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            disabled={isCarregando}
          />
        </Box>
      )}
    </Container>
  );
};

export default Deputados;
