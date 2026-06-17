import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import DepudadosAPI from '@/services/DepudadosAPI';
import { BarChart, PieChart } from '@mui/x-charts';
import { formatCurrency } from '@/utils';
import { DbVisualizarDespesas } from '@/components/DbVisualizarDespesas';

import type { SelectChangeEvent } from '@mui/material';
import type { Deputado } from '@/types';
import type { ResumoGastos, ResumoProposicoes } from '@/types/Deputado';

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const formatDataset = (
  resumoGastos: ResumoGastos[],
  ano: number
): { gastos: number; mes: string }[] => {
  return (
    resumoGastos
      .find((resumo) => resumo.ano === ano)
      ?.meses.map(({ mes, totalGasto }) => ({
        gastos: totalGasto,
        mes: meses[mes - 1],
      })) || []
  );
};

const formatDatasetProposicoes = (
  resumoProposicoes: ResumoProposicoes[] | undefined,
  ano: number
): { pl: number; outras: number; mes: string }[] => {
  if (!resumoProposicoes) return [];
  return (
    resumoProposicoes
      .find((resumo) => resumo.ano === ano)
      ?.meses.map(({ mes, projetosDeLei, outrasProposicoes }) => ({
        pl: projetosDeLei,
        outras: outrasProposicoes,
        mes: meses[mes - 1],
      })) || []
  );
};

const formatDatasetCategorias = (
  resumoGastos: ResumoGastos[] | undefined,
  ano: number
): { id: number; value: number; label: string }[] => {
  if (!resumoGastos) return [];
  const categorias =
    resumoGastos.find((resumo) => resumo.ano === ano)?.categorias || [];
  return categorias.map((c, index) => ({
    id: index,
    value: c.totalGasto,
    label: c.descricao,
  }));
};

const formatDatasetTipos = (
  resumoProposicoes: ResumoProposicoes[] | undefined,
  ano: number
): { id: number; value: number; label: string }[] => {
  if (!resumoProposicoes) return [];
  const tipos =
    resumoProposicoes.find((resumo) => resumo.ano === ano)?.tipos || [];
  return tipos.map((t, index) => ({
    id: index,
    value: t.quantidade,
    label: t.siglaTipo + ' - ' + t.descricaoTipo,
  }));
};

export const DeputadoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [deputado, setDeputado] = useState<Deputado | null>(null);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [dataset, setDataset] = useState<{ gastos: number; mes: string }[]>([]);
  const [datasetCategorias, setDatasetCategorias] = useState<
    { id: number; value: number; label: string }[]
  >([]);
  const [datasetProposicoes, setDatasetProposicoes] = useState<
    { pl: number; outras: number; mes: string }[]
  >([]);
  const [datasetTipos, setDatasetTipos] = useState<
    { id: number; value: number; label: string }[]
  >([]);

  const fetchDeputado = async (id: number) => {
    const api = new DepudadosAPI();
    const response = await api.getDeputado(id);

    setDeputado(response[0]);
    setDataset(formatDataset(response[0].resumoGastos, ano));
    setDatasetCategorias(
      formatDatasetCategorias(response[0].resumoGastos, ano)
    );
    setDatasetProposicoes(
      formatDatasetProposicoes(response[0].resumoProposicoes, ano)
    );
    setDatasetTipos(formatDatasetTipos(response[0].resumoProposicoes, ano));
  };

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    const newYear = Number(event.target.value);
    setAno(newYear);

    if (deputado?.resumoGastos) {
      setDataset(formatDataset(deputado.resumoGastos, newYear));
      setDatasetCategorias(
        formatDatasetCategorias(deputado.resumoGastos, newYear)
      );
    }
    if (deputado?.resumoProposicoes) {
      setDatasetProposicoes(
        formatDatasetProposicoes(deputado.resumoProposicoes, newYear)
      );
      setDatasetTipos(formatDatasetTipos(deputado.resumoProposicoes, newYear));
    }
  };

  const getGastosTotaisAno = (
    ano: number,
    resumoGastos: ResumoGastos[] | undefined
  ) => {
    if (!resumoGastos) return 0;

    const gastos = resumoGastos
      .find((resumo) => resumo.ano === ano)
      ?.meses.reduce((acc, mes) => acc + mes.totalGasto, 0);

    return formatCurrency(gastos ?? 0);
  };

  useEffect(() => {
    if (id) {
      fetchDeputado(Number(id));
    }
  }, [id]);

  if (!deputado) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box>
          <img src={deputado.urlFoto} alt={deputado.nome} />
        </Box>
        <Box>
          <Typography variant="h4">{deputado.nome}</Typography>
          <Typography variant="h6">
            {deputado.siglaPartido} - {deputado.siglaUf}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 4,
            alignItems: 'start',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1">Gastos Totais no Ano: </Typography>
            <Typography variant="h5">
              {getGastosTotaisAno(ano, deputado.resumoGastos)}
            </Typography>
          </Box>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Ano</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ano}
              label="Ano"
              onChange={handleChangeYear}
            >
              <MenuItem value={2026}>2026</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
          }}
        >
          <Box>
            <BarChart
              dataset={dataset}
              xAxis={[
                {
                  dataKey: 'mes',
                  tickPlacement: 'middle',
                  tickLabelPlacement: 'tick',
                  scaleType: 'band',
                },
              ]}
              series={[{ dataKey: 'gastos', label: 'Gastos' }]}
              height={300}
              width={550}
              margin={{ left: 0 }}
            />
          </Box>
          <Box>
            <BarChart
              dataset={datasetProposicoes}
              xAxis={[
                {
                  dataKey: 'mes',
                  tickPlacement: 'middle',
                  tickLabelPlacement: 'tick',
                  scaleType: 'band',
                },
              ]}
              series={[
                { dataKey: 'pl', label: 'Projetos de Lei', stack: 'total' },
                { dataKey: 'outras', label: 'Outras', stack: 'total' },
              ]}
              height={300}
              width={550}
              margin={{ left: 0 }}
            />
          </Box>
          {datasetTipos.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Tipos de Proposição</Typography>
              <PieChart
                series={[
                  {
                    data: datasetTipos,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  },
                ]}
                height={300}
                width={400}
              />
            </Box>
          )}
          {(datasetCategorias.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Gastos por Categoria</Typography>
              <PieChart
                series={[
                  {
                    data: datasetCategorias,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  },
                ]}
                height={300}
                width={400}
              />
            </Box>
          )) || <Box>Sem dados</Box>}
        </Box>

        <DbVisualizarDespesas
          id={Number(id)}
          resumoGastos={deputado.resumoGastos}
          ano={ano}
        />
      </Box>
    </Box>
  );
};
