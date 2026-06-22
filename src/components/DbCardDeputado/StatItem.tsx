import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

interface StatItemProps {
    label: string;
    value: string | number;
    highlight?: boolean;
}

const StatItem = ({ label, value, highlight = false }: StatItemProps) => {
    if (highlight) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: '8px 16px', bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2, mr: 'auto', ml: 'auto' }}>
                <Typography variant="h6">
                    {value}
                </Typography>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                    {label}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
                {value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {label}
            </Typography>
        </Box>
    );
};

export default StatItem;
