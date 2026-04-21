import { useState } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { pendingLogements } from '../../data/adminMockData';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './ValidationLogementsPage.module.css';

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const ValidationLogementsPage = () => {
  const { user: currentUser } = useAuth();
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [selectedLogement, setSelectedLogement] = useState<any>(null);

  const pending = pendingLogements.filter((l) => !dismissed.includes(l.id));

  const currentAdminName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Aissatou Fall';
  const currentAdminAvatar = currentUser?.avatar || "https://i.pravatar.cc/36?u=aissatou";

  return (
    <DashboardLayout 
      links={ADMIN_LINKS} 
      role="admin" 
      userName={currentAdminName} 
      userAvatar={currentAdminAvatar}
    >
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Validation des Logements</h1>
        <p className={dStyles.pageSubtitle}>{pending.length} logement(s) en attente de validation</p>
      </div>

      <div className={styles.list}>
        {pending.length === 0 && (
          <div className={styles.empty}>
            <ShieldCheck size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
            <p>Tous les logements ont été traités.</p>
          </div>
        )}
        {pending.map((l) => (
          <div key={l.id} className={styles.card}>
            <div className={styles.cardImg}>
              <img src={l.image} alt={l.name} className={styles.img} />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.badgeRow}>
                <span className={`${dStyles.badge} ${dStyles.badgeYellow}`}>En attente</span>
                <span className={`${dStyles.badge} ${dStyles.badgeGray}`}>{l.type}</span>
              </div>
              <h3 className={styles.name}>{l.name}</h3>
              <p className={styles.meta}>Hôte : <strong>{l.hote}</strong> · {l.location}</p>
              <p className={styles.price}>{l.price}</p>
              <p className={styles.submitDate}>Soumis le {l.submittedDate}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.viewBtn} onClick={() => setSelectedLogement(l)}><Eye size={15} /> Voir détails</button>
              <button className={styles.approveBtn} onClick={() => setDismissed((prev) => [...prev, l.id])}>
                <CheckCircle size={15} /> Approuver
              </button>
              <button className={styles.rejectBtn} onClick={() => setDismissed((prev) => [...prev, l.id])}>
                <XCircle size={15} /> Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Détails du logement Modal */}
      <Modal
        isOpen={!!selectedLogement}
        onClose={() => setSelectedLogement(null)}
        title="Détails du logement"
        size="large"
      >
        {selectedLogement && (
          <div className={styles.logementDetail}>
            <div className={styles.detailGrid}>
              <div className={styles.imageCol}>
                <img src={selectedLogement.image} alt={selectedLogement.name} className={styles.largeImg} />
                <div className={styles.thumbnails}>
                  <img src={selectedLogement.image} alt="thumb" className={styles.thumb} />
                  <div className={styles.thumbPlaceholder}>+3 photos</div>
                </div>
              </div>
              
              <div className={styles.infoCol}>
                <div className={styles.detailBadgeRow}>
                  <span className={`${dStyles.badge} ${dStyles.badgeYellow}`}>En attente de validation</span>
                  <span className={`${dStyles.badge} ${dStyles.badgeGray}`}>{selectedLogement.type}</span>
                </div>
                <h2 className={styles.detailTitle}>{selectedLogement.name}</h2>
                <p className={styles.detailLocation}><strong>Localisation :</strong> {selectedLogement.location}</p>
                <p className={styles.detailHote}><strong>Hôte :</strong> {selectedLogement.hote}</p>
                <p className={styles.detailPrice}><strong>Prix :</strong> {selectedLogement.price} / nuit</p>
                
                <div className={styles.description}>
                  <h4 className={styles.subTitle}>Description</h4>
                  <p>Magnifique logement situé au cœur de {selectedLogement.location}. Offre tout le confort nécessaire pour un séjour inoubliable. Entièrement équipé et récemment rénové.</p>
                </div>
                
                <div className={styles.equipments}>
                  <h4 className={styles.subTitle}>Équipements</h4>
                  <div className={styles.equipGrid}>
                    <span>Wifi</span>
                    <span>Cuisine</span>
                    <span>Climatisation</span>
                    <span>Parking</span>
                  </div>
                </div>

                <div className={styles.detailFooterActions}>
                  <button className={styles.modalApproveBtn} onClick={() => {
                    setDismissed(prev => [...prev, selectedLogement.id]);
                    setSelectedLogement(null);
                  }}>
                    Approuver le logement
                  </button>
                  <button className={styles.modalRejectBtn} onClick={() => {
                    setDismissed(prev => [...prev, selectedLogement.id]);
                    setSelectedLogement(null);
                  }}>
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ValidationLogementsPage;
