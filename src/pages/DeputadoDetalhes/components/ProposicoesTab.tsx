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
  anosDisponiveis?: number[];
  legislatura?: number;
}

export const ProposicoesTab = ({
  id,
  ano,
  resumoProposicoes,
  handleChangeYear,
  anosDisponiveis,
  legislatura,
}: ProposicoesTabProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const datasetProposicoes = formatDatasetProposicoes(resumoProposicoes, ano, isMobile);
  const datasetTipos = formatDatasetTipos(resumoProposicoes, ano);
  const totalAno = resumoProposicoes?.find((r) => r.ano === ano)?.total || 0;

  const anosOpcoes = anosDisponiveis && anosDisponiveis.length > 0
    ? anosDisponiveis
    : (resumoProposicoes && resumoProposicoes.length > 0
      ? resumoProposicoes.map(r => r.ano).sort((a, b) => b - a)
      : [2026, 2025, 2024, 2023]);

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
            {anosOpcoes.map((anoOpcao) => (
              <MenuItem key={anoOpcao} value={anoOpcao}>
                {anoOpcao}
              </MenuItem>
            ))}
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
                      { dataKey: 'pl', label: 'Projetos de Lei', color: '#1976d2' },
                      { dataKey: 'outras', label: 'Outras Proposições', color: '#9c27b0' },
                    ]}
                    height={320}
                    margin={{
                      left: isMobile ? 40 : 50,
                      right: 15,
                      top: 20,
                      bottom: 25,
                    }}
                  />
                </Box>
              ) : (
                <DbEmptyState
                  title="Nenhum dado disponível"
                  description="Selecione outro ano para visualizar o histórico de proposições."
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardHeader title="Distribuição por Tipo de Proposição" />
            <Divider />
            <CardContent sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
              {datasetTipos.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: datasetTipos,
                          innerRadius: 50,
                          outerRadius: 85,
                          paddingAngle: 2,
                          cornerRadius: 4,
                        },
                      ]}
                      colors={PIE_COLORS}
                      height={200}
                      margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      slotProps={{
                        legend: { hidden: true } as any,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      maxHeight: 180,
                      overflowY: 'auto',
                      pr: 0.5,
                    }}
                  >
                    {datasetTipos.map((item, index) => {
                      const color = PIE_COLORS[index % PIE_COLORS.length];
                      const totalTipos = datasetTipos.reduce((acc, curr) => acc + curr.value, 0);
                      const porcentagem = totalTipos > 0
                        ? ((item.value / totalTipos) * 100).toFixed(1)
                        : '0';

                      return (
                        <Box
                          key={item.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 0.75,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: color,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                color: 'text.primary',
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
          legislatura={legislatura}
        />
      </Box>
    </Box>
  );
};
