import { Box, Typography, Skeleton } from '@mui/material';
import { StatCard } from '@/pages/DeputadoDetalhes/components/StatCard';
import { formatCurrency } from '@/utils';
import { determinarVencedor } from '../utils/comparacaoUtils';
import type { Deputado } from '@/types';

interface ComparacaoGeralProps {
  deputado1: Deputado | null;
  deputado2: Deputado | null;
}

export const ComparacaoGeral = ({
  deputado1,
  deputado2,
}: ComparacaoGeralProps) => {
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
              height={84}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 280 }}>
        <Box sx={{ height: 84 }}>
          <StatCard
            title="Score Eficiência"
            value={valores.score}
            color={cores.score}
          />
        </Box>
        <Box sx={{ height: 84 }}>
          <StatCard
            title="Projetos de Lei"
            value={valores.pls}
            color={cores.pls}
          />
        </Box>
        <Box sx={{ height: 84 }}>
          <StatCard
            title="Outras Proposições"
            value={valores.outras}
            color={cores.outras}
          />
        </Box>
        <Box sx={{ height: 84 }}>
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
    <Box sx={{ width: '100%', my: 3 }}>
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Geral
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 2, md: 8 },
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
    </Box>
  );
};
