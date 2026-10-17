import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Link,
  useLoaderData,
} from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VisaoGeralTab } from './components/VisaoGeralTab';
import { DespesasTab } from './components/DespesasTab';
import { ProposicoesTab } from './components/ProposicoesTab';
import { VotacoesTab } from './components/VotacoesTab';
import { CustomTabPanel } from './components/CustomTabPanel';

import type { SelectChangeEvent } from '@mui/material';
import type { loader } from './loader';

export { loader } from './loader';
export { meta } from './meta';
export { ErrorBoundary } from './ErrorBoundary';

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const DeputadoDetalhes = () => {
  const { deputado } = useLoaderData<typeof loader>();
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [tabValue, setTabValue] = useState(0);

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    setAno(Number(event.target.value));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
          to='/deputados'
          color="inherit"
          variant="text"
        >
          Voltar
        </Button>
      </Box>

      <Paper
        variant='outlined'
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
          <Avatar
            src={deputado.urlFoto}
            alt={'Foto de ' + deputado.nome}
            sx={{
              width: { xs: 110, sm: 160 },
              height: { xs: 110, sm: 160 },
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              border: { xs: '3px solid white', sm: '4px solid white' },
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
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: { xs: '1.6rem', sm: '2.4rem' },
                fontWeight: '800',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              {deputado.nome}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip
                label={`${deputado.siglaPartido} - ${deputado.siglaUf}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
              {deputado.situacao && (
                <Chip
                  label={deputado.situacao}
                  color={deputado.situacao === 'Exercício' ? 'success' : 'default'}
                />
              )}
            </Box>

            {deputado.nomeEleitoral && deputado.nomeEleitoral !== deputado.nome && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                <strong>Nome Eleitoral:</strong> {deputado.nomeEleitoral}
              </Typography>
            )}

            {deputado.estatisticas?.temasProposicoes && deputado.estatisticas.temasProposicoes.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 0.5 }}>
                {deputado.estatisticas.temasProposicoes
                  .slice(0, 3)
                  .map((temaObj, index) => (
                    <Chip
                      key={index}
                      label={temaObj.tema}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'divider', bgcolor: 'background.paper', fontWeight: 500 }}
                    />
                  ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="abas do deputado"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Visão Geral" {...a11yProps(0)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
            <Tab label="Cota Parlamentar" {...a11yProps(1)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
            <Tab label="Proposições" {...a11yProps(2)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
            <Tab label="Votações" {...a11yProps(3)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <VisaoGeralTab deputado={deputado} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <DespesasTab
            id={deputado._id}
            ano={ano}
            resumoGastos={deputado.resumoGastos}
            handleChangeYear={handleChangeYear}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <ProposicoesTab
            id={deputado._id}
            ano={ano}
            resumoProposicoes={deputado.resumoProposicoes}
            handleChangeYear={handleChangeYear}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={3}>
          <VotacoesTab id={deputado._id} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default DeputadoDetalhes;
