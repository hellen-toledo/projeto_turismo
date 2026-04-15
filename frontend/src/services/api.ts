import axios from 'axios';
import type { Cidade } from '../types/cidade';
import type { Evento } from '../types/evento';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const getCidadeById = async (id: string): Promise<Cidade> => {
  const { data } = await api.get(`/cidades/${id}`);
  return data;
};

export const getEventos = async (): Promise<Evento[]> => {
  const { data } = await api.get('/eventos');
  return data;
};