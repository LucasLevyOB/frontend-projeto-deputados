import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DbAppBar from '@/components/DbAppBar/DbAppBar';
import { DbFooter } from '@/components/DbFooter';
import { DbCookieBanner } from '@/components/DbCookieBanner';

export const RootLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DbAppBar sx={{ position: 'sticky', top: 0, zIndex: 100 }} />
      <Box component="main" sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <DbFooter />
      <DbCookieBanner />
    </Box>
  );
};
