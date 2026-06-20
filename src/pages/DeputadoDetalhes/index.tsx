import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Chip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import DepudadosAPI from '@/services/DepudadosAPI';
import type { SelectChangeEvent } from '@mui/material';
import type { Deputado } from '@/types';

import { VisaoGeralTab } from './components/VisaoGeralTab';
import { DespesasTab } from './components/DespesasTab';
import { ProposicoesTab } from './components/ProposicoesTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const DeputadoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [deputado, setDeputado] = useState<Deputado | null>(null);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [tabValue, setTabValue] = useState(0);

  const fetchDeputado = async (id: number) => {
    const api = new DepudadosAPI();
    const response = await api.getDeputado(id);
    setDeputado(response[0]);
  };

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    setAno(Number(event.target.value));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (id) {
      fetchDeputado(Number(id));
    }
  }, [id]);

  if (!deputado) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Carregando dados do deputado...</Box>;
  }

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
      <Paper
        variant='outlined'
        sx={{
          width: '100%',
          p: 4,
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
            gap: 4,
          }}
        >
          <Avatar
            src={deputado.urlFoto}
            alt={'Foto de ' + deputado.nome}
            sx={{
              width: 160,
              height: 160,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              border: '4px solid white',
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
            <Typography variant="h3" sx={{ fontWeight: '800', letterSpacing: '-0.5px' }}>
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
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Nome Eleitoral:</strong> {deputado.nomeEleitoral}
              </Typography>
            )}

            {deputado.estatisticas?.temasProposicoes && deputado.estatisticas.temasProposicoes.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 1 }}>
                {deputado.estatisticas.temasProposicoes
                  .slice(0, 3)
                  .map((temaObj, index) => (
                    <Chip
                      key={index}
                      label={temaObj.tema}
                      color="primary"
                      size="small"
                      variant="filled"
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
          >
            <Tab label="Visão Geral" {...a11yProps(0)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
            <Tab label="Cota Parlamentar" {...a11yProps(1)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
            <Tab label="Proposições" {...a11yProps(2)} sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <VisaoGeralTab deputado={deputado} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <DespesasTab
            id={Number(id)}
            ano={ano}
            resumoGastos={deputado.resumoGastos}
            handleChangeYear={handleChangeYear}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <ProposicoesTab
            id={Number(id)}
            ano={ano}
            resumoProposicoes={deputado.resumoProposicoes}
            handleChangeYear={handleChangeYear}
          />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};
