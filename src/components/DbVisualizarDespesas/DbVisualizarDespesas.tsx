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
    Button,
    Link,
    Icon,
} from '@mui/material';
import DepudadosAPI from '@/services/DepudadosAPI';
import { formatCurrency } from '@/utils';
import { DbEmptyState } from '@/components/DbEmptyState';
import { OpenInNew } from '@mui/icons-material';

import type { Despesa } from '@/types';
import type { ResumoGastos } from '@/types/Deputado';

interface Props {
    id: number;
    resumoGastos?: ResumoGastos[];
    ano?: number;
}

const DbVisualizarDespesas = ({ id, resumoGastos, ano }: Props) => {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [pageDespesas, setPageDespesas] = useState<number>(1);
    const [hasMoreDespesas, setHasMoreDespesas] = useState<boolean>(true);
    const [loadingDespesas, setLoadingDespesas] = useState<boolean>(false);
    const [descricao, setDescricao] = useState<string | undefined>();
    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastDespesaElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loadingDespesas) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreDespesas) {
                    setPageDespesas((prevPage) => prevPage + 1);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [loadingDespesas, hasMoreDespesas]
    );

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
        setDespesas((prev) => [...prev, ...response.data]);
        setHasMoreDespesas(pageDespesas < response.totalPages);
        setLoadingDespesas(false);
    }

    const handleDescricao = (newDescricao: string | undefined) => {
        setDescricao(newDescricao);
    }

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

    if (despesas.length === 0) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Despesas
                </Typography>
                <DbEmptyState
                    title="Nenhuma despesa encontrada para o ano selecionado"
                    description="Selecione outro ano para visualizar as despesas."
                />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Despesas
            </Typography>

            {resumoGastos && !!ano && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {resumoGastos
                        .find((r) => r.ano === ano)
                        ?.categorias.map((cat, idx) => (
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
            )}

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
                    {despesas.map((despesa, index) => {
                        const isLast = despesas.length === index + 1;
                        return (
                            <Box key={index} ref={isLast ? lastDespesaElementRef : null}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body1">
                                                    {despesa.descricao}
                                                </Typography>
                                                <Link href={despesa.urlDocumento} target="_blank" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <OpenInNew />
                                                </Link>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    sx={{ display: 'block', mb: 0.5 }}
                                                >
                                                    {despesa.descricaoEspecificacao}
                                                </Typography>
                                                <Typography component="span" variant="body2" sx={{ display: 'block', mb: 0.5 }}>
                                                    Valor: {formatCurrency(Number(despesa.valorLiquido))}
                                                </Typography>
                                                <Typography component="span" variant="body2" sx={{ display: 'block', mb: 0.5 }}>
                                                    Fornecedor: {despesa.fornecedor}
                                                </Typography>
                                                <Typography component="span" variant="body2">
                                                    Data:{' '}
                                                    {new Date(despesa.dataEmissao).toLocaleDateString(
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
