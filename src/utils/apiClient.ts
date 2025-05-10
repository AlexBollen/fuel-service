import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

// Instancia 1 - API microservicio Pagos
export const apiClientPayments = axios.create({
  baseURL: process.env.PAYMENTS_API_URL, // ejemplo: http://localhost:3001
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia 2 - API microservicio Administración
const apiClientAdministration = axios.create({
  baseURL: process.env.ADMINISTRATION_API_URL, // ejemplo: http://localhost:3000
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClientAdministration