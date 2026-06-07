import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { DbCardDeputado } from '@/components/DbCardDeputado';
import DepudadosAPI from '@/services/DepudadosAPI';

import type { Deputado } from '@/types';

export const Home = () => {
  const [deputados, setDeputados] = useState<Deputado[]>([]);

  const fetchDeputados = async () => {
    const api = new DepudadosAPI();
    const response = await api.getDeputados();

    setDeputados(response);
  };

  useEffect(() => {
    fetchDeputados();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {deputados.length === 0 ? (
        <Box>Loading...</Box>
      ) : (
        deputados.map((deputado) => (
          <DbCardDeputado key={deputado._id} deputado={deputado} />
        ))
      )}
    </Box>
  );
};
