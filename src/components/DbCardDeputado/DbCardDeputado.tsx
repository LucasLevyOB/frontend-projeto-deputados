import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, CardActionArea, Chip, Divider } from '@mui/material';
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
        <Card
            sx={{
                width: '100%',
                borderRadius: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 6
                }
            }}
        >
            <CardActionArea onClick={handleVerDetalhes} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                height: 100,
                                width: 100,
                                borderRadius: '50%',
                                overflow: 'hidden',
                                mb: 2,
                                boxShadow: 2,
                            }}
                            src={deputado.urlFoto}
                            alt={"Foto de " + deputado.nome}
                            component='img'
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 1, lineHeight: 1.2 }}>
                            {deputado.nome}
                        </Typography>
                        <Chip
                            label={`${deputado.siglaPartido} - ${deputado.siglaUf}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Box>

                    <StatItem label="Eficiência" value={deputado.estatisticas.scoreEficiencia} highlight />

                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2, px: 1 }}>
                        <StatItem label="Projetos" value={deputado.estatisticas.projetosDeLei} />
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <StatItem label="Proposições" value={deputado.estatisticas.totalProposicoes} />
                    </Box>
                    {deputado.estatisticas.temasProposicoes && deputado.estatisticas.temasProposicoes.length > 0 && (
                        <>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                                {deputado.estatisticas.temasProposicoes
                                    .slice(0, 3)
                                    .map((temaObj, index) => (
                                        <Chip
                                            key={index}
                                            label={temaObj.tema}
                                            color="primary"
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem', height: 20 }}
                                        />
                                    ))}
                            </Box>
                        </>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default DbCard;
