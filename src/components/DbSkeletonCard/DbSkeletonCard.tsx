import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const DbSkeletonCard = () => {
    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: "28px" }}>
                    <Skeleton
                        variant="circular"
                        width={96}
                        height={96}
                        sx={{
                            maxHeight: { xs: 96, md: 96 },
                            maxWidth: { xs: 96, md: 96 },
                            mr: '16px',
                        }}
                    />
                    <Box sx={{ mr: 'auto', ml: 'auto' }}>
                        <Skeleton variant="text" width={150} sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="text" width={100} />
                    </Box>
                </Box>
                <Skeleton variant="rectangular" width="100%" height={60} />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', mt: '16px' }}>
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={100} />
                </Box>
            </CardContent>
            <CardActions>
                <Skeleton variant="rectangular" width={100} sx={{ ml: 'auto' }} />
            </CardActions>
        </Card>
    );
};

export default DbSkeletonCard;