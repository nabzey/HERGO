import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mockReservations } from '../../data/adminMockData';
import type { Reservation } from '../../data/adminMockData';
import styles from './MesReservationsPage.module.css';

type FilterType = 'toutes' | 'confirmée' | 'en attente' | 'annulée';

const STATUS_CONFIG = {
  confirmée: { label: 'Confirmée', icon: <CheckCircle size={13} />, cls: 'green' },
  'en attente': { label: 'En attente', icon: <Clock size={13} />, cls: 'yellow' },
  annulée: { label: 'Annulée', icon: <XCircle size={13} />, cls: 'red' },
};

const MesReservationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('toutes');

  const filtered: Reservation[] =
    filter === 'toutes' ? mockReservations : mockReservations.filter((r) => r.status === filter);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
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
            const status = STATUS_CONFIG[r.status];
            const badgeCls =
              status.cls === 'green' ? styles.badgeGreen : status.cls === 'yellow' ? styles.badgeYellow : styles.badgeRed;
            return (
              <div
                key={r.id}
                className={styles.card}
                onClick={() => navigate(`/mes-reservations/${r.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImg}>
                  <img src={r.image} alt={r.villaName} className={styles.img} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.villaName}>{r.villaName}</h3>
                    <span className={`${styles.badge} ${badgeCls}`}>{status.icon}{status.label}</span>
                  </div>
                  <p className={styles.location}><MapPin size={13} /> {r.location}</p>
                  <div className={styles.dates}>
                    <div className={styles.dateChip}><CalendarDays size={13} /><span>Arrivée : <strong>{r.dateArrivee}</strong></span></div>
                    <span className={styles.dateSep}>→</span>
                    <div className={styles.dateChip}><CalendarDays size={13} /><span>Départ : <strong>{r.dateDepart}</strong></span></div>
                    <div className={styles.nightsChip}>{r.nuits} nuits</div>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span className={styles.montant}>{r.montant}</span>
                  <span className={styles.montantLbl}>Total payé</span>
                  {r.status === 'en attente' && (
                    <button
                      className={styles.cancelBtn}
                      onClick={(e) => { e.stopPropagation(); navigate(`/mes-reservations/${r.id}`); }}
                    >
                      Annuler
                    </button>
                  )}
                  {r.status === 'confirmée' && (
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
