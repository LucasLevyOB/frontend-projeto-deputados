import { useState, type Dispatch, type SetStateAction } from 'react';
import { Box, Typography } from '@mui/material';
import { DbEmptyState } from '@/components/DbEmptyState';
import DepudadosAPI from '@/services/DepudadosAPI';
import { DeputadoSelectorCard } from './components/DeputadoSelectorCard';
import { ComparacaoGeral } from './components/ComparacaoGeral';
import { ComparacaoGastos } from './components/ComparacaoGastos';
import { ComparacaoTemas } from './components/ComparacaoTemas';
import { ComparacaoVotacoes } from './components/ComparacaoVotacoes';
import type { Deputado, DeputadoResumo } from '@/types';

export const ComparacaoDeputados = () => {
  const [deputado1, setDeputado1] = useState<Deputado | null>(null);
  const [deputado2, setDeputado2] = useState<Deputado | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const carregarDetalhesDeputado = async (
    deputadoBasico: DeputadoResumo,
    setDeputado: Dispatch<SetStateAction<Deputado | null>>,
    setLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setLoading(true);
    try {
      const api = new DepudadosAPI();
      const resposta = await api.getDeputado(deputadoBasico._id);
      if (Array.isArray(resposta) && resposta.length > 0) {
        setDeputado(resposta[0]);
      } else if (resposta && typeof resposta === 'object') {
        setDeputado(resposta as Deputado);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes completos do deputado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDeputado1 = (dep: DeputadoResumo) => {
    carregarDetalhesDeputado(dep, setDeputado1, setLoading1);
  };

  const handleSelectDeputado2 = (dep: DeputadoResumo) => {
    carregarDetalhesDeputado(dep, setDeputado2, setLoading2);
  };

  const handleClearDeputado1 = () => {
    setDeputado1(null);
  };

  const handleClearDeputado2 = () => {
    setDeputado2(null);
  };

  const nenhumSelecionado = !deputado1 && !deputado2;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        px: { xs: 2, sm: 4 },
        py: 4,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center',
          letterSpacing: '-0.3px',
        }}
      >
        Comparação de Deputados (2023-2026)
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 4, sm: 5, md: 6 },
          width: '100%',
          mb: 5,
        }}
      >
        <DeputadoSelectorCard
          deputado={deputado1}
          onSelect={handleSelectDeputado1}
          onClear={handleClearDeputado1}
          loading={loading1}
        />

        <DeputadoSelectorCard
          deputado={deputado2}
          onSelect={handleSelectDeputado2}
          onClear={handleClearDeputado2}
          loading={loading2}
        />
      </Box>

      {nenhumSelecionado ? (
        <Box sx={{ mt: 4 }}>
          <DbEmptyState
            title="Os deputados ainda não foram selecionados."
            description="Por favor, selecione os deputados para a comparação."
          />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <ComparacaoGeral deputado1={deputado1} deputado2={deputado2} />
          <ComparacaoGastos deputado1={deputado1} deputado2={deputado2} />
          <ComparacaoTemas deputado1={deputado1} deputado2={deputado2} />
          <ComparacaoVotacoes deputado1={deputado1} deputado2={deputado2} />
        </Box>
      )}
    </Box>
  );
};

export default ComparacaoDeputados;
