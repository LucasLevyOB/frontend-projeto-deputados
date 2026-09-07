import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Pagination,
  Tooltip,
} from '@mui/material';
import { obterCorVoto } from '../utils/comparacaoUtils';
import DepudadosAPI from '@/services/DepudadosAPI';
import type { Deputado, VotacaoComparadaItem } from '@/types';

interface ComparacaoVotacoesProps {
  deputado1: Deputado | null;
  deputado2: Deputado | null;
  votacoesIniciais?: VotacaoComparadaItem[];
}

export const ComparacaoVotacoes = ({
  deputado1,
  deputado2,
  votacoesIniciais,
}: ComparacaoVotacoesProps) => {
  const [votacoes, setVotacoes] = useState<VotacaoComparadaItem[]>(votacoesIniciais || []);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const carregarVotacoes = async (page: number) => {
    const id1 = deputado1?._id;
    const id2 = deputado2?._id;

    if (!id1 && !id2) {
      setVotacoes([]);
      setTotalPaginas(0);
      return;
    }

    setLoading(true);
    try {
      const api = new DepudadosAPI();
      const resposta = await api.getVotacoesComparadas(id1, id2, page, 5);
      setVotacoes(resposta.data || []);
      setTotalPaginas(resposta.totalPages || 0);
    } catch (error) {
      console.error('Erro ao carregar comparação de votações:', error);
      setVotacoes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagina(1);
    carregarVotacoes(1);
  }, [deputado1?._id, deputado2?._id]);

  const handleMudarPagina = (_: React.ChangeEvent<unknown>, novaPagina: number) => {
    setPagina(novaPagina);
    carregarVotacoes(novaPagina);
  };

  const renderizarSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 3; i++) {
      skeletons.push(
        <Box
          key={`skeleton-${i}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1.5, sm: 3 },
            width: '100%',
            maxWidth: 700,
          }}
        >
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
          </Box>
          <Card
            sx={{
              width: { xs: 180, sm: 240 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              py: 1,
            }}
          >
            <CardContent sx={{ p: '8px 12px !important' }}>
              <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
              <Skeleton variant="text" width="90%" sx={{ mx: 'auto', mt: 0.5 }} />
            </CardContent>
          </Card>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
          </Box>
        </Box>
      );
    }
    return skeletons;
  };

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Votações
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          alignItems: 'center',
          width: '100%',
        }}
      >
        {loading ? (
          renderizarSkeletons()
        ) : votacoes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
            Nenhuma votação encontrada para os deputados selecionados.
          </Typography>
        ) : (
          votacoes.map((item) => {
            const corVoto1 = obterCorVoto(item.votoDeputado1 ?? undefined);
            const corVoto2 = obterCorVoto(item.votoDeputado2 ?? undefined);

            return (
              <Box
                key={item.idVotacao}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 1.5, sm: 3 },
                  width: '100%',
                  maxWidth: 700,
                }}
              >
                {/* Voto Deputado 1 */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {deputado1 ? (
                    <Chip
                      label={item.votoDeputado1 || 'Sem Voto'}
                      color={corVoto1}
                      sx={{
                        minWidth: 80,
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                      }}
                    />
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={80}
                      height={32}
                      sx={{ borderRadius: 4 }}
                    />
                  )}
                </Box>

                {/* Card Central da Proposição com Tooltip */}
                <Tooltip
                  title={item.ementaCompleta || item.tituloResumo}
                  arrow
                  placement="top"
                >
                  <Card
                    sx={{
                      width: { xs: 180, sm: 240 },
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid',
                      borderColor: 'divider',
                      textAlign: 'center',
                      py: 1,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: '8px 12px !important' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold', lineHeight: 1.2 }}
                      >
                        {item.siglaNumeroAno}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mt: 0.5,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.tituloResumo}
                      </Typography>
                    </CardContent>
                  </Card>
                </Tooltip>

                {/* Voto Deputado 2 */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  {deputado2 ? (
                    <Chip
                      label={item.votoDeputado2 || 'Sem Voto'}
                      color={corVoto2}
                      sx={{
                        minWidth: 80,
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                      }}
                    />
                  ) : (
                    <Skeleton
                      variant="rounded"
                      width={80}
                      height={32}
                      sx={{ borderRadius: 4 }}
                    />
                  )}
                </Box>
              </Box>
            );
          })
        )}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPaginas}
              page={pagina}
              onChange={handleMudarPagina}
              color="primary"
              size="small"
              disabled={loading}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
