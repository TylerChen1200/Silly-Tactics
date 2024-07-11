// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api', // The backend server URL
});

export const fetchRandomUnits = () => API.get('/units');
export const fetchRandomItems = () => API.get('/items');
