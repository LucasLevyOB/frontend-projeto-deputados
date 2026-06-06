import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DbAppBar from '@/components/DbAppBar/DbAppBar';

export const RootLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DbAppBar />
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
