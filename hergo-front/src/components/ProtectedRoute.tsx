import { Navigate } from 'react-router-dom';
import { getDashboardRoute, useAuth } from '../hooks/useAuth';
import type { UserRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles = ['Voyageur', 'Hôte', 'Admin'] }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontSize: '1.2rem' 
      }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/accueil" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
