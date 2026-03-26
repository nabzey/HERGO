import { LayoutGrid, Home, Plus, ClipboardList, Star, DollarSign, CalendarCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mesVillas, mockReservations } from '../../data/adminMockData';
import styles from './HoteDashboardPage.module.css';
import dStyles from '../../components/DashboardLayout.module.css';

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
];

const HoteDashboardPage = () => {
  const totalRevenu = mockReservations
    .filter((r) => r.status === 'confirmée')
    .reduce((acc) => acc + 300000 * 7, 0);

  const stats = [
    { label: 'Mes Villas', value: mesVillas.length, change: '+1 ce mois', icon: <Home size={18} /> },
    { label: 'Réservations', value: mockReservations.length, change: '+3 ce mois', icon: <CalendarCheck size={18} /> },
    { label: 'Revenus (FCFA)', value: totalRevenu.toLocaleString('fr-FR'), change: '+12%', icon: <DollarSign size={18} /> },
    { label: 'Note moyenne', value: '4.8 ★', change: 'Excellent', icon: <Star size={18} /> },
  ];

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Tableau de bord</h1>
        <p className={dStyles.pageSubtitle}>Bienvenue, Fatou — voici un aperçu de votre activité</p>
      </div>

      {/* Stats */}
      <div className={dStyles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={dStyles.statCard}>
            <div className={dStyles.statIcon}>{s.icon}</div>
            <span className={dStyles.statLabel}>{s.label}</span>
            <span className={dStyles.statValue}>{s.value}</span>
            <span className={dStyles.statChange}>{s.change}</span>
          </div>
        ))}
      </div>

      {/* Recent reservations */}
      <div className={dStyles.tableWrapper}>
        <h2 className={dStyles.tableTitle}>Réservations récentes</h2>
        <table className={dStyles.table}>
          <thead>
            <tr>
              <th>Logement</th>
              <th>Voyageur</th>
              <th>Dates</th>
              <th>Nuits</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {mockReservations.map((r) => (
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
                <td>{r.dateArrivee} → {r.dateDepart}</td>
                <td>{r.nuits}</td>
                <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{r.montant}</td>
                <td>
                  <span className={`${dStyles.badge} ${r.status === 'confirmée' ? dStyles.badgeGreen : r.status === 'en attente' ? dStyles.badgeYellow : dStyles.badgeRed}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* My villas quick view */}
      <div className={dStyles.tableWrapper}>
        <h2 className={dStyles.tableTitle}>Mes villas</h2>
        <div className={styles.villaGrid}>
          {mesVillas.map((v) => (
            <div key={v.id} className={styles.villaCard}>
              <div className={styles.villaImg}><img src={v.image} alt={v.name} /></div>
              <div className={styles.villaInfo}>
                <p className={styles.villaName}>{v.name}</p>
                <p className={styles.villaLocation}>{v.location}</p>
                <div className={styles.villaBottom}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8rem' }}>{v.price}</span>
                  <span className={`${dStyles.badge} ${v.status === 'publié' ? dStyles.badgeGreen : v.status === 'brouillon' ? dStyles.badgeGray : dStyles.badgeRed}`}>{v.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HoteDashboardPage;
