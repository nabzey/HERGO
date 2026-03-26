import { useState } from 'react';
import {
  LayoutGrid, Home, Plus, ClipboardList, Calendar,
  ChevronLeft, ChevronRight, CheckCircle, Clock,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockReservations } from '../../data/adminMockData';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './CalendrierPage.module.css';

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
  { label: 'Calendrier', href: '/hote/calendrier', icon: <Calendar size={16} /> },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

// Convert "15 Mar 2026" → Date
const parseDate = (str: string): Date | null => {
  const monthMap: Record<string, number> = {
    Jan: 0, Fév: 1, Mar: 2, Avr: 3, Mai: 4, Juin: 5,
    Juil: 6, Août: 7, Sep: 8, Oct: 9, Nov: 10, Déc: 11,
  };
  const parts = str.split(' ');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0]);
  const month = monthMap[parts[1]];
  const year = parseInt(parts[2]);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
};

// Build a map of day strings → reservation status
const buildDateMap = () => {
  const map: Record<string, { status: 'confirmée' | 'en attente'; villaName: string }> = {};
  for (const r of mockReservations) {
    const start = parseDate(r.dateArrivee);
    const end = parseDate(r.dateDepart);
    if (!start || !end) continue;
    const cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().slice(0, 10);
      if (!map[key]) {
        map[key] = { status: r.status as 'confirmée' | 'en attente', villaName: r.villaName };
      }
      cur.setDate(cur.getDate() + 1);
    }
  }
  return map;
};

const dateMap = buildDateMap();

const CalendrierPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Build calendar days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const getKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const confirmedCount = Object.values(dateMap).filter((d) => d.status === 'confirmée').length;
  const pendingCount = Object.values(dateMap).filter((d) => d.status === 'en attente').length;

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Calendrier de disponibilité</h1>
        <p className={dStyles.pageSubtitle}>Visualisez vos réservations et disponibilités par date</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statPill}>
          <span className={styles.dotConfirmed} />
          <span>{confirmedCount} jours réservés (confirmés)</span>
        </div>
        <div className={styles.statPill}>
          <span className={styles.dotPending} />
          <span>{pendingCount} jours en attente</span>
        </div>
        <div className={styles.statPill}>
          <span className={styles.dotFree} />
          <span>Disponible</span>
        </div>
      </div>

      {/* Calendar */}
      <div className={styles.calendarWrapper}>
        {/* Navigation */}
        <div className={styles.calHeader}>
          <button className={styles.navBtn} onClick={prevMonth}>
            <ChevronLeft size={18} />
          </button>
          <h2 className={styles.calTitle}>
            {MONTHS[month]} {year}
          </h2>
          <button className={styles.navBtn} onClick={nextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days of week */}
        <div className={styles.calGrid}>
          {DAYS.map((d) => (
            <div key={d} className={styles.calDayHeader}>{d}</div>
          ))}

          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className={styles.calCell} />;
            }
            const key = getKey(day);
            const booking = dateMap[key];
            const todayClass = isToday(day) ? styles.calCellToday : '';
            const bookingClass = booking
              ? booking.status === 'confirmée'
                ? styles.calCellConfirmed
                : styles.calCellPending
              : '';

            return (
              <div
                key={key}
                className={`${styles.calCell} ${styles.calCellDay} ${todayClass} ${bookingClass}`}
                title={booking ? `${booking.villaName} — ${booking.status}` : 'Disponible'}
              >
                <span className={styles.dayNum}>{day}</span>
                {booking && (
                  <span className={styles.bookingDot}>
                    {booking.status === 'confirmée'
                      ? <CheckCircle size={9} />
                      : <Clock size={9} />}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming reservations list */}
      <div className={dStyles.tableWrapper}>
        <h2 className={dStyles.tableTitle}>Réservations à venir</h2>
        <table className={dStyles.table}>
          <thead>
            <tr>
              <th>Villa</th>
              <th>Voyageur</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Nuits</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {mockReservations
              .filter((r) => r.status !== 'annulée')
              .map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className={dStyles.avatarRow}>
                      <div className={dStyles.thumbWrapper}>
                        <img src={r.image} alt="" className={dStyles.thumb} />
                      </div>
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
                  <td>
                    <span className={`${dStyles.badge} ${r.status === 'confirmée' ? dStyles.badgeGreen : dStyles.badgeYellow}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default CalendrierPage;
