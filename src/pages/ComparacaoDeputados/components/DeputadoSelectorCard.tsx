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
        maxWidth: { xs: '100%', sm: 380 },
        height: { xs: 80, sm: 220 },
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'row', sm: 'column' },
        justifyContent: { xs: 'flex-start', sm: 'center' },
        alignItems: 'center',
        p: { xs: 1, sm: 2 },
        gap: { xs: 1.5, sm: 0 },
        overflow: 'hidden',
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
              top: { xs: 4, sm: 12 },
              right: { xs: 4, sm: 12 },
              p: { xs: 0.5, sm: 1 },
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              zIndex: 1,
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
          </IconButton>

          <Avatar
            src={deputado.urlFoto}
            alt={deputado.nome}
            sx={{
              width: { xs: 52, sm: 88 },
              height: { xs: 52, sm: 88 },
              mb: { xs: 0, sm: 1.5 },
              flexShrink: 0,
              bgcolor: 'grey.300',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            {deputado.nome.substring(0, 2).toUpperCase()}
          </Avatar>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', sm: 'center' },
              textAlign: { xs: 'left', sm: 'center' },
              pr: { xs: 3.5, sm: 0 },
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                lineHeight: { xs: 1.15, sm: 1.2 },
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {deputado.nome}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: { xs: 0.25, sm: 0.5 },
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                lineHeight: 1.1,
              }}
            >
              {deputado.siglaPartido} - {deputado.siglaUf}
            </Typography>
          </Box>
        </>
      ) : (
        <CardContent
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 0.5, sm: 0 },
            '&:last-child': { pb: { xs: 0.5, sm: 0 } },
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              bgcolor: 'grey.300',
              mb: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          />

          <Box sx={{ width: '100%' }}>
            <DeputadoAutocomplete
              onSelect={onSelect}
              loading={loading}
              placeholder="Buscar Deputado"
            />
          </Box>
        </CardContent>
      )}
    </Card>
  );
};
