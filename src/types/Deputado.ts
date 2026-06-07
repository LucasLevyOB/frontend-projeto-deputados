export interface EstatisticasDeputado {
    gastosDespesas: number;
    projetosDeLei: number;
    totalProposicoes: number;
    scoreEficiencia: number;
    custoPorProjetoLei: number;
    custoPorProposicao: number;
}

export interface ResumoGastos {
    ano: number;
    totalGastos: number;
    meses: Array<{
        mes: number;
        totalGasto: number;
    }>;
}

export interface Deputado {
    _id: number;
    nome: string;
    urlFoto: string;
    estatisticas: EstatisticasDeputado;
    resumoGastos?: ResumoGastos[];
    siglaPartido: string;
    siglaUf: string;
    situacao: string;
    condicaoEleitoral: string;
    nomeEleitoral: string;
    descricaoStatus: string | null;
    gabinete: {
        nome: string | null;
        predio: string | null;
        sala: string | null;
        andar: string | null;
        telefone: string | null;
        email: string | null;
    };
    escolaridade: string | null;
}
