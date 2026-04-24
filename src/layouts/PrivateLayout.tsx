import { Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../components';
import { useAuth } from '../hooks';

export const PrivateLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
