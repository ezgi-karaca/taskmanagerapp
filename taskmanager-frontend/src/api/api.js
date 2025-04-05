import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const login = (data) => API.post('/auth/login', data);
