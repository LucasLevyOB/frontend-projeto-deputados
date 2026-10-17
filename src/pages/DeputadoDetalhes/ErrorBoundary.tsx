import { isRouteErrorResponse, useRouteError } from "react-router";
import { DbErrorBoundary } from "@/components/DbErrorBoundary";

export const ErrorBoundary = () => {
    const erro = useRouteError();
    const is404 = isRouteErrorResponse(erro) && erro.status === 404;

    return <DbErrorBoundary title={is404 ? 'Deputado não encontrado' : 'Erro ao carregar dados'} description={is404 ? 'Não encontramos nenhum deputado com o identificador informado na base de dados.' : 'Ocorreu uma instabilidade ao obter as informações deste parlamentar. Tente novamente mais tarde.'} />
};