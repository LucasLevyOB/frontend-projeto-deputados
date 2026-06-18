import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import DepudadosAPI from '@/services/DepudadosAPI';
import { BarChart, PieChart } from '@mui/x-charts';
import { formatCurrency } from '@/utils';
import { DbVisualizarDespesas } from '@/components/DbVisualizarDespesas';
import { DbVisualizarProposicoes } from '@/components/DbVisualizarProposicoes';

import type { SelectChangeEvent } from '@mui/material';
import type { Deputado } from '@/types';
import type { ResumoGastos, ResumoProposicoes } from '@/types/Deputado';
import { DbEmptyState } from '@/components/DbEmptyState';

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
          mt: 2,
        }}
      >
        <Paper elevation={0} sx={{ mr: '16px' }}>
          <Box
            src={deputado.urlFoto}
            alt={'Foto de ' + deputado.nome}
            component="img"
            sx={{
              width: 196,
              borderRadius: '8px',
            }}
          />
        </Paper>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {deputado.nome}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {deputado.siglaPartido} - {deputado.siglaUf}
            </Typography>
            {deputado.situacao && (
              <Chip
                label={deputado.situacao}
                color={
                  deputado.situacao === 'Exercício' ? 'success' : 'default'
                }
                size="small"
              />
            )}
          </Box>
          {deputado.nomeEleitoral &&
            deputado.nomeEleitoral !== deputado.nome && (
              <Typography variant="body2" color="text.secondary">
                <strong>Nome Eleitoral:</strong> {deputado.nomeEleitoral}
              </Typography>
            )}
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ width: '100%', maxWidth: '1200px' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Dados Pessoais
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">
                <strong>Escolaridade:</strong>{' '}
                {deputado.escolaridade || 'Não informada'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Condição Eleitoral:</strong>{' '}
                {deputado.condicaoEleitoral || 'Não informada'}
              </Typography>
              {deputado.descricaoStatus && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Status:</strong> {deputado.descricaoStatus}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Gabinete
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {deputado.gabinete && deputado.gabinete.nome ? (
                <>
                  <Typography variant="body2">
                    <strong>Local:</strong> Prédio {deputado.gabinete.predio},
                    Sala {deputado.gabinete.sala}, Andar{' '}
                    {deputado.gabinete.andar}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Telefone:</strong>{' '}
                    {deputado.gabinete.telefone || 'Não informado'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>E-mail:</strong>{' '}
                    {deputado.gabinete.email ? (
                      <a
                        href={`mailto:${deputado.gabinete.email}`}
                        style={{ color: 'inherit' }}
                      >
                        {deputado.gabinete.email}
                      </a>
                    ) : (
                      'Não informado'
                    )}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">
                  Informações de gabinete não disponíveis.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Desempenho Geral (Durante o Mandato)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {deputado.estatisticas ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Score de Eficiência
                    </Typography>
                    <Typography
                      variant="h5"
                      color="secondary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {deputado.estatisticas.scoreEficiencia}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Projetos de Lei
                    </Typography>
                    <Typography variant="h6">
                      {deputado.estatisticas.projetosDeLei}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Proposições
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {deputado.estatisticas.totalProposicoes}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Custo / PL
                    </Typography>
                    <Typography variant="subtitle2" color="error.main">
                      {formatCurrency(deputado.estatisticas.custoPorProjetoLei)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Despesas
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="error.main"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {formatCurrency(deputado.estatisticas.gastosDespesas)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Custo / Proposição
                    </Typography>
                    <Typography variant="subtitle2" color="error.main">
                      {formatCurrency(deputado.estatisticas.custoPorProposicao)}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2">
                  Estatísticas não disponíveis.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          )) || (
            <DbEmptyState
              title="Nenhum dado disponível para o ano selecionado."
              description="Selecione outro ano para visualizar os gastos por categoria."
            />
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DbVisualizarDespesas
              id={Number(id)}
              resumoGastos={deputado.resumoGastos}
              ano={ano}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DbVisualizarProposicoes
              id={Number(id)}
              resumoProposicoes={deputado.resumoProposicoes}
              ano={ano}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
