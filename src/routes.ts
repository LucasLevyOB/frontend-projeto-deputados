import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('layouts/RootLayout.tsx', [
    index('pages/Home.tsx'),
    route('deputados', 'pages/Deputados.tsx'),
    route('comparar', 'pages/ComparacaoDeputados/ComparacaoDeputados.tsx'),
    route('deputado/:id', 'pages/DeputadoDetalhes/DeputadoDetalhes.tsx'),
  ]),
] satisfies RouteConfig;
