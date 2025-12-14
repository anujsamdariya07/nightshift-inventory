import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api';

console.log('Axios Base URL:', baseURL); // Debug log

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
