import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { statsParMois } from '../../data/adminMockData';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './StatistiquesPage.module.css';

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const maxReservations = Math.max(...statsParMois.map((s) => s.reservations));
const maxRevenus = Math.max(...statsParMois.map((s) => s.revenus));

const kpiCards = [
  { label: 'Total utilisateurs', value: '6', sub: 'dont 2 hôtes actifs' },
  { label: 'Logements publiés', value: '3', sub: 'sur 5 créés' },
  { label: 'Réservations totales', value: '5', sub: 'ce semestre' },
  { label: 'Revenus générés', value: '47 M FCFA', sub: 'depuis sep. 2025' },
];

const StatistiquesPage = () => (
  <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
    <div className={dStyles.pageHeader}>
      <h1 className={dStyles.pageTitle}>Statistiques</h1>
      <p className={dStyles.pageSubtitle}>Analyse de performance de la plateforme</p>
    </div>

    {/* KPI Cards */}
    <div className={dStyles.statsGrid}>
      {kpiCards.map((k) => (
        <div key={k.label} className={dStyles.statCard}>
          <span className={dStyles.statLabel}>{k.label}</span>
          <span className={dStyles.statValue}>{k.value}</span>
          <span className={dStyles.statChange}>{k.sub}</span>
        </div>
      ))}
    </div>

    {/* Charts area */}
    <div className={styles.chartsArea}>
      {/* Reservations bar chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}><TrendingUp size={16} /> Réservations mensuelles</h3>
        </div>
        <div className={styles.barChart}>
          {statsParMois.map((s) => (
            <div key={s.mois} className={styles.barColumn}>
              <span className={styles.barValue}>{s.reservations}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ height: `${(s.reservations / maxReservations) * 100}%` }} />
              </div>
              <span className={styles.barMois}>{s.mois}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue bar chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}><BarChart2 size={16} /> Revenus mensuels (FCFA)</h3>
        </div>
        <div className={styles.barChart}>
          {statsParMois.map((s) => (
            <div key={s.mois} className={styles.barColumn}>
              <span className={styles.barValue} style={{ fontSize: '0.65rem' }}>{(s.revenus / 1000000).toFixed(1)}M</span>
              <div className={styles.barTrack}>
                <div className={styles.barFillGold} style={{ height: `${(s.revenus / maxRevenus) * 100}%` }} />
              </div>
              <span className={styles.barMois}>{s.mois}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status distribution */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}><Home size={16} /> Répartition des logements</h3>
        </div>
        <div className={styles.distList}>
          {[
            { label: 'Publiés', count: 3, total: 5, color: '#7ec88a' },
            { label: 'Brouillons', count: 1, total: 5, color: 'var(--color-primary)' },
            { label: 'Suspendus', count: 1, total: 5, color: '#e07070' },
          ].map(({ label, count, total, color }) => (
            <div key={label} className={styles.distRow}>
              <span className={styles.distLabel}>{label}</span>
              <div className={styles.distTrack}>
                <div className={styles.distFill} style={{ width: `${(count / total) * 100}%`, background: color }} />
              </div>
              <span className={styles.distCount} style={{ color }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top villas */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}><BarChart2 size={16} /> Top villas (réservations)</h3>
        </div>
        <div className={styles.topList}>
          {[
            { name: 'Hôtel Royal Palace', count: 22 },
            { name: 'Villa Sunset Paradise', count: 14 },
            { name: 'Villa Ocean View', count: 9 },
            { name: 'Villa Azur Saly', count: 3 },
          ].map(({ name, count }, i) => (
            <div key={name} className={styles.topRow}>
              <span className={styles.topRank}>#{i + 1}</span>
              <span className={styles.topName}>{name}</span>
              <span className={styles.topCount}>{count} rés.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default StatistiquesPage;
