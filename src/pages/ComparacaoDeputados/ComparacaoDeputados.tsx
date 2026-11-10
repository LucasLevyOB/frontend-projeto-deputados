import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { DbEmptyState } from '@/components/DbEmptyState';
import DepudadosAPI from '@/services/DepudadosAPI';
import { DeputadoSelectorCard } from './components/DeputadoSelectorCard';
import { ComparacaoGeral } from './components/ComparacaoGeral';
import { ComparacaoGastos } from './components/ComparacaoGastos';
import { ComparacaoTemas } from './components/ComparacaoTemas';
import { ComparacaoVotacoes } from './components/ComparacaoVotacoes';
import { useLegislatura } from '@/contexts/legislatura';
import { LEGISLATURAS_DISPONIVEIS, getLegislaturaLabel } from '@/utils';
import type { Deputado, DeputadoResumo } from '@/types';

export const ComparacaoDeputados = () => {
  const { legislatura, setLegislatura } = useLegislatura();
  const [deputado1, setDeputado1] = useState<Deputado | null>(null);
  const [deputado2, setDeputado2] = useState<Deputado | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const ultimaLegislaturaRef = useRef(legislatura);

  const carregarDetalhesDeputado = async (
    deputadoBasico: Pick<DeputadoResumo, '_id'>,
    setDeputado: Dispatch<SetStateAction<Deputado | null>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    leg: number = legislatura
  ) => {
    setLoading(true);
    try {
      const api = new DepudadosAPI();
      const resposta = await api.getDeputado(deputadoBasico._id, leg);
      if (Array.isArray(resposta) && resposta.length > 0) {
        setDeputado(resposta[0]);
      } else if (resposta && !Array.isArray(resposta)) {
        setDeputado(resposta as unknown as Deputado);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes completos do deputado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ultimaLegislaturaRef.current === legislatura) return;
    ultimaLegislaturaRef.current = legislatura;

    if (deputado1) {
      carregarDetalhesDeputado(deputado1, setDeputado1, setLoading1, legislatura);
    }
    if (deputado2) {
      carregarDetalhesDeputado(deputado2, setDeputado2, setLoading2, legislatura);
    }
  }, [legislatura]);

  const handleChangeLegislatura = (event: SelectChangeEvent<number>) => {
    setLegislatura(Number(event.target.value));
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: { xs: 'center', sm: 'left' },
            letterSpacing: '-0.3px',
          }}
        >
          Comparação de Deputados ({getLegislaturaLabel(legislatura)})
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="select-legislatura-comparar-label">Legislatura</InputLabel>
          <Select
            labelId="select-legislatura-comparar-label"
            value={legislatura}
            label="Legislatura"
            onChange={handleChangeLegislatura}
          >
            {LEGISLATURAS_DISPONIVEIS.map((leg) => (
              <MenuItem key={leg.id} value={leg.id}>
                {leg.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          position: { xs: 'sticky', sm: 'static' },
          top: { xs: 68, sm: 'auto' },
          zIndex: 10,
          bgcolor: 'background.default',
          py: { xs: 0, sm: 2 },
          pt: { xs: .5, sm: 2 },
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 4, md: 6 },
          width: '100%',
          mb: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ flex: 1, maxWidth: 380, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <DeputadoSelectorCard
            deputado={deputado1}
            onSelect={handleSelectDeputado1}
            onClear={handleClearDeputado1}
            loading={loading1}
          />
        </Box>

        <Box sx={{ flex: 1, maxWidth: 380, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <DeputadoSelectorCard
            deputado={deputado2}
            onSelect={handleSelectDeputado2}
            onClear={handleClearDeputado2}
            loading={loading2}
          />
        </Box>
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
          <ComparacaoVotacoes
            deputado1={deputado1}
            deputado2={deputado2}
            legislatura={legislatura}
          />
        </Box>
      )}
    </Box>
  );
};

export default ComparacaoDeputados;
