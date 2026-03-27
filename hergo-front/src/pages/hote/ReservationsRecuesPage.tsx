import { useState, useEffect } from 'react';
import { LayoutGrid, Home, Plus, ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { reservationsApi } from '../../core/api/api';
import dStyles from '../../components/DashboardLayout.module.css';

interface Reservation {
  id: number;
  villaName: string;
  image: string;
  voyageur: string;
  avatar?: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  montant: string;
  status: string;
}

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
];

type FilterType = 'toutes' | 'confirmée' | 'en attente' | 'annulée';

const ReservationsRecuesPage = () => {
  const [filter, setFilter] = useState<FilterType>('toutes');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsApi.getAll() as Reservation[];
        setReservations(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filtered = filter === 'toutes' ? reservations : reservations.filter((r) => r.status === filter);

  const handleConfirm = async (id: number) => {
    try {
      await reservationsApi.updateStatus(id, { status: 'confirmée' });
      setReservations(reservations.map(r =>
        r.id === id ? { ...r, status: 'confirmée' } : r
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la confirmation');
    }
  };

  const handleRefuse = async (id: number) => {
    try {
      await reservationsApi.updateStatus(id, { status: 'annulée' });
      setReservations(reservations.map(r =>
        r.id === id ? { ...r, status: 'annulée' } : r
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du refus');
    }
  };

  const filterStyles: React.CSSProperties = {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem 2rem 0',
  };

  if (loading) {
    return (
      <DashboardLayout links={HOTE_LINKS} role="hote">
        <div className={dStyles.pageHeader}>
          <h1 className={dStyles.pageTitle}>Réservations Reçues</h1>
          <p>Chargement des réservations...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Réservations Reçues</h1>
        <p className={dStyles.pageSubtitle}>{reservations.length} réservations au total</p>
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

      {/* Filter pills */}
      <div style={filterStyles}>
        {(['toutes', 'confirmée', 'en attente', 'annulée'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              border: `1px solid ${filter === f ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: filter === f ? 700 : 500,
              color: filter === f ? 'var(--color-primary)' : 'var(--color-text-gray)',
              background: filter === f ? 'rgba(201,165,112,0.1)' : 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              transition: 'all 0.18s ease',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={dStyles.tableWrapper}>
        <table className={dStyles.table}>
          <thead>
            <tr>
              <th>Villa</th>
              <th>Voyageur</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Nuits</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className={dStyles.avatarRow}>
                    <div className={dStyles.thumbWrapper}><img src={r.image} alt="" className={dStyles.thumb} /></div>
                    <span className={dStyles.avatarName}>{r.villaName}</span>
                  </div>
                </td>
                <td>
                  <div className={dStyles.avatarRow}>
                    <img src={r.avatar} alt={r.voyageur} className={dStyles.avatarSmall} />
                    {r.voyageur}
                  </div>
                </td>
                <td>{r.dateArrivee}</td>
                <td>{r.dateDepart}</td>
                <td>{r.nuits}</td>
                <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{r.montant}</td>
                <td>
                  <span className={`${dStyles.badge} ${r.status === 'confirmée' ? dStyles.badgeGreen : r.status === 'en attente' ? dStyles.badgeYellow : dStyles.badgeRed}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === 'en attente' && (
                    <div className={dStyles.actionGroup}>
                      <button onClick={() => handleConfirm(r.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnPrimary}`} title="Confirmer"><CheckCircle size={13} /></button>
                      <button onClick={() => handleRefuse(r.id)} className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`} title="Refuser"><XCircle size={13} /></button>
                    </div>
                  )}
                  {r.status !== 'en attente' && <span style={{ color: 'var(--color-text-light)', fontSize: '0.75rem' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ReservationsRecuesPage;
