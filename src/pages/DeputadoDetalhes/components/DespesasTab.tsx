import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { DbVisualizarDespesas } from '@/components/DbVisualizarDespesas';
import { DbEmptyState } from '@/components/DbEmptyState';
import { formatCurrency } from '@/utils';
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
  resumoGastos: ResumoGastos[] | undefined,
  ano: number
): { gastos: number; mes: string }[] => {
  if (!resumoGastos) return [];
  return (
    resumoGastos
      .find((resumo) => resumo.ano === ano)
      ?.meses.map(({ mes, totalGasto }) => ({
        gastos: totalGasto,
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

const getGastosTotaisAno = (
  ano: number,
  resumoGastos: ResumoGastos[] | undefined
) => {
  if (!resumoGastos) return formatCurrency(0);

  const gastos = resumoGastos
    .find((resumo) => resumo.ano === ano)
    ?.meses.reduce((acc, mes) => acc + mes.totalGasto, 0);

  return formatCurrency(gastos ?? 0);
};

interface DespesasTabProps {
  id: number;
  ano: number;
  resumoGastos: ResumoGastos[] | undefined;
  handleChangeYear: (event: SelectChangeEvent<number>) => void;
}

export const DespesasTab = ({
  id,
  ano,
  resumoGastos,
  handleChangeYear,
}: DespesasTabProps) => {
  const dataset = formatDataset(resumoGastos, ano);
  const datasetCategorias = formatDatasetCategorias(resumoGastos, ano);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Filtro e Total */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase' }}
          >
            Gastos Totais no Ano
          </Typography>
          <Typography
            variant="h4"
            color="error.main"
            sx={{ fontWeight: 'bold' }}
          >
            {getGastosTotaisAno(ano, resumoGastos)}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="select-ano-despesas-label">Ano de Referência</InputLabel>
          <Select
            labelId="select-ano-despesas-label"
            value={ano}
            label="Ano de Referência"
            onChange={handleChangeYear}
          >
            <MenuItem value={2026}>2026</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Histórico de Gastos por Mês" />
            <Divider />
            <CardContent
              sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}
            >
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <BarChart
                  dataset={dataset}
                  xAxis={[{ dataKey: 'mes', scaleType: 'band' }]}
                  series={[
                    { dataKey: 'gastos', label: 'Gastos', color: '#f44336' },
                  ]}
                  height={350}
                  width={600}
                  margin={{ left: 80, right: 20, top: 20, bottom: 30 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Gastos por Categoria" />
            <Divider />
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100% - 65px)',
              }}
            >
              {datasetCategorias.length > 0 ? (
                <Box
                  sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <PieChart
                    series={[
                      {
                        data: datasetCategorias,
                        innerRadius: 40,
                        outerRadius: 120,
                        paddingAngle: 2,
                        cornerRadius: 4,
                      },
                    ]}
                    height={350}
                    width={400}
                    slotProps={{
                      legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              ) : (
                <DbEmptyState
                  title="Nenhum dado disponível"
                  description="Selecione outro ano para visualizar os gastos por categoria."
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Despesas */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Detalhamento das Despesas
        </Typography>
        <DbVisualizarDespesas id={id} resumoGastos={resumoGastos} ano={ano} />
      </Box>
    </Box>
  );
};
