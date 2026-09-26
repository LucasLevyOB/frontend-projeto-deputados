import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
  tooltip?: string;
  description?: string;
}

export const StatCard = ({
  title,
  value,
  color = 'text.primary',
  tooltip,
  description,
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow enterTouchDelay={0}>
            <InfoOutlinedIcon
              sx={{
                fontSize: 15,
                color: 'text.secondary',
                cursor: 'help',
                opacity: 0.8,
                '&:hover': { opacity: 1 },
              }}
            />
          </Tooltip>
        )}
      </Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 'bold', color }}
      >
        {value}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            lineHeight: 1.2,
            mt: 0.75,
            fontSize: '0.72rem',
          }}
        >
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

