import { Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
}

export const StatCard = ({
  title,
  value,
  color = 'text.primary',
}: StatCardProps) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 2,
      boxShadow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <CardContent sx={{ textAlign: 'center', py: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          lineHeight: 1.2,
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={color} sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);
