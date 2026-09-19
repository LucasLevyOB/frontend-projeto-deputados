import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const DbFooter = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Registros consolidados de 2023 até <strong>Maio de 2026</strong>.
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Fonte oficial:{' '}
          <Link
            href="https://dadosabertos.camara.leg.br/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 500,
            }}
          >
            Dados Abertos da Câmara dos Deputados
            <OpenInNewIcon sx={{ fontSize: '0.9rem' }} />
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};
