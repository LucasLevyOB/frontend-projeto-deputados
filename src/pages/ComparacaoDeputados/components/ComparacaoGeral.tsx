import { Box, Typography, Skeleton, Card, useTheme, useMediaQuery, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { StatCard } from '@/pages/DeputadoDetalhes/components/StatCard';
import { formatCurrency, formatCompactCurrency } from '@/utils';
import { determinarVencedor } from '../utils/comparacaoUtils';
import { METRICAS_INFO } from '@/constants/metricas';

import type { Deputado } from '@/types';

interface ComparacaoGeralProps {
  deputado1: Deputado | null;
  deputado2: Deputado | null;
}

export const ComparacaoGeral = ({
  deputado1,
  deputado2,
}: ComparacaoGeralProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ambosSelecionados = Boolean(deputado1 && deputado2);

  const stats1 = deputado1?.estatisticas;
  const stats2 = deputado2?.estatisticas;

  const score1 = Number(stats1?.scoreEficiencia ?? 0);
  const score2 = Number(stats2?.scoreEficiencia ?? 0);

  const pls1 = Number(stats1?.projetosDeLei ?? 0);
  const pls2 = Number(stats2?.projetosDeLei ?? 0);

  const outras1 = Math.max(0, Number(stats1?.totalProposicoes ?? 0) - pls1);
  const outras2 = Math.max(0, Number(stats2?.totalProposicoes ?? 0) - pls2);

  const gastos1 = Number(stats1?.gastosDespesas ?? 0);
  const gastos2 = Number(stats2?.gastosDespesas ?? 0);

  const resScore = determinarVencedor(score1, score2, false);
  const resPls = determinarVencedor(pls1, pls2, false);
  const resOutras = determinarVencedor(outras1, outras2, false);
  const resGastos = determinarVencedor(gastos1, gastos2, true);

  const corScore1 = ambosSelecionados && resScore.dep1Melhor ? 'primary.main' : 'text.primary';
  const corScore2 = ambosSelecionados && resScore.dep2Melhor ? 'primary.main' : 'text.primary';

  const corPls1 = ambosSelecionados && resPls.dep1Melhor ? 'primary.main' : 'text.primary';
  const corPls2 = ambosSelecionados && resPls.dep2Melhor ? 'primary.main' : 'text.primary';

  const corOutras1 = ambosSelecionados && resOutras.dep1Melhor ? 'primary.main' : 'text.primary';
  const corOutras2 = ambosSelecionados && resOutras.dep2Melhor ? 'primary.main' : 'text.primary';

  const corGastos1 = ambosSelecionados && resGastos.dep1Melhor ? 'primary.main' : 'text.primary';
  const corGastos2 = ambosSelecionados && resGastos.dep2Melhor ? 'primary.main' : 'text.primary';

  const renderMobileVsCard = (
    titulo: string,
    val1: string | number,
    val2: string | number,
    cor1: string,
    cor2: string,
    carregando1: boolean,
    carregando2: boolean,
    tooltip?: string
  ) => {
    return (
      <Card
        sx={{
          width: '100%',
          maxWidth: 320,
          borderRadius: 3,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid',
          borderColor: 'divider',
          py: 2,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            mb: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {titulo}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip} arrow enterTouchDelay={0}>
              <InfoOutlinedIcon
                sx={{
                  fontSize: 15,
                  color: 'text.secondary',
                  cursor: 'help',
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                }}
              />
            </Tooltip>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {carregando1 ? (
            <Skeleton variant="text" width={50} height={32} />
          ) : (
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: cor1 }}
            >
              {val1}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.disabled',
              textTransform: 'lowercase',
            }}
          >
            vs
          </Typography>

          {carregando2 ? (
            <Skeleton variant="text" width={50} height={32} />
          ) : (
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: cor2 }}
            >
              {val2}
            </Typography>
          )}
        </Box>
      </Card>
    );
  };

  const renderSlotMetricas = (
    deputado: Deputado | null,
    cores: { score: string; pls: string; outras: string; gastos: string },
    valores: { score: number; pls: number; outras: number; gastos: number }
  ) => {
    if (!deputado) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 280 }}>
          {[0, 1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rounded"
              height={92}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 280 }}>
        <Box sx={{ minHeight: 92 }}>
          <StatCard
            title="Score Eficiência"
            value={valores.score}
            color={cores.score}
            tooltip={METRICAS_INFO.scoreEficiencia.descricaoCurta}
            description={METRICAS_INFO.scoreEficiencia.resumo}
          />
        </Box>
        <Box sx={{ minHeight: 92 }}>
          <StatCard
            title="Projetos de Lei"
            value={valores.pls}
            color={cores.pls}
          />
        </Box>
        <Box sx={{ minHeight: 92 }}>
          <StatCard
            title="Outras Proposições"
            value={valores.outras}
            color={cores.outras}
          />
        </Box>
        <Box sx={{ minHeight: 92 }}>
          <StatCard
            title="Gastos"
            value={formatCurrency(valores.gastos)}
            color={cores.gastos}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Geral
      </Typography>

      {isMobile ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            width: '100%',
          }}
        >
          {renderMobileVsCard(
            'Score Eficiência',
            score1,
            score2,
            corScore1,
            corScore2,
            !deputado1,
            !deputado2,
            METRICAS_INFO.scoreEficiencia.descricaoCurta
          )}
          {renderMobileVsCard(
            'Projetos de Lei',
            pls1,
            pls2,
            corPls1,
            corPls2,
            !deputado1,
            !deputado2
          )}
          {renderMobileVsCard(
            'Outras Proposições',
            outras1,
            outras2,
            corOutras1,
            corOutras2,
            !deputado1,
            !deputado2
          )}
          {renderMobileVsCard(
            'Gastos',
            formatCompactCurrency(gastos1),
            formatCompactCurrency(gastos2),
            corGastos1,
            corGastos2,
            !deputado1,
            !deputado2
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 4, sm: 8, md: 12 },
            width: '100%',
          }}
        >
          {renderSlotMetricas(
            deputado1,
            { score: corScore1, pls: corPls1, outras: corOutras1, gastos: corGastos1 },
            { score: score1, pls: pls1, outras: outras1, gastos: gastos1 }
          )}

          {renderSlotMetricas(
            deputado2,
            { score: corScore2, pls: corPls2, outras: corOutras2, gastos: corGastos2 },
            { score: score2, pls: pls2, outras: outras2, gastos: gastos2 }
          )}
        </Box>
      )}
    </Box>
  );
};

