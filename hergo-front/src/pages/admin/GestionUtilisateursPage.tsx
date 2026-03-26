import { useState } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, Search, UserX, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockUsers } from '../../data/adminMockData';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './GestionUtilisateursPage.module.css';

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const GestionUtilisateursPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('tous');

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'tous' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Gestion des Utilisateurs</h1>
        <p className={dStyles.pageSubtitle}>{mockUsers.length} utilisateurs inscrits</p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Rechercher un utilisateur..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          {['tous', 'Voyageur', 'Hôte', 'Admin'].map((r) => (
            <button key={r} className={`${styles.filterBtn} ${roleFilter === r ? styles.filterBtnActive : ''}`} onClick={() => setRoleFilter(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className={dStyles.tableWrapper}>
        <table className={dStyles.table}>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Inscription</th>
              <th>Réservations</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className={dStyles.avatarRow}>
                    <img src={u.avatar} alt={u.name} className={dStyles.avatarSmall} />
                    <div>
                      <div className={dStyles.avatarName}>{u.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-gray)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${dStyles.badge} ${u.role === 'Admin' ? dStyles.badgeGray : u.role === 'Hôte' ? dStyles.badgeYellow : dStyles.badgeGreen}`}>{u.role}</span>
                </td>
                <td>{u.joinDate}</td>
                <td>{u.reservations}</td>
                <td>
                  <span className={`${dStyles.badge} ${u.status === 'actif' ? dStyles.badgeGreen : u.status === 'suspendu' ? dStyles.badgeRed : dStyles.badgeGray}`}>{u.status}</span>
                </td>
                <td>
                  <div className={dStyles.actionGroup}>
                    {u.status !== 'suspendu'
                      ? <button className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`} title="Suspendre"><UserX size={13} /></button>
                      : <button className={`${dStyles.actionBtn} ${dStyles.actionBtnPrimary}`} title="Réactiver"><UserCheck size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default GestionUtilisateursPage;
