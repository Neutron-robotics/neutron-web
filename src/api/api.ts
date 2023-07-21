import axios from 'axios';

console.log("use api ",process.env.REACT_APP_API_URL )

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    timeout : 1000,
  }
});

export default api;