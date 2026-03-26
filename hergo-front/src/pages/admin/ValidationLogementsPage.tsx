import { useState } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, CheckCircle, XCircle, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
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
  const [dismissed, setDismissed] = useState<number[]>([]);

  const pending = pendingLogements.filter((l) => !dismissed.includes(l.id));

  return (
    <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
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
              <button className={styles.viewBtn}><Eye size={15} /> Voir détails</button>
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
    </DashboardLayout>
  );
};

export default ValidationLogementsPage;
