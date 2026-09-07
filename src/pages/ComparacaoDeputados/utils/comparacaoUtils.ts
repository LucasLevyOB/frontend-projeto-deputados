import type { Deputado } from '@/types';

export interface ComparacaoResultado {
  dep1Melhor: boolean;
  dep2Melhor: boolean;
}

export const determinarVencedor = (
  valor1: number,
  valor2: number,
  menorEMelhor: boolean = false
): ComparacaoResultado => {
  if (valor1 === valor2) {
    return { dep1Melhor: false, dep2Melhor: false };
  }

  if (menorEMelhor) {
    return {
      dep1Melhor: valor1 < valor2,
      dep2Melhor: valor2 < valor1,
    };
  }

  return {
    dep1Melhor: valor1 > valor2,
    dep2Melhor: valor2 > valor1,
  };
};

export const obterCorVoto = (voto?: string): 'success' | 'error' | 'default' => {
  if (!voto) return 'default';
  const v = voto.trim().toLowerCase();
  if (v.includes('sim')) return 'success';
  if (v.includes('não') || v.includes('nao')) return 'error';
  return 'default';
};

export const truncarTexto = (texto: string, maxCaracteres: number = 20): string => {
  if (texto.length <= maxCaracteres) {
    return texto;
  }
  return `${texto.slice(0, maxCaracteres).trim()}...`;
};

export interface CategoriaGastoItem {
  descricao: string;
  valor: number;
}

export const extrairPrincipaisGastos = (
  deputado: Deputado,
  limite: number = 3
): CategoriaGastoItem[] => {
  const listaCategorias: CategoriaGastoItem[] = [];

  if (deputado.resumoGastos && deputado.resumoGastos.length > 0) {
    const mapa = new Map<string, number>();

    deputado.resumoGastos.forEach((resumo) => {
      if (resumo.categorias) {
        resumo.categorias.forEach((cat) => {
          const atual = mapa.get(cat.descricao) || 0;
          mapa.set(cat.descricao, atual + cat.totalGasto);
        });
      }
    });

    mapa.forEach((valor, descricao) => {
      listaCategorias.push({ descricao, valor });
    });

    listaCategorias.sort((a, b) => b.valor - a.valor);
  }

  if (listaCategorias.length === 0 && deputado.estatisticas?.gastosDespesas) {
    listaCategorias.push({
      descricao: 'Despesas Gerais',
      valor: deputado.estatisticas.gastosDespesas,
    });
  }

  return listaCategorias.slice(0, limite);
};

export const extrairPrincipaisTemas = (
  deputado: Deputado,
  limite: number = 4
): string[] => {
  if (!deputado.estatisticas?.temasProposicoes) {
    return [];
  }

  const ordenados = [...deputado.estatisticas.temasProposicoes].sort(
    (a, b) => b.quantidade - a.quantidade
  );

  return ordenados.slice(0, limite).map((item) => item.tema);
};
