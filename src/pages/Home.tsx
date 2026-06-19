import { Box, Button, Container, Grid, Typography, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GavelIcon from '@mui/icons-material/Gavel';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldIcon from '@mui/icons-material/Shield';

export const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleExploreClick = () => {
    navigate('/deputados');
  };

  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: 'Busca Detalhada',
      description: 'Encontre deputados federais por nome, partido ou estado de forma rápida e intuitiva.'
    },
    {
      icon: <ReceiptLongIcon fontSize="large" color="primary" />,
      title: 'Transparência de Gastos',
      description: 'Acompanhe os gastos da Cota para o Exercício da Atividade Parlamentar (CEAP) em detalhes.'
    },
    {
      icon: <GavelIcon fontSize="large" color="primary" />,
      title: 'Proposições Legislativas',
      description: 'Veja os projetos de lei, ementas e a atuação legislativa de cada deputado.'
    },
    {
      icon: <BarChartIcon fontSize="large" color="primary" />,
      title: 'Análise de Dados',
      description: 'Visualize gráficos e informações sumarizadas sobre o desempenho e os gastos.'
    }
  ];

  const steps = [
    { number: '1', title: 'Pesquise', desc: 'Encontre o deputado que você deseja acompanhar.' },
    { number: '2', title: 'Analise', desc: 'Explore os dados de gastos e as proposições feitas.' },
    { number: '3', title: 'Fiscalize', desc: 'Use as informações para exercer seu papel cidadão.' },
  ];

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'primary.main',
          color: theme.palette.mode === 'dark' ? 'text.primary' : 'primary.contrastText',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: { xs: 0, md: '0 0 40px 40px' },
          mb: 8
        }}
      >
        <Container maxWidth="md">
          <ShieldIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, fontWeight: 'bold' }}>
            Depudados - Transparência e Acompanhamento Legislativo
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9, fontWeight: 300, lineHeight: 1.6 }}>
            Nossa plataforma facilita o acesso aos dados públicos da Câmara dos Deputados. 
            Fiscalize gastos, acompanhe projetos e fortaleça o controle social de forma simples e direta.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            size="large" 
            onClick={handleExploreClick}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              borderRadius: '30px',
              textTransform: 'none',
              boxShadow: 4,
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          >
            Explorar Deputados
          </Button>
        </Container>
      </Box>

      {/* Motivação Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
              Por que usar esta plataforma?
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
              O controle social é fundamental para a democracia.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Compreender como os recursos públicos estão sendo utilizados e quais propostas estão 
              sendo debatidas em Brasília nem sempre é uma tarefa fácil para o cidadão comum.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              O Projeto Depudados nasceu para traduzir o grande volume de dados abertos da Câmara em 
              informações claras e acessíveis, permitindo que você acompanhe de perto o trabalho dos seus representantes.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.default', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {steps.map((step) => (
                  <Box key={step.number} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'primary.contrastText',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      {step.number}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{step.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Funcionalidades Section */}
      <Box sx={{ bgcolor: 'background.default', py: 10, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold'}}>
              O que você encontra aqui
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'regular'}}>
              Tudo o que você precisa para avaliar a atuação parlamentar.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 4,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box sx={{ mb: 2, p: 2, borderRadius: '50%', bgcolor: 'action.hover' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
