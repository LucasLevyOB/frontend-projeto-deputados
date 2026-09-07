export interface VotacaoComparadaItem {
  idProposicao: number;
  siglaNumeroAno: string;
  tituloResumo: string;
  ementaCompleta?: string;
  votoDeputado1?: string;
  votoDeputado2?: string;
}

export const MOCK_VOTACOES_COMPARADAS: VotacaoComparadaItem[] = [
  {
    idProposicao: 2442023,
    siglaNumeroAno: 'PL 244/2023',
    tituloResumo: 'Reforma Tributária',
    ementaCompleta: 'Altera o Sistema Tributário Nacional para simplificar impostos sobre consumo.',
    votoDeputado1: 'Sim',
    votoDeputado2: 'Não',
  },
  {
    idProposicao: 10852023,
    siglaNumeroAno: 'PL 1085/2023',
    tituloResumo: 'Igualdade Salarial',
    ementaCompleta: 'Dispõe sobre a igualdade salarial e de critérios remuneratórios entre mulheres e homens.',
    votoDeputado1: 'Sim',
    votoDeputado2: 'Abstenção',
  },
  {
    idProposicao: 9312024,
    siglaNumeroAno: 'PL 931/2024',
    tituloResumo: 'Marco Fiscal',
    ementaCompleta: 'Institui regime fiscal sustentável para garantir a estabilidade macroeconômica do país.',
    votoDeputado1: 'Não',
    votoDeputado2: 'Sim',
  },
];
