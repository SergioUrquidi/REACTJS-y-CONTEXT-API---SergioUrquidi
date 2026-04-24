import { use } from 'react';
import { AlertContext } from '../context/alert';

export const useAlert = () => {
  const context = use(AlertContext);
  if (!context) {
    throw new Error('AlertContext debe usararse dentro de un AlertProvider');
  }
  return context;
};
