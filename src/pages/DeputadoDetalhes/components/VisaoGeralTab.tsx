import { Card, CardContent, CardHeader, Divider, Grid, Typography, Box } from '@mui/material';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/utils';

import type { Deputado } from '@/types';

interface VisaoGeralTabProps {
  deputado: Deputado;
}

export const VisaoGeralTab = ({ deputado }: VisaoGeralTabProps) => {
  return (
    <Grid container spacing={3}>
      {/* Informações Pessoais */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
          <CardHeader
            title="Dados Pessoais"
            titleTypographyProps={{ variant: 'h6', color: 'primary' }}
          />
          <Divider />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="body1">
              <strong>Escolaridade:</strong> {deputado.escolaridade || 'Não informada'}
            </Typography>
            <Typography variant="body1">
              <strong>Condição Eleitoral:</strong> {deputado.condicaoEleitoral || 'Não informada'}
            </Typography>
            {deputado.descricaoStatus && (
              <Typography variant="body1">
                <strong>Status:</strong> {deputado.descricaoStatus}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Informações de Gabinete */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
          <CardHeader
            title="Gabinete"
            titleTypographyProps={{ variant: 'h6', color: 'primary' }}
          />
          <Divider />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {deputado.gabinete && deputado.gabinete.nome ? (
              <>
                <Typography variant="body1">
                  <strong>Local:</strong> Prédio {deputado.gabinete.predio}, Sala {deputado.gabinete.sala}, Andar {deputado.gabinete.andar}
                </Typography>
                <Typography variant="body1">
                  <strong>Telefone:</strong> {deputado.gabinete.telefone || 'Não informado'}
                </Typography>
                <Typography variant="body1">
                  <strong>E-mail:</strong>{' '}
                  {deputado.gabinete.email ? (
                    <a href={`mailto:${deputado.gabinete.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                      {deputado.gabinete.email}
                    </a>
                  ) : (
                    'Não informado'
                  )}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Informações de gabinete não disponíveis.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Desempenho Geral (Estatísticas) */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
          Resumo do Mandato
        </Typography>
        {deputado.estatisticas ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                title="Score Eficiência"
                value={deputado.estatisticas.scoreEficiencia.toFixed(2)}
                color="secondary.main"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                title="Projetos de Lei"
                value={deputado.estatisticas.projetosDeLei}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                title="Total Proposições"
                value={deputado.estatisticas.totalProposicoes}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                title="Total Despesas"
                value={formatCurrency(deputado.estatisticas.gastosDespesas)}
                color="error.main"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                title="Custo / PL"
                value={formatCurrency(deputado.estatisticas.custoPorProjetoLei)}
                color="error.main"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}>
              <StatCard
                title="Custo / Proposição"
                value={formatCurrency(deputado.estatisticas.custoPorProposicao)}
                color="error.main"
              />
            </Grid>
          </Grid>
        ) : (
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Estatísticas de mandato não disponíveis.
            </Typography>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};
