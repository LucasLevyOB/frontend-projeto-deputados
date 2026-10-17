import type { Route } from './+types/DeputadoDetalhes';

export const meta = ({ loaderData }: Route.MetaArgs) => {
    if (!loaderData?.deputado) {
        return [
            { title: 'Deputado não encontrado | DepuDados' },
            {
                name: 'description',
                content: 'Deputado não encontrado na plataforma DepuDados.',
            },
        ];
    }

    const { deputado } = loaderData;
    const siglaPartidoUf =
        deputado.siglaPartido && deputado.siglaUf
            ? ` (${deputado.siglaPartido}-${deputado.siglaUf})`
            : '';
    const titulo = `${deputado.nome}${siglaPartidoUf} | DepuDados`;
    const descricao = `Confira gastos, proposições, presença em votações e dados biográficos do deputado federal ${deputado.nome}${siglaPartidoUf} na plataforma DepuDados.`;

    return [
        { title: titulo },
        { name: 'description', content: descricao },
        { property: 'og:title', content: titulo },
        { property: 'og:description', content: descricao },
        { property: 'og:image', content: deputado.urlFoto || '' },
        { property: 'og:type', content: 'profile' },
    ];
};