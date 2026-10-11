import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

let pinged = false;

// Acorda o backend no Render (cold start) assim que o app carrega.
// Dispara e esquece: falhas não devem afetar a interface.
export const pingBackend = () => {
  if (pinged) return;
  pinged = true;

  axios.get(`${API_BASE_URL}/ping`).catch((error) => {
    console.debug('Ping ao backend falhou:', error);
  });
};
