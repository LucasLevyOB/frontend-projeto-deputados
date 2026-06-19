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
import { DbVisualizarProposicoes } from '@/components/DbVisualizarProposicoes';
import { DbEmptyState } from '@/components/DbEmptyState';
import type { ResumoProposicoes } from '@/types/Deputado';

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
  const datasetProposicoes = formatDatasetProposicoes(resumoProposicoes, ano);
  const datasetTipos = formatDatasetTipos(resumoProposicoes, ano);

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
            Total de Proposições em {ano}
          </Typography>
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ fontWeight: 'bold' }}
          >
            {resumoProposicoes?.find((r) => r.ano === ano)?.totalProposicoes || 0}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="select-ano-proposicoes-label">Ano de Referência</InputLabel>
          <Select
            labelId="select-ano-proposicoes-label"
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
            <CardHeader title="Evolução de Proposições por Mês" />
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
                  dataset={datasetProposicoes}
                  xAxis={[{ dataKey: 'mes', scaleType: 'band' }]}
                  series={[
                    { dataKey: 'pl', label: 'Projetos de Lei', stack: 'total', color: '#1976d2' },
                    { dataKey: 'outras', label: 'Outras', stack: 'total', color: '#9e9e9e' },
                  ]}
                  height={350}
                  width={600}
                  margin={{ left: 40, right: 20, top: 20, bottom: 30 }}
                />
              </Box>
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
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100% - 65px)',
              }}
            >
              {datasetTipos.length > 0 ? (
                <Box
                  sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <PieChart
                    series={[
                      {
                        data: datasetTipos,
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
                  description="Selecione outro ano para visualizar os tipos de proposição."
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Proposições */}
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
