import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Chip,
    Link,
    TextField,
    InputAdornment,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { DbEmptyState } from '@/components/DbEmptyState';
import { OpenInNew, Search } from '@mui/icons-material';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';

import type { Votacao } from '@/types';

interface Props {
    id: number;
}

const DbVisualizarVotacoes = ({ id }: Props) => {
    const [votacoes, setVotacoes] = useState<Votacao[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [ementa, setEmenta] = useState<string>('');
    const debouncedEmenta = useDebounce(ementa, 500);
    const lastElementRef = useInfiniteScroll(loading, hasMore, () => setPage((prevPage) => prevPage + 1));

    const fetchInitialData = async () => {
        setLoading(true);
        const api = new DepudadosAPI();
        const response = await api.getVotacoesDeputado(
            Number(id),
            1,
            20,
            debouncedEmenta
        );
        setVotacoes(response.data);
        setPage(1);
        setHasMore(1 < response.totalPages);
        setLoading(false);
    };

    const fetchPaginationData = async () => {
        setLoading(true);
        const api = new DepudadosAPI();
        const response = await api.getVotacoesDeputado(
            Number(id),
            page,
            20,
            debouncedEmenta
        );
        setVotacoes((prev) => [...prev, ...response.data]);
        setHasMore(page < response.totalPages);
        setLoading(false);
    };

    useEffect(() => {
        if (id) {
            fetchInitialData();
        }
    }, [id, debouncedEmenta]);

    useEffect(() => {
        if (id && page > 1) {
            fetchPaginationData();
        }
    }, [page]);

    const getVotoColor = (voto: string) => {
        const v = voto.toLowerCase();
        if (v.includes('sim')) return 'success';
        if (v.includes('não') || v.includes('nao')) return 'error';
        return 'default';
    };

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Votações Recentes
            </Typography>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por proposição..."
                    value={ementa}
                    onChange={(e) => setEmenta(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }
                    }}
                    size="small"
                />
            </Box>

            {votacoes.length === 0 && !loading ? (
                <DbEmptyState
                    title="Nenhuma votação encontrada"
                    description="Não foram encontradas votações para este deputado."
                />
            ) : (
                <Box
                    sx={{
                        maxHeight: 600,
                        overflowY: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                    }}
                >
                    <List>
                        {votacoes.map((votacao, index) => {
                            const isLast = votacoes.length === index + 1;
                            return (
                                <Box key={`${votacao.idVotacao}-${index}`} ref={isLast ? lastElementRef : null}>
                                    <ListItem>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexDirection: 'column' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={`Voto: ${votacao.voto}`}
                                                                color={getVotoColor(votacao.voto) as any}
                                                                size="small"
                                                                sx={{ fontWeight: 'bold' }}
                                                            />
                                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                {votacao.votacao_.descricao}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    {votacao.uriVotacao && (
                                                        <Link href={votacao.uriVotacao} target="_blank" sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                                            <OpenInNew fontSize="small" />
                                                        </Link>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 1 }}>
                                                    {votacao.proposicao_ && (
                                                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                            <strong>Proposição:</strong> {votacao.proposicao_.siglaTipo} {votacao.proposicao_.numero}/{votacao.proposicao_.ano} - {votacao.proposicao_.ementa}
                                                        </Typography>
                                                    )}
                                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                                                        <Typography component="span" variant="caption" color="text.disabled">
                                                            <strong>Data do Voto:</strong>{' '}
                                                            {new Date(votacao.dataHoraVoto).toLocaleDateString(
                                                                'pt-BR',
                                                                { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' }
                                                            )}
                                                        </Typography>
                                                        <Typography component="span" variant="caption" color="text.disabled">
                                                            <strong>Aprovação:</strong> {votacao.votacao_.aprovacao === 1 ? 'Aprovada' : 'Rejeitada'}
                                                        </Typography>
                                                        <Typography component="span" variant="caption" color="text.disabled">
                                                            <strong>Órgão:</strong> {votacao.votacao_.siglaOrgao}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {!isLast && <Divider />}
                                </Box>
                            );
                        })}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default DbVisualizarVotacoes;
