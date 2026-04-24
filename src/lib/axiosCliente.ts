import axios from 'axios';
import { env } from '../config/env';

export const axiosClient = axios.create({
  baseURL: env.API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

