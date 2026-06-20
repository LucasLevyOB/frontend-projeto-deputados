import { useEffect, useState, useRef, useCallback } from 'react';
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
    Tooltip,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { DbEmptyState } from '@/components/DbEmptyState';
import { OpenInNew, Search } from '@mui/icons-material';

import type { Proposicao } from '@/types';
import type { ResumoProposicoes } from '@/types/Deputado';

interface Props {
    id: number;
    resumoProposicoes?: ResumoProposicoes[];
    ano?: number;
}

const DbVisualizarProposicoes = ({ id, resumoProposicoes, ano }: Props) => {
    const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [siglaTipo, setSiglaTipo] = useState<string | undefined>();
    const [ementa, setEmenta] = useState<string>('');
    const [debouncedEmenta, setDebouncedEmenta] = useState<string>('');

    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedEmenta(ementa);
        }, 500);

        return () => clearTimeout(timer);
    }, [ementa]);

    const fetchInitialData = async () => {
        setLoading(true);
        const api = new DepudadosAPI();
        const response = await api.getProposicoesDeputado(
            Number(id),
            1,
            20,
            siglaTipo,
            debouncedEmenta,
            ano
        );
        setProposicoes(response.data);
        setPage(1);
        setHasMore(1 < response.totalPages);
        setLoading(false);
    };

    const fetchPaginationData = async () => {
        setLoading(true);
        const api = new DepudadosAPI();
        const response = await api.getProposicoesDeputado(
            Number(id),
            page,
            20,
            siglaTipo,
            debouncedEmenta,
            ano
        );
        setProposicoes((prev) => [...prev, ...response.data]);
        setHasMore(page < response.totalPages);
        setLoading(false);
    };

    const handleSiglaTipo = (newSiglaTipo: string | undefined) => {
        setSiglaTipo(newSiglaTipo);
    };

    useEffect(() => {
        if (id) {
            fetchInitialData();
        }
    }, [id, siglaTipo, debouncedEmenta, ano]);

    useEffect(() => {
        if (id && page > 1) {
            fetchPaginationData();
        }
    }, [page]);

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Proposições
            </Typography>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por ementa..."
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

            {resumoProposicoes && !!ano && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {resumoProposicoes
                        .find((r) => r.ano === ano)
                        ?.tipos.map((tipo, idx) => (
                            <Tooltip title={tipo.descricaoTipo}>
                                <Chip
                                    key={idx}
                                    label={`${tipo.siglaTipo} (${tipo.quantidade})`}
                                    variant={siglaTipo === tipo.siglaTipo ? "filled" : "outlined"}
                                    color={siglaTipo === tipo.siglaTipo ? "primary" : "default"}
                                    aria-label={tipo.descricaoTipo}
                                    clickable
                                    onClick={() => handleSiglaTipo(tipo.siglaTipo)}
                                    onDelete={siglaTipo === tipo.siglaTipo ? () => handleSiglaTipo(undefined) : undefined}
                                />
                            </Tooltip>
                        ))}
                </Box>
            )}

            {proposicoes.length === 0 && !loading ? (
                <DbEmptyState
                    title="Nenhuma proposição encontrada"
                    description="Não foram encontradas proposições com os filtros atuais."
                />
            ) : (
                <Box
                    sx={{
                        maxHeight: 400,
                        overflowY: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                    }}
                >
                    <List>
                        {proposicoes.map((proposicao, index) => {
                            const isLast = proposicoes.length === index + 1;
                            return (
                                <Box key={`${proposicao.id}-${index}`} ref={isLast ? lastElementRef : null}>
                                    <ListItem>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {proposicao.siglaTipo} {proposicao.numero}/{proposicao.ano}
                                                    </Typography>
                                                    {proposicao.urlInteiroTeor && (
                                                        <Link href={proposicao.urlInteiroTeor} target="_blank" sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                                            <OpenInNew fontSize="small" />
                                                        </Link>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5, mt: 0.5 }}>
                                                        {proposicao.ementa}
                                                    </Typography>
                                                    {proposicao.temas && proposicao.temas.length > 0 && (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                            {proposicao.temas.map((tema, idx) => (
                                                                <Chip
                                                                    key={idx}
                                                                    label={tema}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Box>
                                                    )}
                                                    <Typography component="span" variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                                                        Apresentação:{' '}
                                                        {new Date(proposicao.dataApresentacao).toLocaleDateString(
                                                            'pt-BR',
                                                            { timeZone: 'UTC' }
                                                        )}
                                                    </Typography>
                                                </>
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

export default DbVisualizarProposicoes;
