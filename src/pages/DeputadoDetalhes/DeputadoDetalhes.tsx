import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
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
import { useLegislatura } from '@/contexts/legislatura';
import { getAnosByLegislatura, getLegislaturaLabel, LEGISLATURAS_DISPONIVEIS } from '@/utils';

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
  const { deputado, legislatura: legislaturaLoader } = useLoaderData<typeof loader>();
  const { legislatura: legislaturaContext, setLegislatura } = useLegislatura();
  const legislaturaAtiva = legislaturaLoader ?? legislaturaContext;

  const anosLegislatura = getAnosByLegislatura(legislaturaAtiva).sort((a, b) => b - a);

  const [ano, setAno] = useState<number>(anosLegislatura[0]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setAno(anosLegislatura[0]);
  }, [legislaturaAtiva]);

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    setAno(Number(event.target.value));
  };

  const handleChangeLegislatura = (event: SelectChangeEvent<number>) => {
    setLegislatura(Number(event.target.value));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const legislaturasOpcoes = Array.from(new Set([
    ...(deputado.legislaturasDisponiveis ?? []),
    ...LEGISLATURAS_DISPONIVEIS.map(l => l.id),
    legislaturaAtiva
  ])).sort((a, b) => b - a);

  const possuiMandatoNaLegislatura =
    !deputado.legislaturasDisponiveis ||
    deputado.legislaturasDisponiveis.length === 0 ||
    deputado.legislaturasDisponiveis.includes(legislaturaAtiva);

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
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={`/deputados?legislatura=${legislaturaAtiva}`}
          color="inherit"
          variant="text"
        >
          Voltar
        </Button>
        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel id="select-legislatura-detalhes-label">Legislatura</InputLabel>
          <Select
            labelId="select-legislatura-detalhes-label"
            value={legislaturaAtiva}
            label="Legislatura"
            onChange={handleChangeLegislatura}
          >
            {legislaturasOpcoes.map((legId) => (
              <MenuItem key={legId} value={legId}>
                {getLegislaturaLabel(legId)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!possuiMandatoNaLegislatura && deputado.legislaturasDisponiveis && (
        <Alert
          severity="warning"
          sx={{ width: '100%', borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setLegislatura(deputado.legislaturasDisponiveis![0])}
            >
              Ver {deputado.legislaturasDisponiveis[0]}ª Legislatura
            </Button>
          }
        >
          Este parlamentar não possui registro de mandato na{' '}
          <strong>{getLegislaturaLabel(legislaturaAtiva)}</strong>.
        </Alert>
      )}

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
              <Chip
                label={getLegislaturaLabel(legislaturaAtiva)}
                color="secondary"
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
            anosDisponiveis={anosLegislatura}
            legislatura={legislaturaAtiva}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <ProposicoesTab
            id={deputado._id}
            ano={ano}
            resumoProposicoes={deputado.resumoProposicoes}
            handleChangeYear={handleChangeYear}
            anosDisponiveis={anosLegislatura}
            legislatura={legislaturaAtiva}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={3}>
          <VotacoesTab id={deputado._id} legislatura={legislaturaAtiva} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default DeputadoDetalhes;
