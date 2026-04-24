import { useEffect } from 'react';
import { axiosClient } from '../lib/axiosCliente';
import { useAuth } from './useAuth';

export const useAxios = () => {
  const { logout, token } = useAuth();
  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        // Si el backen devuelve 401 ->cerrar sesion
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      },
    );

    // Limpiar interceptores al desmontar o cambiar token
    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logout]);

  return axiosClient;
};