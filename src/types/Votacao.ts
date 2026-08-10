export interface DeputadoVotacao {
    id: string;
    uri: string;
    nome: string;
    siglaPartido: string;
    uriPartido: string;
    siglaUf: string;
    idLegislatura: string;
    urlFoto: string;
}

export interface UltimaAberturaVotacao {
    dataHoraRegistro: string;
    descricao: string;
}

export interface UltimaApresentacaoProposicao {
    dataHoraRegistro: string;
    descricao: string;
    idProposicao: number;
    uriProposicao: string;
}

export interface DetalheVotacao {
    _id: string;
    id: string;
    uri: string;
    data: string;
    dataHoraRegistro: string;
    idOrgao: number;
    uriOrgao?: string;
    siglaOrgao: string;
    idEvento?: number;
    uriEvento?: string;
    aprovacao: number;
    votosSim: number;
    votosNao: number;
    votosOutros: number;
    descricao: string;
    ultimaAberturaVotacao?: UltimaAberturaVotacao;
    ultimaApresentacaoProposicao?: UltimaApresentacaoProposicao;
}

export interface ProposicaoVotacao {
    _id: string;
    id: number;
    uri: string;
    siglaTipo: string;
    numero: number;
    ano: number;
    ementa: string;
    temas?: string[];
}

export interface Votacao {
    _id: string;
    idVotacao: string;
    uriVotacao: string;
    dataHoraVoto: string;
    voto: string;
    deputado_: DeputadoVotacao;
    votacao_: DetalheVotacao;
    proposicao_?: ProposicaoVotacao;
}
