import { Box } from '@mui/material';
import { DbVisualizarVotacoes } from '@/components/DbVisualizarVotacoes';

interface VotacoesTabProps {
  id: number;
  legislatura?: number;
}

export const VotacoesTab = ({ id, legislatura }: VotacoesTabProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <DbVisualizarVotacoes id={id} legislatura={legislatura} />
    </Box>
  );
};
