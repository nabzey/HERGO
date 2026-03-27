import { useState, useEffect } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, Search, EyeOff, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminApi } from '../../core/api/api';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from '../../pages/admin/GestionUtilisateursPage.module.css';

interface Logement {
  id: number;
  name: string;
  location: string;
  hote: string;
  type: string;
  price: string;
  reservations: number;
  status: string;
  image: string;
}

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const GestionLogementsPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogements = async () => {
      try {
        const data = await adminApi.getAllLogements() as Logement[];
        setLogements(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des logements');
      } finally {
        setLoading(false);
      }
    };
    fetchLogements();
  }, []);

  const filtered = logements.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'tous' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  const handlePublish = async (id: number) => {
    try {
      await adminApi.updateLogementStatus(id, { status: 'publié' });
      setLogements(logements.map(l =>
        l.id === id ? { ...l, status: 'publié' } : l
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la publication');
    }
  };

  const handleHide = async (id: number) => {
    try {
      await adminApi.updateLogementStatus(id, { status: 'masqué' });
      setLogements(logements.map(l =>
        l.id === id ? { ...l, status: 'masqué' } : l
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du masquage');
    }
  };

  if (loading) {
    return (
      <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
        <div className={dStyles.pageHeader}>
          <h1 className={dStyles.pageTitle}>Gestion des Logements</h1>
          <p>Chargement des logements...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Gestion des Logements</h1>
        <p className={dStyles.pageSubtitle}>{logements.length} logements sur la plateforme</p>
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

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Rechercher un logement..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          {['tous', 'Villa', 'Hôtel'].map((t) => (
            <button key={t} className={`${styles.filterBtn} ${typeFilter === t ? styles.filterBtnActive : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className={dStyles.tableWrapper}>
        <table className={dStyles.table}>
          <thead>
            <tr><th>Logement</th><th>Hôte</th><th>Type</th><th>Prix/nuit</th><th>Réservations</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id}>
                <td>
                  <div className={dStyles.avatarRow}>
                    <div className={dStyles.thumbWrapper}><img src={l.image} alt="" className={dStyles.thumb} /></div>
                    <div>
                      <div className={dStyles.avatarName}>{l.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-gray)' }}>{l.location}</div>
                    </div>
                  </div>
                </td>
                <td>{l.hote}</td>
                <td>{l.type}</td>
                <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{l.price} FCFA</td>
                <td>{l.reservations}</td>
                <td>
                  <span className={`${dStyles.badge} ${l.status === 'publié' ? dStyles.badgeGreen : l.status === 'brouillon' ? dStyles.badgeGray : dStyles.badgeRed}`}>{l.status}</span>
                </td>
                <td>
                  <div className={dStyles.actionGroup}>
                    {l.status === 'publié'
                      ? <button onClick={() => handleHide(l.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`} title="Masquer"><EyeOff size={13} /></button>
                      : <button onClick={() => handlePublish(l.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnPrimary}`} title="Publier"><Eye size={13} /></button>}
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

export default GestionLogementsPage;
