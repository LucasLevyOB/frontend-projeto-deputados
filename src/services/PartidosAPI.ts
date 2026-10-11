import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default class PartidosAPI {
    private request;

    constructor() {
        this.request = axios.create({
            baseURL: API_BASE_URL
        });
    }

    public getPartidos = async () => {
        try {
            const response = await this.request.get('/partidos');
            return response.data;
        } catch (error) {
            console.error('Error fetching partidos:', error);
            return [];
        }
    }
}
