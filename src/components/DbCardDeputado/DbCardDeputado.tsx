import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import StatItem from './StatItem';

import type { Deputado } from '@/types';
import { useNavigate } from 'react-router-dom';

interface Props {
    deputado: Deputado;
}

const DbCard = ({ deputado }: Props) => {
    const navigate = useNavigate();
    const handleVerDetalhes = () => {
        navigate(`/deputado/${deputado._id}`);
    };

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: "28px" }}>
                    <Box
                        sx={{
                            height: 152,
                            width: 114,
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
                <Button size="small" sx={{ ml: 'auto' }} onClick={handleVerDetalhes}>Ver Detalhes</Button>
            </CardActions>
        </Card>
    );
};

export default DbCard;
