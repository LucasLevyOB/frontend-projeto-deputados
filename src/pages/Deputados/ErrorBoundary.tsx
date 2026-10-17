import { useRouteError } from "react-router";
import { DbErrorBoundary } from "@/components/DbErrorBoundary";

export const ErrorBoundary = () => {
    const erro = useRouteError();
    console.error('Erro na rota de deputados:', erro);

    return <DbErrorBoundary title="Erro ao carregar deputados" description="Não foi possível carregar a lista de parlamentares no momento. Por favor, tente recarregar a página." />
};
