import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { reservationsApi } from '../../core/api/api';
import styles from './MesReservationsPage.module.css';

interface Reservation {
  id: number;
  idVoyageur: number;
  idLogement: number;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  prixTotal: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  titre: string;
  ville: string;
  pays: string;
}

type FilterType = 'toutes' | 'confirmée' | 'en attente' | 'annulée';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  confirmée: { label: 'Confirmée', icon: <CheckCircle size={13} />, cls: 'green' },
  'en attente': { label: 'En attente', icon: <Clock size={13} />, cls: 'yellow' },
  annulée: { label: 'Annulée', icon: <XCircle size={13} />, cls: 'red' },
};

const MesReservationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('toutes');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await reservationsApi.getAll() as unknown as { reservations: Reservation[] };
        setReservations(response.reservations || []);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filtered: Reservation[] =
    filter === 'toutes' ? reservations : reservations.filter((r) => r.statut === filter);

  const handleCancel = async (id: number) => {
    try {
      await reservationsApi.cancel(id);
      setReservations(reservations.map(r =>
        r.id === id ? { ...r, statut: 'annulée' } : r
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de l\'annulation');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <p>Chargement des réservations...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
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
        <h1 className={styles.pageTitle}>Mes Réservations</h1>
        <p className={styles.pageSubtitle}>Retrouvez l'ensemble de vos séjours passés et à venir</p>

        <div className={styles.filters}>
          {(['toutes', 'confirmée', 'en attente', 'annulée'] as FilterType[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {filtered.length === 0 && <p className={styles.empty}>Aucune réservation trouvée.</p>}
          {filtered.map((r) => {
            const status = STATUS_CONFIG[r.statut];
            const badgeCls =
              status.cls === 'green' ? styles.badgeGreen : status.cls === 'yellow' ? styles.badgeYellow : styles.badgeRed;
            
            // Calculer le nombre de nuits
            const dateDebut = new Date(r.dateDebut);
            const dateFin = new Date(r.dateFin);
            const nuits = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div
                key={r.id}
                className={styles.card}
                onClick={() => navigate(`/mes-reservations/${r.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImg}>
                  <img src="/placeholder.jpg" alt={r.titre} className={styles.img} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.villaName}>{r.titre}</h3>
                    <span className={`${styles.badge} ${badgeCls}`}>{status.icon}{status.label}</span>
                  </div>
                  <p className={styles.location}><MapPin size={13} /> {r.ville}, {r.pays}</p>
                  <div className={styles.dates}>
                    <div className={styles.dateChip}><CalendarDays size={13} /><span>Arrivée : <strong>{new Date(r.dateDebut).toLocaleDateString('fr-FR')}</strong></span></div>
                    <span className={styles.dateSep}>→</span>
                    <div className={styles.dateChip}><CalendarDays size={13} /><span>Départ : <strong>{new Date(r.dateFin).toLocaleDateString('fr-FR')}</strong></span></div>
                    <div className={styles.nightsChip}>{nuits} nuits</div>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span className={styles.montant}>{r.prixTotal.toLocaleString('fr-FR')} FCFA</span>
                  <span className={styles.montantLbl}>Total payé</span>
                  {r.statut === 'en attente' && (
                    <button
                      className={styles.cancelBtn}
                      onClick={(e) => { e.stopPropagation(); handleCancel(r.id); }}
                    >
                      Annuler
                    </button>
                  )}
                  {r.statut === 'confirmée' && (
                    <button
                      className={styles.reviewBtn}
                      onClick={(e) => { e.stopPropagation(); navigate(`/avis/${r.id}`); }}
                    >
                      Laisser un avis
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MesReservationsPage;
