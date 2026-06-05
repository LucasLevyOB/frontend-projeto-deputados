import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import StatItem from './StatItem';

import type { Deputado } from '@/types';

interface Props {
    deputado: Deputado;
}

const DbCard = ({ deputado }: Props) => {
    return (
        <Card sx={{ maxWidth: 356, width: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: "28px" }}>
                    <Box
                        sx={{
                            height: 96,
                            width: 96,
                            maxHeight: { xs: 96, md: 96 },
                            maxWidth: { xs: 96, md: 96 },
                            borderRadius: '50%',
                            overflow: 'hidden',
                            mr: '16px',
                        }}
                        src={deputado.urlFoto}
                        alt={"Foto de " + deputado.nome}
                        component='img'
                    />
                    <Box sx={{ mr: 'auto', ml: 'auto' }}>
                        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: .5 }}>
                            {deputado.nome}
                        </Typography>
                        <Typography variant="caption" component="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                            {deputado.siglaPartido} - {deputado.siglaUf}
                        </Typography>
                    </Box>
                </Box>
                <StatItem label="Score Eficiência" value={deputado.estatisticas.scoreEficiencia} highlight />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', mt: '16px' }}>
                    <StatItem label="Projetos de Lei" value={deputado.estatisticas.projetosDeLei} />
                    <StatItem label="Total de Proposições" value={deputado.estatisticas.totalProposicoes} />
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small" sx={{ ml: 'auto' }}>Ver Detalhes</Button>
            </CardActions>
        </Card>
    );
};

export default DbCard;
