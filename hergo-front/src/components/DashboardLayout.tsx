import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './DashboardLayout.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  links: NavItem[];
  children: React.ReactNode;
  role: 'hote' | 'admin';
  userName?: string;
  userAvatar?: string;
}

const DashboardLayout = ({
  links,
  children,
  role,
  userName = 'Fatou Seck',
  userAvatar = 'https://i.pravatar.cc/36?u=fatou',
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const roleLabel = role === 'hote' ? 'Espace Hôte' : 'Administration';
  const roleBadge = role === 'hote' ? styles.badgeHote : styles.badgeAdmin;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <LayoutGrid size={18} />
            </div>
            <div>
              <span className={styles.brandName}>HERGO</span>
              <span className={`${styles.roleBadge} ${roleBadge}`}>{roleLabel}</span>
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
            <img src={userAvatar} alt={userName} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{roleLabel}</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Déconnexion">
            <LogOut size={16} />
            <span>Quitter</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
