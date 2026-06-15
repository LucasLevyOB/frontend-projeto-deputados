import type { Deputado, PagedResponse } from '@/types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export default class DepudadosAPI {
    private request;

    constructor() {
        this.request = axios.create({
            baseURL: API_BASE_URL
        });
    }

    public getDeputados = async (page: number = 1, limit: number = 20): Promise<PagedResponse<Deputado>> => {
        try {
            const response = await this.request.get(`/deputados?page=${page}&limit=${limit}`);
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
    }

    public getDeputado = async (id: number) => {
        const response = await this.request.get(`/deputados/${id}`);
        return response.data;
    }

}