import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

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
