import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '../../../shared/components/LoadingState';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const AdminRoute = () => {
  const { isAuthenticated, isInitializing } = useAdminAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoadingState label="Validando sessão administrativa..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
