import { Card, CardContent, CardHeader, Divider, Grid, Typography, Box, IconButton, Tooltip, Chip } from '@mui/material';
import { StatCard } from './StatCard';
import { formatCurrency, getRedeSocialIcon, getRedeSocialName } from '@/utils';

import type { Deputado } from '@/types';

interface VisaoGeralTabProps {
  deputado: Deputado;
}

export const VisaoGeralTab = ({ deputado }: VisaoGeralTabProps) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
          <CardHeader
            title="Dados Pessoais"
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

            {deputado.urlRedeSocial && deputado.urlRedeSocial.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Redes Sociais:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {deputado.urlRedeSocial.map((url, index) => (
                    <Tooltip key={index} title={getRedeSocialName(url)}>
                      <IconButton
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        sx={{ bgcolor: 'action.hover' }}
                      >
                        {getRedeSocialIcon(url)}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
          <CardHeader
            title="Gabinete"
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

      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
          Resumo do Mandato
        </Typography>
        {deputado.estatisticas ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StatCard
                title="Score Eficiência"
                value={deputado.estatisticas.scoreEficiencia}
                color="secondary.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StatCard
                title="Projetos de Lei"
                value={deputado.estatisticas.projetosDeLei}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StatCard
                title="Total Proposições"
                value={deputado.estatisticas.totalProposicoes}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StatCard
                title="Total Despesas"
                value={formatCurrency(deputado.estatisticas.gastosDespesas)}
                color="error.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StatCard
                title="Custo / PL"
                value={formatCurrency(deputado.estatisticas.custoPorProjetoLei)}
                color="error.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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

      {deputado.estatisticas?.temasProposicoes && deputado.estatisticas.temasProposicoes.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
            Principais Temas de Atuação
          </Typography>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {deputado.estatisticas.temasProposicoes
                .slice(0, 15)
                .map((temaObj, index) => (
                  <Chip
                    key={index}
                    label={temaObj.tema}
                    color="primary"
                    variant={index < 3 ? "filled" : "outlined"}
                    sx={{
                      fontWeight: index < 3 ? 'bold' : 'normal',
                      px: index < 3 ? 1 : 0
                    }}
                  />
                ))}
            </Box>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};
