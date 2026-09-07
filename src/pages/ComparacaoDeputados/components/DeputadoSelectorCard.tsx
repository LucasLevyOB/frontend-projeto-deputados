import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DeputadoAutocomplete } from './DeputadoAutocomplete';
import type { Deputado, DeputadoResumo } from '@/types';

interface DeputadoSelectorCardProps {
  deputado: Deputado | null;
  onSelect: (_deputado: DeputadoResumo) => void;
  onClear: () => void;
  loading?: boolean;
}

export const DeputadoSelectorCard = ({
  deputado,
  onSelect,
  onClear,
  loading = false,
}: DeputadoSelectorCardProps) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 380,
        height: 220,
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {deputado ? (
        <>
          <IconButton
            size="small"
            onClick={onClear}
            aria-label="Remover deputado"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Avatar
            src={deputado.urlFoto}
            alt={deputado.nome}
            sx={{
              width: 88,
              height: 88,
              mb: 1.5,
              bgcolor: 'grey.300',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            {deputado.nome.substring(0, 2).toUpperCase()}
          </Avatar>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}
          >
            {deputado.nome}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, textAlign: 'center' }}
          >
            {deputado.siglaPartido} - {deputado.siglaUf}
          </Typography>
        </>
      ) : (
        <CardContent
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 0,
            '&:last-child': { pb: 0 },
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              bgcolor: 'grey.300',
              mb: 2,
            }}
          />

          <DeputadoAutocomplete
            onSelect={onSelect}
            loading={loading}
            placeholder="Buscar Deputado"
          />
        </CardContent>
      )}
    </Card>
  );
};
