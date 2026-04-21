import { useState, useEffect } from 'react';
import { LayoutGrid, Users, Home, ShieldCheck, BarChart2, Search, EyeOff, Eye, MapPin, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { adminApi } from '../../core/api/api';
import dStyles from '../../components/DashboardLayout.module.css';
import Modal from '../../components/Modal';
import styles from '../../pages/admin/GestionUtilisateursPage.module.css';

interface ApiLogement {
  id: number;
  titre: string;
  ville: string;
  pays?: string;
  prixJour: number;
  statut: string;
  capacite?: number;
  description?: string;
  images?: Array<{ url: string }>;
  proprietaire?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  };
}

const STATUS_LABELS: Record<string, string> = {
  PUBLIE: 'publié',
  EN_ATTENTE: 'en attente',
  BROUILLON: 'brouillon',
  REJETE: 'rejeté',
};

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: <Users size={16} /> },
  { label: 'Logements', href: '/admin/logements', icon: <Home size={16} /> },
  { label: 'Validation', href: '/admin/validation', icon: <ShieldCheck size={16} /> },
  { label: 'Statistiques', href: '/admin/statistiques', icon: <BarChart2 size={16} /> },
];

const STATUS_FILTERS = [
  { label: 'Tous', value: 'tous' },
  { label: 'Publiés', value: 'PUBLIE' },
  { label: 'En attente', value: 'EN_ATTENTE' },
  { label: 'Rejetés', value: 'REJETE' },
];

const GestionLogementsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [logements, setLogements] = useState<ApiLogement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ApiLogement | null>(null);

  useEffect(() => {
    const fetchLogements = async () => {
      try {
        const response = await adminApi.getAllLogements() as ApiLogement[];
        setLogements(response);
      } catch (err: unknown) {
        setError((err as Error).message || 'Erreur lors du chargement des logements');
      } finally {
        setLoading(false);
      }
    };
    fetchLogements();
  }, []);

  const filtered = logements.filter((l) => {
    const matchSearch =
      l.titre.toLowerCase().includes(search.toLowerCase()) ||
      l.ville.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'tous' || l.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: number, statut: string) => {
    try {
      await adminApi.updateLogementStatus(id, { statut });
      setLogements(prev => prev.map(l => l.id === id ? { ...l, statut } : l));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, statut } : null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadgeClass = (statut: string) => {
    if (statut === 'PUBLIE') return dStyles.badgeGreen;
    if (statut === 'EN_ATTENTE') return dStyles.badgeYellow;
    if (statut === 'REJETE') return dStyles.badgeRed;
    return dStyles.badgeGray;
  };

  if (loading) {
    return (
      <DashboardLayout links={ADMIN_LINKS} role="admin">
        <div className={dStyles.pageHeader}>
          <h1 className={dStyles.pageTitle}>Gestion des Logements</h1>
          <p>Chargement des logements...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={ADMIN_LINKS} role="admin">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Gestion des Logements</h1>
        <p className={dStyles.pageSubtitle}>{logements.length} logements sur la plateforme</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
          padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Rechercher un logement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${statusFilter === f.value ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
              <span style={{
                marginLeft: '6px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)',
                borderRadius: '10px', padding: '1px 6px'
              }}>
                {f.value === 'tous' ? logements.length : logements.filter(l => l.statut === f.value).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={dStyles.tableWrapper}>
        <table className={dStyles.table}>
          <thead>
            <tr>
              <th>Logement</th>
              <th>Hôte</th>
              <th>Prix / nuit</th>
              <th>Capacité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const image = l.images && l.images.length > 0 ? l.images[0].url : '/vite.svg';
              const hoteName = l.proprietaire
                ? `${l.proprietaire.firstName} ${l.proprietaire.lastName}`.trim()
                : 'Hôte inconnu';
              return (
                <tr
                  key={l.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(l)}
                >
                  <td>
                    <div className={dStyles.avatarRow}>
                      <div className={dStyles.thumbWrapper}>
                        <img
                          src={image}
                          alt={l.titre}
                          className={dStyles.thumb}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/vite.svg'; }}
                        />
                      </div>
                      <div>
                        <div className={dStyles.avatarName}>{l.titre}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-gray)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={10} /> {[l.ville, l.pays].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={dStyles.avatarRow}>
                      <img
                        src={l.proprietaire?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(hoteName)}&background=c9a570&color=fff&size=32`}
                        alt={hoteName}
                        className={dStyles.avatarSmall}
                      />
                      <span>{hoteName}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {Number(l.prixJour).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td>{l.capacite || '—'} pers.</td>
                  <td>
                    <span className={`${dStyles.badge} ${getStatusBadgeClass(l.statut)}`}>
                      {STATUS_LABELS[l.statut] || l.statut}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className={dStyles.actionGroup}>
                      {l.statut !== 'PUBLIE' ? (
                        <button
                          onClick={() => updateStatus(l.id, 'PUBLIE')}
                          className={`${dStyles.actionBtn} ${dStyles.actionBtnPrimary}`}
                          title="Publier"
                        >
                          <Eye size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(l.id, 'REJETE')}
                          className={`${dStyles.actionBtn} ${dStyles.actionBtnDanger}`}
                          title="Rejeter"
                        >
                          <EyeOff size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-gray)' }}>
            Aucun logement trouvé
          </div>
        )}
      </div>

      {/* Logement detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Détails du logement"
        size="medium"
      >
        {selected && (() => {
          const image = selected.images && selected.images.length > 0 ? selected.images[0].url : '/vite.svg';
          const hoteName = selected.proprietaire
            ? `${selected.proprietaire.firstName} ${selected.proprietaire.lastName}`.trim()
            : 'Hôte inconnu';
          return (
            <div className={styles.userDetail}>
              {/* Image */}
              <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', height: '200px' }}>
                <img
                  src={image}
                  alt={selected.titre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/vite.svg'; }}
                />
              </div>

              {/* Header */}
              <div className={styles.detailHeader} style={{ marginBottom: '12px' }}>
                <div>
                  <h3 className={styles.detailName}>{selected.titre}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-gray)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={12} /> {[selected.ville, selected.pays].filter(Boolean).join(', ')}
                  </p>
                  <span className={`${dStyles.badge} ${getStatusBadgeClass(selected.statut)}`} style={{ marginTop: '6px', display: 'inline-block' }}>
                    {STATUS_LABELS[selected.statut] || selected.statut}
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Prix / nuit</span>
                  <span className={styles.detailValue} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {Number(selected.prixJour).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Capacité</span>
                  <span className={styles.detailValue}>{selected.capacite || '—'} personnes</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Hôte</span>
                  <span className={styles.detailValue}>{hoteName}</span>
                </div>
                {selected.proprietaire?.email && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email hôte</span>
                    <span className={styles.detailValue}>{selected.proprietaire.email}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selected.description && (
                <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--color-text-gray)', lineHeight: 1.5 }}>
                  {selected.description.slice(0, 200)}{selected.description.length > 200 ? '…' : ''}
                </div>
              )}

              {/* Actions */}
              <div className={styles.detailActions} style={{ marginTop: '16px' }}>
                {selected.statut !== 'PUBLIE' ? (
                  <button
                    className={`${styles.actionBtn} ${styles.btnReactivate}`}
                    onClick={() => { updateStatus(selected.id, 'PUBLIE'); }}
                  >
                    <Eye size={14} /> Publier ce logement
                  </button>
                ) : (
                  <button
                    className={`${styles.actionBtn} ${styles.btnSuspend}`}
                    onClick={() => { updateStatus(selected.id, 'REJETE'); }}
                  >
                    <EyeOff size={14} /> Rejeter / Masquer
                  </button>
                )}
                <Link
                  to={`/logements/${selected.id}`}
                  target="_blank"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem',
                    border: '1px solid var(--color-border)', color: 'var(--color-text-gray)',
                    textDecoration: 'none', marginLeft: '8px'
                  }}
                >
                  <ExternalLink size={13} /> Voir la page
                </Link>
              </div>
            </div>
          );
        })()}
      </Modal>
    </DashboardLayout>
  );
};

export default GestionLogementsPage;
