import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  LogOut,
  Home,
  MapPin,
  CalendarDays,
  Heart,
  Bell,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import styles from './VoyageurLayout.module.css';

interface VoyageurLayoutProps {
  children: React.ReactNode;
}

const VoyageurLayout = ({ children }: VoyageurLayoutProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  const links = [
    { label: t('nav.dashboard'), href: '/dashboard', icon: <Home size={18} /> },
    { label: t('nav.logements'), href: '/logements', icon: <MapPin size={18} /> },
    { label: t('nav.reservations'), href: '/mes-reservations', icon: <CalendarDays size={18} /> },
    { label: t('nav.favoris'), href: '/favoris', icon: <Heart size={18} /> },
    { label: t('nav.notifications'), href: '/notifications', icon: <Bell size={18} /> },
    { label: t('nav.profil'), href: '/profil', icon: <User size={18} /> },
    { label: t('nav.parametres'), href: '/parametres', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/accueil');
  };

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Voyageur';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <LayoutGrid size={18} />
            </div>
            <div>
              <span className={styles.brandName}>HERGO</span>
              <span className={styles.roleBadge}>{t('nav.espace_voyageur')}</span>
            </div>
          </div>

          <nav className={styles.nav}>
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{t('nav.voyageur')}</span>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutBtn} title={t('nav.deconnexion')}>
            <LogOut size={16} />
            <span>{t('nav.deconnexion')}</span>
          </button>
        </div>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default VoyageurLayout;
