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
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { DbVisualizarDespesas } from '@/components/DbVisualizarDespesas';
import { DbEmptyState } from '@/components/DbEmptyState';
import { formatCurrency } from '@/utils';
import type { ResumoGastos } from '@/types/Deputado';

const mesesCompletos = [
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

const mesesAbreviados = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const PIE_COLORS = [
  '#2E96FF',
  '#02B2AF',
  '#FF9800',
  '#F44336',
  '#9C27B0',
  '#4CAF50',
  '#FF5722',
  '#607D8B',
];

const formatDataset = (
  resumoGastos: ResumoGastos[] | undefined,
  ano: number,
  abreviado: boolean = false
): { gastos: number; mes: string }[] => {
  if (!resumoGastos) return [];
  const listaMeses = abreviado ? mesesAbreviados : mesesCompletos;
  return (
    resumoGastos
      .find((resumo) => resumo.ano === ano)
      ?.meses.map(({ mes, totalGasto }) => ({
        gastos: totalGasto,
        mes: listaMeses[mes - 1],
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dataset = formatDataset(resumoGastos, ano, isMobile);
  const datasetCategorias = formatDatasetCategorias(resumoGastos, ano);
  const totalGastosAno = datasetCategorias.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
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
            sx={{ textTransform: 'uppercase', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Gastos Totais no Ano
          </Typography>
          <Typography
            variant="h4"
            color="error.main"
            sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
          >
            {getGastosTotaisAno(ano, resumoGastos)}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel id="select-ano-despesas-label">Ano de Referência</InputLabel>
          <Select
            labelId="select-ano-despesas-label"
            value={ano}
            label="Ano de Referência"
            size="small"
            onChange={handleChangeYear}
          >
            <MenuItem value={2026}>2026</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {ano === 2026 && (
        <Alert severity="info" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          Os dados referentes ao ano de <strong>2026</strong> contemplam despesas registradas e processadas até <strong>Maio de 2026</strong>.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Histórico de Gastos por Mês" />
            <Divider />
            <CardContent
              sx={{ display: 'flex', justifyContent: 'center', pt: 2, px: { xs: 1, sm: 2 } }}
            >
              {dataset.length > 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    height: 320,
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
                    height={320}
                    margin={{
                      left: isMobile ? 65 : 80,
                      right: 15,
                      top: 20,
                      bottom: 25,
                    }}
                  />
                </Box>
              ) : (
                <DbEmptyState
                  title="Não existem gastos para o ano selecionado."
                  description={`Este deputado ainda não registrou gastos no ano de ${ano}.`}
                />
              )}
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
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                pt: 2,
                px: { xs: 1.5, sm: 2 },
              }}
            >
              {datasetCategorias.length > 0 ? (
                <Box
                  sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <Box sx={{ width: '100%', height: 260, display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                      colors={PIE_COLORS}
                      series={[
                        {
                          data: datasetCategorias,
                          innerRadius: 45,
                          outerRadius: 100,
                          paddingAngle: 2,
                          cornerRadius: 4,
                        },
                      ]}
                      height={260}
                      hideLegend={true}
                    />
                  </Box>

                  <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {datasetCategorias.map((item, index) => {
                      const cor = PIE_COLORS[index % PIE_COLORS.length];
                      const porcentagem =
                        totalGastosAno > 0
                          ? ((item.value / totalGastosAno) * 100).toFixed(1)
                          : '0';

                      return (
                        <Box
                          key={item.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            py: 0.75,
                            px: 1.5,
                            borderRadius: 1.5,
                            bgcolor: 'action.hover',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: cor,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.825rem' },
                                lineHeight: 1.25,
                                wordBreak: 'break-word',
                              }}
                            >
                              {item.label}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                fontSize: { xs: '0.75rem', sm: '0.825rem' },
                              }}
                            >
                              {formatCurrency(item.value)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: '0.7rem' }}
                            >
                              {porcentagem}%
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <DbEmptyState
                  title="Não existem gastos para o ano selecionado."
                  description={`Este deputado ainda não registrou gastos no ano de ${ano}.`}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Detalhamento da Cota Parlamentar
        </Typography>
        <DbVisualizarDespesas id={id} resumoGastos={resumoGastos} ano={ano} />
      </Box>
    </Box>
  );
};
