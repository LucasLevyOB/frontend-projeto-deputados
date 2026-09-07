import { createBrowserRouter } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { RootLayout } from '@/layouts/RootLayout';
import { DeputadoDetalhes } from '@/pages/DeputadoDetalhes';
import { Deputados } from '@/pages/Deputados';
import { ComparacaoDeputados } from '@/pages/ComparacaoDeputados';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'deputados',
        element: <Deputados />,
      },
      {
        path: 'comparar',
        element: <ComparacaoDeputados />,
      },
      {
        path: 'deputado/:id',
        element: <DeputadoDetalhes />,
      },
    ],
  },
]);

