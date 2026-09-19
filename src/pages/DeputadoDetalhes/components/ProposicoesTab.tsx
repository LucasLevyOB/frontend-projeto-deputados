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
import { DbVisualizarProposicoes } from '@/components/DbVisualizarProposicoes';
import { DbEmptyState } from '@/components/DbEmptyState';
import type { ResumoProposicoes } from '@/types/Deputado';

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
  '#1976d2',
  '#2e7d32',
  '#ed6c02',
  '#9c27b0',
  '#0288d1',
  '#d32f2f',
  '#795548',
  '#607d8b',
];

const formatDatasetProposicoes = (
  resumoProposicoes: ResumoProposicoes[] | undefined,
  ano: number,
  abreviado: boolean = false
): { pl: number; outras: number; mes: string }[] => {
  if (!resumoProposicoes) return [];
  const listaMeses = abreviado ? mesesAbreviados : mesesCompletos;
  return (
    resumoProposicoes
      .find((resumo) => resumo.ano === ano)
      ?.meses.map(({ mes, projetosDeLei, outrasProposicoes }) => ({
        pl: projetosDeLei,
        outras: outrasProposicoes,
        mes: listaMeses[mes - 1],
      })) || []
  );
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

interface ProposicoesTabProps {
  id: number;
  ano: number;
  resumoProposicoes: ResumoProposicoes[] | undefined;
  handleChangeYear: (event: SelectChangeEvent<number>) => void;
}

export const ProposicoesTab = ({
  id,
  ano,
  resumoProposicoes,
  handleChangeYear,
}: ProposicoesTabProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const datasetProposicoes = formatDatasetProposicoes(resumoProposicoes, ano, isMobile);
  const datasetTipos = formatDatasetTipos(resumoProposicoes, ano);
  const totalAno = resumoProposicoes?.find((r) => r.ano === ano)?.total || 0;

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
            Total de Proposições em {ano}
          </Typography>
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
          >
            {totalAno}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel id="select-ano-proposicoes-label">Ano de Referência</InputLabel>
          <Select
            labelId="select-ano-proposicoes-label"
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
          Os dados referentes ao ano de <strong>2026</strong> contemplam proposições registradas até <strong>Maio de 2026</strong>.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Evolução de Proposições por Mês" />
            <Divider />
            <CardContent
              sx={{ display: 'flex', justifyContent: 'center', pt: 2, px: { xs: 1, sm: 2 } }}
            >
              {datasetProposicoes.length > 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    height: 320,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart
                    dataset={datasetProposicoes}
                    xAxis={[{ dataKey: 'mes', scaleType: 'band' }]}
                    series={[
                      { dataKey: 'pl', label: 'Projetos de Lei', stack: 'total', color: '#1976d2' },
                      { dataKey: 'outras', label: 'Outras', stack: 'total', color: '#9e9e9e' },
                    ]}
                    height={320}
                    margin={{
                      left: isMobile ? 35 : 45,
                      right: 15,
                      top: 20,
                      bottom: 25,
                    }}
                  />
                </Box>
              ) : (
                <DbEmptyState
                  title="Nenhum dado disponível"
                  description={`Este deputado ainda não registrou proposições no ano de ${ano}.`}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Distribuição por Tipo" />
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
              {datasetTipos.length > 0 ? (
                <Box
                  sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <Box sx={{ width: '100%', height: 260, display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                      colors={PIE_COLORS}
                      series={[
                        {
                          data: datasetTipos,
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
                    {datasetTipos.map((item, index) => {
                      const cor = PIE_COLORS[index % PIE_COLORS.length];
                      const porcentagem =
                        totalAno > 0
                          ? ((item.value / totalAno) * 100).toFixed(1)
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
                              {item.value}
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
                  title="Nenhum dado disponível"
                  description="Selecione outro ano para visualizar os tipos de proposição."
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Detalhamento das Proposições
        </Typography>
        <DbVisualizarProposicoes
          id={id}
          resumoProposicoes={resumoProposicoes}
          ano={ano}
        />
      </Box>
    </Box>
  );
};
