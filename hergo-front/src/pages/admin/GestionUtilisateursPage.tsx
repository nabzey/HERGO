import { useState, useEffect } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, Search, UserX, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminApi } from '../../core/api/api';
import { usersMockApi, type MockUserRecord } from '../../services/usersMockApi';
import dStyles from '../../components/DashboardLayout.module.css';
import Modal from '../../components/Modal';
import { useAuth } from '../../hooks/useAuth';
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

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  role: string;
  phone?: string | null;
  createdAt: string;
  updatedAt?: string;
  status: string;
}

const mapMockUser = (user: MockUserRecord): User => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  avatar: user.avatar || `https://i.pravatar.cc/40?u=${user.email}`,
  role: user.role === 'HOTE' ? 'Hôte' : user.role === 'ADMIN' ? 'Admin' : 'Voyageur',
  joinDate: new Date(user.createdAt).toLocaleDateString('fr-FR'),
  reservations: user.reservations,
  status: user.status === 'SUSPENDU' ? 'suspendu' : user.status === 'BANNI' ? 'banni' : 'actif',
});

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const GestionUtilisateursPage = () => {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('tous');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getAllUsers() as ApiUser[];
        usersMockApi.seedFromApi(data);
        
        // Filtrer les admins de la liste (on ne suit que les voyageurs et hôtes)
        const allUsers = usersMockApi.getAll()
          .map(mapMockUser)
          .filter(u => u.role !== 'Admin');
          
        setUsers(allUsers);
      } catch (err: unknown) {
        const allUsers = usersMockApi.getAll()
          .map(mapMockUser)
          .filter(u => u.role !== 'Admin');
        setUsers(allUsers);
        const error = err as Error;
        setError(error.message || 'Affichage des utilisateurs depuis la base mock locale');
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
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Utilisateur suspendu dans la base mock locale');
    }

    usersMockApi.update(id, { status: 'SUSPENDU' });
    setUsers(usersMockApi.getAll().map(mapMockUser).filter(u => u.role !== 'Admin'));
  };

  const handleReactivate = async (id: number) => {
    try {
      await adminApi.updateUser(id, { status: 'actif' });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Utilisateur réactivé dans la base mock locale');
    }

    usersMockApi.update(id, { status: 'ACTIF' });
    setUsers(usersMockApi.getAll().map(mapMockUser).filter(u => u.role !== 'Admin'));
  };

  if (loading) {
    return (
      <DashboardLayout links={ADMIN_LINKS} role="admin">
        <div className={dStyles.pageHeader}>
          <h1 className={dStyles.pageTitle}>Gestion des Utilisateurs</h1>
          <p>Chargement des utilisateurs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      links={ADMIN_LINKS} 
      role="admin" 
    >
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Gestion des Utilisateurs</h1>
        <p className={dStyles.pageSubtitle}>{users.length} utilisateurs enregistrés (Voyageurs & Hôtes)</p>
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
              <tr key={u.id} onClick={() => setSelectedUser(u)} style={{ cursor: 'pointer' }}>
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

      {/* Détails de l'utilisateur Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Détails de l'utilisateur"
        size="medium"
      >
        {selectedUser && (
          <div className={styles.userDetail}>
            <div className={styles.detailHeader}>
              <img src={selectedUser.avatar} alt={selectedUser.name} className={styles.detailAvatar} />
              <div>
                <h3 className={styles.detailName}>{selectedUser.name}</h3>
                <p className={styles.detailEmail}>{selectedUser.email}</p>
                <span className={`${dStyles.badge} ${selectedUser.role === 'Admin' ? dStyles.badgeGray : selectedUser.role === 'Hôte' ? dStyles.badgeYellow : dStyles.badgeGreen}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID Utilisateur</span>
                <span className={styles.detailValue}>#USR-{selectedUser.id.toString().padStart(5, '0')}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date d'inscription</span>
                <span className={styles.detailValue}>{selectedUser.joinDate}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Réservations</span>
                <span className={styles.detailValue}>{selectedUser.reservations}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Statut du compte</span>
                <span className={`${dStyles.badge} ${selectedUser.status === 'actif' ? dStyles.badgeGreen : selectedUser.status === 'suspendu' ? dStyles.badgeRed : dStyles.badgeGray}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className={styles.detailActions}>
              {selectedUser.status !== 'suspendu' ? (
                <button 
                  className={`${styles.actionBtn} ${styles.btnSuspend}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSuspend(selectedUser.id);
                    setSelectedUser({...selectedUser, status: 'suspendu'});
                  }}
                >
                  Suspendre le compte
                </button>
              ) : (
                <button 
                  className={`${styles.actionBtn} ${styles.btnReactivate}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(selectedUser.id);
                    setSelectedUser({...selectedUser, status: 'actif'});
                  }}
                >
                  Réactiver le compte
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default GestionUtilisateursPage;
