import { LayoutGrid, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/accueil');
  };

  const homeHref = '/accueil';

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Accueil', href: '/accueil' },
        { label: 'Logements', href: '/logements' },
      ];
    }

    if (user.role === 'Voyageur') {
      return [
        { label: 'Accueil', href: '/accueil' },
        { label: 'Logements', href: '/logements' },
        { label: 'Dashboard', href: '/dashboard' },
      ];
    } else if (user.role === 'Hôte') {
      return [
        { label: 'Accueil', href: '/accueil' },
        { label: 'Logements', href: '/logements' },
        { label: 'Espace Hôte', href: '/hote/dashboard' },
        { label: 'Mes logements', href: '/hote/mes-logements' },
        { label: 'Reservations', href: '/hote/reservations' },
      ];
    } else if (user.role === 'Admin') {
      return [
        { label: 'Accueil', href: '/accueil' },
        { label: 'Logements', href: '/logements' },
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
        <NavLink to={homeHref} className={styles.logo}>
          <div className={styles.logoIcon}>
            <LayoutGrid size={20} />
          </div>
          <span className={styles.logoText}>HERGO</span>
        </NavLink>

        {/* Navigation */}
        <nav className={styles.nav}>
          {getNavLinks().map((link) => (
            <NavLink
              key={`${link.label}-${link.href}`}
              to={link.href}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {!isAuthenticated() ? (
            <>
              <NavLink to="/connexion" className={styles.btnConnexion}>
                Connexion
              </NavLink>
              <NavLink to="/inscription" className={styles.btnInscription}>
                Inscription
              </NavLink>
            </>
          ) : user ? (
            <>
              <span style={{ marginRight: '16px', color: 'var(--color-text)' }}>
                Bienvenue, {[user.firstName, user.lastName].filter(Boolean).join(' ')}
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
