import { useMemo } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, TrendingUp, UserCheck, ClipboardList, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockUsers, mockReservations, allLogements, pendingLogements } from '../../data/adminMockData';
import { usersMockApi } from '../../services/usersMockApi';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './AdminDashboardPage.module.css';

export const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const AdminDashboardPage = () => {
  const currentUsers = useMemo(() => usersMockApi.getAll(), []);
  
  const roleCounts = useMemo(
    () => ({
      voyageurs: currentUsers.filter((user) => user.role === 'VOYAGEUR').length,
      hotes: currentUsers.filter((user) => user.role === 'HOTE').length,
      admins: currentUsers.filter((user) => user.role === 'ADMIN').length,
    }),
    [currentUsers]
  );

  const stats = [
    { label: 'Utilisateurs', value: currentUsers.length || mockUsers.length, change: 'base mock synchronisee', icon: <Users size={18} /> },
    { label: 'Logements', value: allLogements.length, change: '+2 actifs', icon: <Home size={18} /> },
    { label: 'Réservations', value: mockReservations.length, change: '+5 cette semaine', icon: <ClipboardList size={18} /> },
    { label: 'En attente', value: pendingLogements.length, change: 'À valider', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <DashboardLayout 
      links={ADMIN_LINKS} 
      role="admin"
    >
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Dashboard Admin</h1>
        <p className={dStyles.pageSubtitle}>Vue d'ensemble de la plateforme HERGO</p>
      </div>

      <div className={dStyles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={dStyles.statCard}>
            <div className={dStyles.statIcon}>{s.icon}</div>
            <span className={dStyles.statLabel}>{s.label}</span>
            <span className={dStyles.statValue}>{s.value}</span>
            <span className={dStyles.statChange}>{s.change}</span>
          </div>
        ))}
      </div>

      {/* Quick charts */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}><TrendingUp size={16} /> Réservations (6 derniers mois)</h3>
          <div className={styles.miniBarChart}>
            {[18, 24, 20, 35, 28, 32].map((v, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.bar} style={{ height: `${(v / 35) * 100}%` }} />
                <span className={styles.barLabel}>{['S', 'O', 'N', 'D', 'J', 'F'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}><UserCheck size={16} /> Répartition des utilisateurs</h3>
          <div className={styles.pieSection}>
            {[
              { label: 'Voyageurs', count: roleCounts.voyageurs, color: 'var(--color-primary)' },
              { label: 'Hôtes', count: roleCounts.hotes, color: '#b08aee' },
              { label: 'Admins', count: roleCounts.admins, color: '#7ec88a' },
            ].map(({ label, count, color }) => (
              <div key={label} className={styles.pieRow}>
                <div className={styles.pieDot} style={{ background: color }} />
                <span className={styles.pieLabel}>{label}</span>
                <div className={styles.pieBar}>
                  <div className={styles.pieBarFill} style={{ width: `${(count / Math.max(currentUsers.length || 1, 1)) * 100}%`, background: color }} />
                </div>
                <span className={styles.pieCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}><DollarSign size={16} /> Revenus mensuels (FCFA)</h3>
          <div className={styles.revenueList}>
            {[
              { mois: 'Décembre', val: '10 500 000' },
              { mois: 'Janvier', val: '8 400 000' },
              { mois: 'Février', val: '9 600 000' },
            ].map(({ mois, val }) => (
              <div key={mois} className={styles.revenueRow}>
                <span className={styles.revMois}>{mois}</span>
                <span className={styles.revVal}>{val} FCFA</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent users */}
      <div className={dStyles.tableWrapper}>
        <h2 className={dStyles.tableTitle}>Derniers utilisateurs</h2>
        <table className={dStyles.table}>
          <thead>
            <tr><th>Utilisateur</th><th>Rôle</th><th>Date inscription</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {(currentUsers.length ? currentUsers : [])
              .filter(u => u.role !== 'ADMIN')
              .slice(0, 4)
              .map((u) => (
              <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/admin/utilisateurs'}>
                <td>
                  <div className={dStyles.avatarRow}>
                    <img src={u.avatar || `https://i.pravatar.cc/40?u=${u.email}`} alt={`${u.firstName} ${u.lastName}`} className={dStyles.avatarSmall} />
                    <div>
                      <div className={dStyles.avatarName}>{`${u.firstName} ${u.lastName}`.trim()}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-gray)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`${dStyles.badge} ${u.role === 'ADMIN' ? dStyles.badgeGray : u.role === 'HOTE' ? dStyles.badgeYellow : dStyles.badgeGreen}`}>{u.role === 'ADMIN' ? 'Admin' : u.role === 'HOTE' ? 'Hôte' : 'Voyageur'}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td><span className={`${dStyles.badge} ${u.status === 'ACTIF' ? dStyles.badgeGreen : u.status === 'SUSPENDU' ? dStyles.badgeRed : dStyles.badgeGray}`}>{u.status === 'ACTIF' ? 'actif' : u.status === 'SUSPENDU' ? 'suspendu' : 'banni'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
