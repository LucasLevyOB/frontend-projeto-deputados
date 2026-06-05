export interface EstatisticasDeputado {
    gastosDespesas: number;
    projetosDeLei: number;
    totalProposicoes: number;
    scoreEficiencia: number;
    custoPorProjetoLei: number;
    custoPorProposicao: number;
}

export interface Deputado {
    _id: number;
    nome: string;
    urlFoto: string;
    estatisticas: EstatisticasDeputado;
    siglaPartido: string;
    siglaUf: string;
}
