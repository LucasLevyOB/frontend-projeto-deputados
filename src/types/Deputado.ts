export interface EstatisticasDeputado {
    gastosDespesas: number;
    projetosDeLei: number;
    totalProposicoes: number;
    scoreEficiencia: number;
    custoPorProjetoLei: number;
    custoPorProposicao: number;
    temasProposicoes?: Array<{ tema: string; quantidade: number }>;
}

export interface ResumoGastos {
    ano: number;
    totalGastos: number;
    meses: Array<{
        mes: number;
        totalGasto: number;
    }>;
    categorias: Array<{
        descricao: string;
        totalGasto: number;
    }>;
}

export interface ResumoProposicoes {
    ano: number;
    total: number;
    meses: Array<{
        mes: number;
        projetosDeLei: number;
        outrasProposicoes: number;
    }>;
    tipos: Array<{
        siglaTipo: string;
        descricaoTipo: string;
        quantidade: number;
    }>;
}

export interface Deputado {
    _id: number;
    nome: string;
    urlFoto: string;
    estatisticas: EstatisticasDeputado;
    resumoGastos?: ResumoGastos[];
    resumoProposicoes?: ResumoProposicoes[];
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
    urlRedeSocial: string[] | null;
}
