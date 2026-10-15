import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { LinksFunction, MetaFunction } from 'react-router';
import { AppThemeProvider } from '@/theme';

export const meta: MetaFunction = () => [
  { title: 'DepuDados | Transparência e Gastos de Deputados Federais' },
  {
    name: 'description',
    content:
      'DepuDados - Portal de transparência pública para consulta, análise e acompanhamento dos gastos e atividades de deputados federais.',
  },
  { name: 'msapplication-TileColor', content: '#ffffff' },
  { name: 'theme-color', content: '#ffffff' },
];

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  },
];

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-br">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

const Root = () => (
  <AppThemeProvider>
    <Outlet />
  </AppThemeProvider>
);

export default Root;
