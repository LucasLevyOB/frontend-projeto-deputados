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
import { BarChart } from '@mui/x-charts';
import { formatCurrency } from '@/utils';

import type { SelectChangeEvent } from '@mui/material';
import type { Deputado } from '@/types';
import type { ResumoGastos } from '@/types/Deputado';

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

export const DeputadoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [deputado, setDeputado] = useState<Deputado | null>(null);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [dataset, setDataset] = useState<{ gastos: number; mes: string }[]>([]);

  const chartSetting = {
    yAxis: [
      {
        label: 'Gastos',
        width: 60,
      },
    ],
    series: [
      {
        dataKey: 'gastos',
        label: 'Gastos',
        valueFormatter: (value: number) => `R$ ${value}`,
      },
    ],
    height: 300,
    margin: { left: 0 },
  };

  const fetchDeputado = async (id: number) => {
    const api = new DepudadosAPI();
    const response = await api.getDeputado(id);

    setDeputado(response[0]);
    setDataset(formatDataset(response[0].resumoGastos, ano));
  };

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    const newYear = Number(event.target.value);
    setAno(newYear);

    if (deputado?.resumoGastos) {
      setDataset(formatDataset(deputado.resumoGastos, newYear));
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

      <Box sx={{ display: 'flex' }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 4,
              alignItems: 'start',
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
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                dataKey: 'mes',
                tickPlacement: 'middle',
                tickLabelPlacement: 'tick',
              },
            ]}
            // yAxis={[{ label: 'Gastos', dataKey: 'gastos' }]}
            series={[{ dataKey: 'gastos', label: 'Gastos' }]}
            height={300}
            width={600}
            margin={{ left: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
};
