import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Rediriger vers la page correspondant au rôle de l'utilisateur
    if (user.role === 'Voyageur') {
      return <Navigate to="/profil" replace />;
    } else if (user.role === 'Hôte') {
      return <Navigate to="/hote/dashboard" replace />;
    } else if (user.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;