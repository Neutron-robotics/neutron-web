import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_NEUTRON_SERVER_URL, 
  headers: {
    timeout : 1000,
  }
});

export default api;