import { createBrowserRouter } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { RootLayout } from '@/layouts/RootLayout';
import { DeputadoDetalhes } from '@/pages/DeputadoDetalhes/index';
import { Deputados } from '@/pages/Deputados';

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
        path: 'deputado/:id',
        element: <DeputadoDetalhes />,
      },
    ],
  },
]);
