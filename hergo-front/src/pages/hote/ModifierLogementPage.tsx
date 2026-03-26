import { useState } from 'react';
import { LayoutGrid, Home, Plus, ClipboardList, Check } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './LogementFormPage.module.css';
import { mesVillas } from '../../data/adminMockData';

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
];

const AMENITIES = ['Piscine privée', 'Cuisine équipée', 'Climatisation', 'Wi-Fi', 'Parking', 'Terrasse', 'Salle de sport', 'Jacuzzi'];
const villa = mesVillas[0]; // pre-fill with first villa

const ModifierLogementPage = () => {
  const [saved, setSaved] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(['Piscine privée', 'Cuisine équipée', 'Wi-Fi', 'Terrasse']);
  const [name, setName] = useState(villa.name);
  const [price, setPrice] = useState('300000');

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Modifier le Logement</h1>
        <p className={dStyles.pageSubtitle}>Mettez à jour les informations de : <strong style={{ color: 'var(--color-primary)' }}>{villa.name}</strong></p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informations générales</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nom du logement</label>
              <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Type</label>
              <select className={styles.input}><option>Villa</option><option>Hôtel</option></select>
            </div>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Ville</label>
              <select className={styles.input}><option>Dakar</option><option>Saly</option><option>Casamance</option></select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Quartier / Adresse</label>
              <input className={styles.input} defaultValue="Almadies, Corniche" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} rows={4} defaultValue="Nichée sur les hauteurs de Dakar avec une vue imprenable sur l'océan Atlantique..." />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tarification</h2>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label}>Prix par nuit (FCFA)</label>
              <input className={styles.input} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Chambres</label>
              <input className={styles.input} type="number" defaultValue={4} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Capacité</label>
              <input className={styles.input} type="number" defaultValue={8} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Équipements</h2>
          <div className={styles.amenitiesGrid}>
            {AMENITIES.map((a) => (
              <label key={a} className={`${styles.amenityChip} ${amenities.includes(a) ? styles.amenityChipActive : ''}`}>
                <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} className={styles.hiddenCheck} />
                {amenities.includes(a) && <Check size={12} />}
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.draftBtn}>Annuler</button>
          <button type="submit" className={styles.submitBtn}>
            {saved ? <><Check size={15} /> Modifications enregistrées !</> : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ModifierLogementPage;
