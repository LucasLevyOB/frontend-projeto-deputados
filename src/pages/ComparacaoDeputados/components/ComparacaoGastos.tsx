import { Box, Typography, Chip, Skeleton } from '@mui/material';
import { formatCurrency } from '@/utils';
import { extrairPrincipaisGastos } from '../utils/comparacaoUtils';
import type { Deputado } from '@/types';

interface ComparacaoGastosProps {
  deputado1: Deputado | null;
  deputado2: Deputado | null;
}

export const ComparacaoGastos = ({
  deputado1,
  deputado2,
}: ComparacaoGastosProps) => {
  const gastos1 = deputado1 ? extrairPrincipaisGastos(deputado1, 3) : [];
  const gastos2 = deputado2 ? extrairPrincipaisGastos(deputado2, 3) : [];

  const renderSlotGastos = (
    deputado: Deputado | null,
    gastos: ReturnType<typeof extrairPrincipaisGastos>
  ) => {
    if (!deputado) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
            maxWidth: 280,
          }}
        >
          <Skeleton
            variant="rounded"
            width="85%"
            height={32}
            sx={{ borderRadius: 4 }}
          />
        </Box>
      );
    }

    if (gastos.length === 0) {
      return (
        <Box sx={{ width: '100%', maxWidth: 280, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Sem dados de despesas disponíveis
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          width: '100%',
          maxWidth: 280,
        }}
      >
        {gastos.map((item, index) => {
          const labelCompleto = `${item.descricao} - ${formatCurrency(item.valor)}`;

          return (
            <Chip
              key={index}
              title={labelCompleto}
              variant="outlined"
              label={
                <Box sx={{ py: 0.5, textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: 500,
                      lineHeight: 1.25,
                      color: 'text.secondary',
                    }}
                  >
                    {item.descricao}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mt: 0.25,
                      lineHeight: 1.2,
                    }}
                  >
                    {formatCurrency(item.valor)}
                  </Typography>
                </Box>
              }
              sx={{
                width: '100%',
                maxWidth: 280,
                height: 'auto',
                py: 0.5,
                px: 1,
                borderRadius: 2.5,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  display: 'block',
                  p: 0,
                  width: '100%',
                },
              }}
            />
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Principais Gastos
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 4, sm: 8, md: 12 },
          width: '100%',
        }}
      >
        {renderSlotGastos(deputado1, gastos1)}
        {renderSlotGastos(deputado2, gastos2)}
      </Box>
    </Box>
  );
};
