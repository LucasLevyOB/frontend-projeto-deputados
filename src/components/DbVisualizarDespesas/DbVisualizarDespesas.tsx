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
    useTheme,
    useMediaQuery,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { formatCurrency } from '@/utils';
import { DbEmptyState } from '@/components/DbEmptyState';
import { DbSelectFilter } from '@/components/DbSelectFilter';
import { OpenInNew } from '@mui/icons-material';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import type { Despesa } from '@/types';
import type { ResumoGastos } from '@/types/Deputado';

interface Props {
    id: number;
    resumoGastos?: ResumoGastos[];
    ano?: number;
}

const DbVisualizarDespesas = ({ id, resumoGastos, ano }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [pageDespesas, setPageDespesas] = useState<number>(1);
    const [hasMoreDespesas, setHasMoreDespesas] = useState<boolean>(true);
    const [loadingDespesas, setLoadingDespesas] = useState<boolean>(false);
    const [descricao, setDescricao] = useState<string | undefined>();
    const lastDespesaElementRef = useInfiniteScroll(loadingDespesas, hasMoreDespesas, () => setPageDespesas((prevPage) => prevPage + 1));

    const fetchDespesasData = async () => {
        setLoadingDespesas(true);
        const api = new DepudadosAPI();
        const response = await api.getDespesasDeputado(
            Number(id),
            pageDespesas,
            20,
            ano,
            descricao
        );
        setDespesas(response.data);
        setHasMoreDespesas(pageDespesas < response.totalPages);
        setLoadingDespesas(false);
    };

    const paginationFetch = async () => {
        setLoadingDespesas(true);
        const api = new DepudadosAPI();
        const response = await api.getDespesasDeputado(
            Number(id),
            pageDespesas,
            20,
            ano,
            descricao
        );
        setDespesas((prevDespesas) => [...prevDespesas, ...response.data]);
        setHasMoreDespesas(pageDespesas < response.totalPages);
        setLoadingDespesas(false);
    };

    const handleDescricao = (selectedDescricao: string | undefined) => {
        setDescricao(selectedDescricao);
        setPageDespesas(1);
    };

    useEffect(() => {
        if (id) {
            fetchDespesasData();
        }
    }, [id, descricao, ano]);

    useEffect(() => {
        if (id && pageDespesas > 1) {
            paginationFetch();
        }
    }, [pageDespesas]);

    const categoriasAno = resumoGastos?.find((r) => r.ano === ano)?.categorias || [];

    if (despesas.length === 0) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Despesas
                </Typography>
                <DbEmptyState
                    title="Não existem gastos para o ano selecionado."
                    description={`Este deputado ainda não registrou gastos no ano de ${ano}.`}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Despesas
            </Typography>

            {categoriasAno.length > 0 && (
                isMobile ? (
                    <DbSelectFilter
                        label="Filtrar por Categoria"
                        value={descricao}
                        allLabel="Todas as Categorias"
                        options={categoriasAno.map((cat) => ({
                            value: cat.descricao,
                            label: `${cat.descricao} (${formatCurrency(cat.totalGasto)})`,
                        }))}
                        onChange={handleDescricao}
                    />
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {categoriasAno.map((cat, idx) => (
                            <Chip
                                key={idx}
                                label={`${cat.descricao}: ${formatCurrency(cat.totalGasto)}`}
                                variant={descricao === cat.descricao ? "filled" : "outlined"}
                                color={descricao === cat.descricao ? "primary" : "default"}
                                clickable
                                onClick={() => handleDescricao(cat.descricao)}
                                onDelete={descricao === cat.descricao ? () => handleDescricao(undefined) : undefined}
                            />
                        ))}
                    </Box>
                )
            )}

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
                    {despesas.map((despesa, index) => {
                        const isLast = despesas.length === index + 1;
                        return (
                            <Box key={index} ref={isLast ? lastDespesaElementRef : null}>
                                <ListItem sx={{ py: 1.5, px: { xs: 1.5, sm: 2 } }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        lineHeight: 1.25,
                                                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                                    }}
                                                >
                                                    {despesa.descricao}
                                                </Typography>
                                                {despesa.urlDocumento && (
                                                    <Link
                                                        href={despesa.urlDocumento}
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
                                                {despesa.descricaoEspecificacao && (
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ display: 'block', mb: 0.5, lineHeight: 1.25 }}
                                                    >
                                                        {despesa.descricaoEspecificacao}
                                                    </Typography>
                                                )}
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ display: 'block', fontWeight: 600, color: 'text.primary', mb: 0.25 }}
                                                >
                                                    Valor: {formatCurrency(Number(despesa.valorLiquido))}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block', mb: 0.25 }}
                                                >
                                                    Fornecedor: {despesa.fornecedor}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block' }}
                                                >
                                                    Data:{' '}
                                                    {new Date(despesa.dataEmissao).toLocaleDateString(
                                                        'pt-BR',
                                                        { timeZone: 'UTC' }
                                                    )}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < despesas.length - 1 && <Divider />}
                            </Box>
                        );
                    })}
                    {loadingDespesas && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default DbVisualizarDespesas;
