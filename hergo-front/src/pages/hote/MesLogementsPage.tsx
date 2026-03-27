import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Home, Plus, ClipboardList, Pencil, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { logementsApi } from '../../core/api/api';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './MesLogementsPage.module.css';

interface Logement {
  id: number;
  name: string;
  location: string;
  price: string;
  reservations: number;
  rating: number;
  status: string;
  image: string;
}

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
];

const MesLogementsPage = () => {
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogements = async () => {
      try {
        const data = await logementsApi.getAll() as Logement[];
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

  const handleDelete = async (id: number) => {
    try {
      await logementsApi.delete(id);
      setLogements(logements.filter(l => l.id !== id));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <DashboardLayout links={HOTE_LINKS} role="hote">
        <div className={dStyles.pageHeader}>
          <h1 className={dStyles.pageTitle}>Mes Logements</h1>
          <p>Chargement des logements...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote">
      <div className={dStyles.pageHeader}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={dStyles.pageTitle}>Mes Logements</h1>
            <p className={dStyles.pageSubtitle}>{logements.length} logements publiés</p>
          </div>
          <Link to="/hote/ajouter" className={styles.addBtn}><Plus size={15} /> Ajouter</Link>
        </div>
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

    <div className={dStyles.tableWrapper} style={{ marginTop: '1.5rem' }}>
      <table className={dStyles.table}>
        <thead>
          <tr>
            <th>Logement</th>
            <th>Localisation</th>
            <th>Prix</th>
            <th>Réservations</th>
            <th>Note</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logements.map((v) => (
            <tr key={v.id}>
              <td>
                <div className={dStyles.avatarRow}>
                  <div className={dStyles.thumbWrapper}><img src={v.image} alt="" className={dStyles.thumb} /></div>
                  <span className={dStyles.avatarName}>{v.name}</span>
                </div>
              </td>
              <td>{v.location}</td>
              <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{v.price}</td>
              <td>{v.reservations}</td>
              <td>{v.rating > 0 ? `★ ${v.rating}` : '—'}</td>
              <td>
                <span className={`${dStyles.badge} ${v.status === 'publié' ? dStyles.badgeGreen : v.status === 'brouillon' ? dStyles.badgeGray : dStyles.badgeRed}`}>{v.status}</span>
              </td>
              <td>
                <div className={dStyles.actionGroup}>
                  <Link to={`/logements/${v.id}`} className={`${dStyles.actionBtn} ${dStyles.actionBtnOutline}`} title="Voir"><Eye size={13} /></Link>
                  <Link to={`/hote/modifier/${v.id}`} className={`${dStyles.actionBtn} ${dStyles.actionBtnOutline}`} title="Modifier"><Pencil size={13} /></Link>
                  <button onClick={() => handleDelete(v.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`} title="Supprimer"><Trash2 size={13} /></button>
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

export default MesLogementsPage;
