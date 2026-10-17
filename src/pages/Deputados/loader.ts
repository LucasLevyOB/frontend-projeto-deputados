import DepudadosAPI from "@/services/DepudadosAPI";

import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const uf = url.searchParams.get('uf') || undefined;
    const siglaPartido = url.searchParams.get('siglaPartido') || undefined;
    const nome = url.searchParams.get('nome') || undefined;

    const api = new DepudadosAPI();
    const pagination = await api.getDeputados(page, 20, uf, siglaPartido, nome);

    return {
        pagination,
        filters: {
            page,
            uf: uf || '',
            siglaPartido: siglaPartido || '',
            nome: nome || '',
        },
    };
};
