import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export default class DepudadosAPI {
    private request;

    constructor() {
        this.request = axios.create({
            baseURL: API_BASE_URL
        });
    }

    public getDeputados = async () => {
        const response = await this.request.get(`/deputados`);
        return response.data;
    }

    public getDeputado = async (id: number) => {
        const response = await this.request.get(`/deputados/${id}`);
        return response.data;
    }

}