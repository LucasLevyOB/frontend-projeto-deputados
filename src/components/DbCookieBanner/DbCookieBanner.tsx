import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Slide,
  useTheme,
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import {
  getStoredCookieConsent,
  saveCookieConsent,
} from '@/services/cookieConsent';

export const DbCookieBanner = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const storedConsent = getStoredCookieConsent();
    if (!storedConsent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    saveCookieConsent('accepted');
    setOpen(false);
  };

  const handleDecline = () => {
    saveCookieConsent('declined');
    setOpen(false);
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          left: '50%',
          transform: 'translateX(-50%) !important',
          zIndex: (t) => t.zIndex.snackbar,
          width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 48px)' },
          maxWidth: 720,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 12px 32px rgba(0, 0, 0, 0.5)'
                : '0 12px 32px rgba(0, 85, 235, 0.08)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 3 }}
            sx={{
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <CookieIcon
                sx={{
                  color: 'primary.main',
                  fontSize: 28,
                  mt: 0.3,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Privacidade e Cookies
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}
                >
                  Utilizamos cookies e o Google Analytics para coletar métricas de
                  acesso e navegação, visando aprimorar a experiência da
                  aplicação de acordo com as diretrizes da LGPD. Você pode aceitar
                  ou manter apenas os essenciais.
                </Typography>
              </Box>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{
                flexShrink: 0,
                minWidth: { sm: 240 },
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleDecline}
                sx={{
                  borderColor: 'divider',
                  textTransform: 'none',
                  fontWeight: 500,
                  py: 0.8,
                  px: 2,
                  '&:hover': {
                    borderColor: 'text.secondary',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Apenas Essenciais
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAccept}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 0.8,
                  px: 2.5,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 2,
                  },
                }}
              >
                Aceitar todos
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Slide>
  );
};
