import { useContext } from 'react';
import { AuthContext } from '../context/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe estar dentro de AuthProvider');
  }
  return context;
};
