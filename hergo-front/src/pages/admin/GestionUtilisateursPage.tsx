import { useState, useEffect } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, Search, UserX, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminApi } from '../../core/api/api';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './GestionUtilisateursPage.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  reservations: number;
  status: string;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getAllUsers() as User[];
        setUsers(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'tous' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSuspend = async (id: number) => {
    try {
      await adminApi.updateUser(id, { status: 'suspendu' });
      setUsers(users.map(u =>
        u.id === id ? { ...u, status: 'suspendu' } : u
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la suspension');
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await adminApi.updateUser(id, { status: 'actif' });
      setUsers(users.map(u =>
        u.id === id ? { ...u, status: 'actif' } : u
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la réactivation');
    }
  };

  if (loading) {
    return (
      <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
        <div className={dStyles.pageHeader}>
          <h1 className={dStyles.pageTitle}>Gestion des Utilisateurs</h1>
          <p>Chargement des utilisateurs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Gestion des Utilisateurs</h1>
        <p className={dStyles.pageSubtitle}>{users.length} utilisateurs inscrits</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

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
                      ? <button onClick={() => handleSuspend(u.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`} title="Suspendre"><UserX size={13} /></button>
                      : <button onClick={() => handleReactivate(u.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnPrimary}`} title="Réactiver"><UserCheck size={13} /></button>}
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
