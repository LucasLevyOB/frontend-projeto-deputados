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
    Tooltip,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { DbEmptyState } from '@/components/DbEmptyState';
import { DbSelectFilter } from '@/components/DbSelectFilter';
import { OpenInNew, Search } from '@mui/icons-material';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';

import type { Proposicao } from '@/types';
import type { ResumoProposicoes } from '@/types/Deputado';

interface Props {
    id: number;
    resumoProposicoes?: ResumoProposicoes[];
    ano?: number;
}

const DbVisualizarProposicoes = ({ id, resumoProposicoes, ano }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [siglaTipo, setSiglaTipo] = useState<string | undefined>();
    const [ementa, setEmenta] = useState<string>('');
    const debouncedEmenta = useDebounce(ementa, 500);
    const lastElementRef = useInfiniteScroll(loading, hasMore, () => setPage((prevPage) => prevPage + 1));

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
        setPage(1);
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

    const tiposAno = resumoProposicoes?.find((r) => r.ano === ano)?.tipos || [];

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Proposições
            </Typography>

            <Box sx={{ mb: 2.5 }}>
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

            {tiposAno.length > 0 && (
                isMobile ? (
                    <DbSelectFilter
                        label="Filtrar por Tipo"
                        value={siglaTipo}
                        allLabel="Todos os Tipos"
                        options={tiposAno.map((tipo) => ({
                            value: tipo.siglaTipo,
                            label: `${tipo.siglaTipo} - ${tipo.descricaoTipo} (${tipo.quantidade})`,
                        }))}
                        onChange={handleSiglaTipo}
                    />
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {tiposAno.map((tipo, idx) => (
                            <Tooltip key={idx} title={tipo.descricaoTipo}>
                                <Chip
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
                )
            )}

            {proposicoes.length === 0 && !loading ? (
                <DbEmptyState
                    title="Nenhuma proposição encontrada"
                    description="Não foram encontradas proposições com os filtros atuais."
                />
            ) : (
                <Box
                    sx={{
                        maxHeight: { xs: 480, sm: 420 },
                        overflowY: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <List disablePadding>
                        {proposicoes.map((proposicao, index) => {
                            const isLast = proposicoes.length === index + 1;
                            return (
                                <Box key={`${proposicao.id}-${index}`} ref={isLast ? lastElementRef : null}>
                                    <ListItem sx={{ py: 1.5, px: { xs: 1.5, sm: 2 } }}>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            lineHeight: 1.25,
                                                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                                        }}
                                                    >
                                                        {proposicao.titulo}
                                                    </Typography>
                                                    {proposicao.urlInteiroTeor && (
                                                        <Link
                                                            href={proposicao.urlInteiroTeor}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: 'primary.main',
                                                                flexShrink: 0,
                                                                p: 0.5,
                                                            }}
                                                        >
                                                            <OpenInNew fontSize="small" />
                                                        </Link>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ display: 'block', mb: 0.5, lineHeight: 1.3 }}
                                                    >
                                                        {proposicao.ementa}
                                                    </Typography>
                                                    {proposicao.temas && proposicao.temas.length > 0 && (
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, mb: 0.5 }}>
                                                            {proposicao.temas.map((tema, idx) => (
                                                                <Chip
                                                                    key={idx}
                                                                    label={tema}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ fontSize: '0.7rem' }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    )}
                                                    <Typography component="span" variant="caption" color="text.disabled" sx={{ mt: 0.75, display: 'block' }}>
                                                        <strong>Status Atual:</strong> {proposicao.tipoSituacaoProposicao ?? "Sem Status"}
                                                    </Typography>
                                                    <Typography component="span" variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
                                                        <strong>Apresentação:</strong>{' '}
                                                        {new Date(proposicao.dataApresentacao).toLocaleDateString(
                                                            'pt-BR',
                                                            { timeZone: 'UTC' }
                                                        )}
                                                    </Typography>
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

export default DbVisualizarProposicoes;
