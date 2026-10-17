import DepudadosAPI from "@/services/DepudadosAPI";

import type { Deputado } from "@/types";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const idNumber = Number(params.id);
    if (!idNumber || Number.isNaN(idNumber)) {
        throw new Response('Identificador de deputado inválido.', { status: 400 });
    }

    const api = new DepudadosAPI();
    const response = await api.getDeputado(idNumber);
    const deputadoEncontrado: Deputado | undefined = response?.[0];

    if (!deputadoEncontrado) {
        throw new Response('Deputado não encontrado.', { status: 404 });
    }

    return { deputado: deputadoEncontrado };
};