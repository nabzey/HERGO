import { LayoutGrid, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Accueil', href: '/' },
        { label: 'Logements', href: '/logements' },
      ];
    }

    if (user.role === 'Voyageur') {
      return [
        { label: 'Accueil', href: '/' },
        { label: 'Logements', href: '/logements' },
        { label: 'Mes réservations', href: '/mes-reservations' },
        { label: 'Profil', href: '/profil' },
      ];
    } else if (user.role === 'Hôte') {
      return [
        { label: 'Accueil', href: '/' },
        { label: 'Espace Hôte', href: '/hote/dashboard' },
        { label: 'Mes logements', href: '/hote/mes-logements' },
        { label: 'Reservations', href: '/hote/reservations' },
      ];
    } else if (user.role === 'Admin') {
      return [
        { label: 'Accueil', href: '/' },
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Utilisateurs', href: '/admin/utilisateurs' },
        { label: 'Logements', href: '/admin/logements' },
        { label: 'Validation', href: '/admin/validation' },
        { label: 'Statistiques', href: '/admin/statistiques' },
      ];
    }

    return [];
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <LayoutGrid size={20} />
          </div>
          <span className={styles.logoText}>HERGO</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          {getNavLinks().map((link) => (
            <Link key={link.label} to={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {!isAuthenticated() ? (
            <>
              <Link to="/connexion" className={styles.btnConnexion}>
                Connexion
              </Link>
              <Link to="/inscription" className={styles.btnInscription}>
                Inscription
              </Link>
            </>
          ) : user ? (
            <>
              <span style={{ marginRight: '16px', color: 'var(--color-text)' }}>
                Bienvenue, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className={styles.btnDeconnexion}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
