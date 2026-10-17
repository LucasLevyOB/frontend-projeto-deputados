import type { Route } from './+types/Deputados';

export const meta = ({ loaderData }: Route.MetaArgs) => {
    const filters = loaderData?.filters;
    const tituloBase = 'Deputados Federais | DepuDados';
    const descricaoBase =
        'Acompanhe a atuação, cota parlamentar, despesas e proposições dos deputados federais na Câmara dos Deputados.';

    if (!filters) {
        return [
            { title: tituloBase },
            { name: 'description', content: descricaoBase },
            { property: 'og:title', content: tituloBase },
            { property: 'og:description', content: descricaoBase },
        ];
    }

    const prefixoTitulo = (() => {
        if (filters.nome) {
            return `Deputados: "${filters.nome}"`;
        }
        if (filters.uf && filters.siglaPartido) {
            return `Deputados de ${filters.uf} (${filters.siglaPartido})`;
        }
        if (filters.uf) {
            return `Deputados Federais de ${filters.uf}`;
        }
        if (filters.siglaPartido) {
            return `Deputados Federais do ${filters.siglaPartido}`;
        }
        return 'Deputados Federais';
    })();

    const sufixoPagina = filters.page > 1 ? ` - Página ${filters.page}` : '';
    const tituloFinal = `${prefixoTitulo}${sufixoPagina} | DepuDados`;

    const filtrosTexto = [filters.nome, filters.uf, filters.siglaPartido]
        .filter(Boolean)
        .join(', ');

    const descricaoFinal = filtrosTexto
        ? `Consulte gastos, presenças e projetos dos deputados federais filtrados (${filtrosTexto}) na plataforma DepuDados.`
        : descricaoBase;

    return [
        { title: tituloFinal },
        { name: 'description', content: descricaoFinal },
        { property: 'og:title', content: tituloFinal },
        { property: 'og:description', content: descricaoFinal },
    ];
};