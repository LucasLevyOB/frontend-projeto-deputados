import type { Deputado, DeputadoResumo, PagedResponse, Despesa, Proposicao, Votacao, VotacaoComparadaItem } from '@/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export default class DepudadosAPI {
  private request;

  constructor() {
    this.request = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  public getDeputados = async (
    page: number = 1,
    limit: number = 20,
    uf?: string,
    siglaPartido?: string,
    nome?: string
  ): Promise<PagedResponse<Deputado>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (uf) params.append('uf', uf);
      if (siglaPartido) params.append('siglaPartido', siglaPartido);
      if (nome) params.append('nome', nome);

      const response = await this.request.get(
        `/deputados?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching deputies:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      };
    }
  };

  public buscarDeputados = async (
    nome?: string,
    page: number = 1,
    limit: number = 10,
    uf?: string,
    siglaPartido?: string
  ): Promise<PagedResponse<DeputadoResumo>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (nome) params.append('nome', nome);
      if (uf) params.append('uf', uf);
      if (siglaPartido) params.append('siglaPartido', siglaPartido);

      const response = await this.request.get(
        `/deputados/busca?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching deputies:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      };
    }
  };

  public getDeputado = async (id: number) => {
    const response = await this.request.get(`/deputados/${id}`);
    return response.data;
  };

  public getDespesasDeputado = async (
    id: number,
    page: number = 1,
    limit: number = 20,
    ano?: number,
    descricao?: string
  ): Promise<PagedResponse<Despesa>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (ano) {
        params.append('ano', ano.toString());
      }

      if (descricao) {
        params.append('descricao', descricao);
      }

      const response = await this.request.get(
        `/despesas/deputado/${id}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      };
    }
  };

  public getProposicoesDeputado = async (
    id: number,
    page: number = 1,
    limit: number = 20,
    siglaTipo?: string,
    ementa?: string,
    ano?: number
  ): Promise<PagedResponse<Proposicao>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (siglaTipo) {
        params.append('siglaTipo', siglaTipo);
      }

      if (ementa) {
        params.append('ementa', ementa);
      }

      if (ano) {
        params.append('ano', ano.toString());
      }

      const response = await this.request.get(
        `/proposicoes/deputado/${id}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching proposicoes:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      };
    }
  };

  public getVotacoesDeputado = async (
    id: number,
    page: number = 1,
    limit: number = 20,
    ementa?: string
  ): Promise<PagedResponse<Votacao>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (ementa) {
        params.append('ementa', ementa);
      }

      const response = await this.request.get(
        `/deputados/${id}/votacoes?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching votacoes:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
      };
    }
  };

  public getVotacoesComparadas = async (
    idDeputado1?: number | string,
    idDeputado2?: number | string,
    page: number = 1,
    limit: number = 5,
    ementa?: string
  ): Promise<PagedResponse<VotacaoComparadaItem>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (idDeputado1 != null) {
        params.append('deputado1', idDeputado1.toString());
      }
      if (idDeputado2 != null) {
        params.append('deputado2', idDeputado2.toString());
      }
      if (ementa) {
        params.append('ementa', ementa);
      }

      const response = await this.request.get(
        `/votacoes/comparar?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar votações comparadas:', error);
      return {
        data: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
      };
    }
  };
}
