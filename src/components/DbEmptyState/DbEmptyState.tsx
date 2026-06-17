import { Box, Typography } from '@mui/material';
import noData from '@/assets/no-data.png';

interface DbEmptyStateProps {
  title: string;
  description?: string;
}

const DbEmptyState = ({ title, description }: DbEmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4,
        px: 8,
      }}
    >
      <Box
        sx={{
          height: 192,
          width: 192,
          mb: 4,
          mx: 'auto',
        }}
        src={noData}
        alt="Ilustração de dados não encontrados"
        component="img"
      />
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        {description}
      </Typography>
    </Box>
  );
};

export default DbEmptyState;
