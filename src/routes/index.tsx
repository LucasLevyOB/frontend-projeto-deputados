import { createBrowserRouter } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { RootLayout } from '@/layouts/RootLayout';
import { DeputadoDetalhes } from '@/pages/DeputadoDetalhes';

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
        path: 'deputado/:id',
        element: <DeputadoDetalhes />,
      },
    ],
  },
]);
