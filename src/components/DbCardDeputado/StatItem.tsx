import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

interface StatItemProps {
    label: string;
    value: string | number;
    highlight?: boolean;
}

const StatItem = ({ label, value, highlight = false }: StatItemProps) => {
    if (highlight) {
        return (
            <Paper elevation={0} variant="outlined" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: '16px', mr: 'auto', ml: 'auto' }}>
                <Typography variant="h5">
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="button">
                {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {label}
            </Typography>
        </Box>
    );
};

export default StatItem;
