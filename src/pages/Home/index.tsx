import { Box } from '@mui/material';
import DbCardDeputado from '@/components/DbCardDeputado';

import type { Deputado } from '@/types';

export const Home = () => {
  const deputadoExemplo: Deputado = {
    "_id": 204536,
    "nome": "Kim Kataguiri",
    "urlFoto": "https://www.camara.leg.br/internet/deputado/bandep/204536.jpg",
    "estatisticas": {
      "gastosDespesas": 570361.19,
      "projetosDeLei": 230,
      "totalProposicoes": 2151,
      "scoreEficiencia": 172,
      "custoPorProjetoLei": 2479.83126086956,
      "custoPorProposicao": 265.160943747094
    },
    "siglaPartido": "MISSÃO",
    "siglaUf": "SP"
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <DbCardDeputado deputado={deputadoExemplo} />
    </Box>
  );
};
