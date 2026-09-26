import {
  Box,
  Paper,
  Grid,
  Card,
  Divider,
  Button,
  Skeleton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const DeputadoDetalhesSkeleton = () => {
  const statCardIndexes = [0, 1, 2, 3, 4, 5];
  const presencaIndexes = [0, 1, 2, 3];
  const temaWidths = [90, 120, 100, 75, 110, 85, 95];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto',
        gap: 3,
        mb: 8,
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: -1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/deputados"
          color="inherit"
          variant="text"
        >
          Voltar
        </Button>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 2.5, sm: 4 },
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: { xs: 110, sm: 160 },
              height: { xs: 110, sm: 160 },
              flexShrink: 0,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              alignItems: { xs: 'center', sm: 'flex-start' },
              textAlign: { xs: 'center', sm: 'left' },
              flex: 1,
              width: '100%',
            }}
          >
            <Skeleton
              variant="text"
              sx={{
                fontSize: { xs: '1.6rem', sm: '2.4rem' },
                width: { xs: '80%', sm: 340 },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Skeleton variant="rounded" width={90} height={32} />
              <Skeleton variant="rounded" width={80} height={32} />
            </Box>

            <Skeleton variant="text" width={220} height={24} />

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                mt: 0.5,
              }}
            >
              <Skeleton variant="rounded" width={70} height={24} />
              <Skeleton variant="rounded" width={85} height={24} />
              <Skeleton variant="rounded" width={65} height={24} />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: { xs: 2, sm: 4 },
            pb: 1.5,
            overflowX: 'hidden',
          }}
        >
          <Skeleton variant="text" width={110} height={36} />
          <Skeleton variant="text" width={140} height={36} />
          <Skeleton variant="text" width={110} height={36} />
          <Skeleton variant="text" width={90} height={36} />
        </Box>

        <Grid container spacing={3} sx={{ pt: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1, p: 2.5 }}>
              <Skeleton variant="text" width={140} height={32} sx={{ mb: 1 }} />
              <Divider sx={{ mb: 2 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width={100} height={20} sx={{ mt: 1, mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="circular" width={36} height={36} />
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1, p: 2.5 }}>
              <Skeleton variant="text" width={100} height={32} sx={{ mb: 1 }} />
              <Divider sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="55%" height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1.5 }} />
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Skeleton variant="text" width={220} height={36} sx={{ mt: 2, mb: 2 }} />
            <Grid container spacing={2}>
              {statCardIndexes.map((index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1, minHeight: 90 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={36} sx={{ mt: 1 }} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Skeleton variant="text" width={200} height={36} sx={{ mt: 2, mb: 2 }} />
            <Grid container spacing={2}>
              {presencaIndexes.map((index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1, minHeight: 90 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="50%" height={36} sx={{ mt: 1 }} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Skeleton variant="text" width={240} height={36} sx={{ mt: 2, mb: 2 }} />
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {temaWidths.map((width, index) => (
                  <Skeleton key={index} variant="rounded" width={width} height={32} />
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
