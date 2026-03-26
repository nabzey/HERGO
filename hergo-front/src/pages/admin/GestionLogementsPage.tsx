import { useState } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, Search, EyeOff, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { allLogements } from '../../data/adminMockData';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from '../../pages/admin/GestionUtilisateursPage.module.css';

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

  const filtered = allLogements.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'tous' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <DashboardLayout links={ADMIN_LINKS} role="admin" userName="Aissatou Fall" userAvatar="https://i.pravatar.cc/36?u=aissatou">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Gestion des Logements</h1>
        <p className={dStyles.pageSubtitle}>{allLogements.length} logements sur la plateforme</p>
      </div>

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
                      ? <button className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`} title="Masquer"><EyeOff size={13} /></button>
                      : <button className={`${dStyles.actionBtn} ${dStyles.actionBtnPrimary}`} title="Publier"><Eye size={13} /></button>}
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
