import type { Deputado, PagedResponse, Despesa } from '@/types';
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
}
