import { Box, Typography, Chip, Skeleton, Divider } from '@mui/material';
import { extrairPrincipaisTemas } from '../utils/comparacaoUtils';
import type { Deputado } from '@/types';

interface ComparacaoTemasProps {
  deputado1: Deputado | null;
  deputado2: Deputado | null;
}

export const ComparacaoTemas = ({
  deputado1,
  deputado2,
}: ComparacaoTemasProps) => {
  const temas1 = deputado1 ? extrairPrincipaisTemas(deputado1, 4) : [];
  const temas2 = deputado2 ? extrairPrincipaisTemas(deputado2, 4) : [];

  const renderSlotTemas = (
    deputado: Deputado | null,
    temas: string[]
  ) => {
    if (!deputado) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
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

    if (temas.length === 0) {
      return (
        <Box sx={{ width: '100%', maxWidth: 280, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Sem temas registrados
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          width: '100%',
          maxWidth: 280,
        }}
      >
        {temas.map((tema, index) => {
          return (
            <Chip
              key={index}
              label={tema}
              title={tema}
              variant="outlined"
              size="small"
              sx={{
                maxWidth: '100%',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                borderColor: 'divider',
                bgcolor: 'background.paper',
                '& .MuiChip-label': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
        Temas de Atuação
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: { xs: 1.5, sm: 4, md: 6 },
          width: '100%',
        }}
      >
        <Box sx={{ flex: 1, maxWidth: 280, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          {renderSlotTemas(deputado1, temas1)}
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flex: 1, maxWidth: 280, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          {renderSlotTemas(deputado2, temas2)}
        </Box>
      </Box>
    </Box>
  );
};
