import { useState } from 'react';
import { LayoutGrid, Home, Plus, ClipboardList, Upload, Check } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import dStyles from '../../components/DashboardLayout.module.css';
import styles from './LogementFormPage.module.css';

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
];

const AMENITIES = ['Piscine privée', 'Cuisine équipée', 'Climatisation', 'Wi-Fi', 'Parking', 'Terrasse', 'Salle de sport', 'Jacuzzi'];
const VILLES = ['Dakar', 'Saly', 'Casamance', 'Thiès', 'Mbour', 'Saint-Louis', 'Rufisque'];

const AjouterLogementPage = () => {
  const [saved, setSaved] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);

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
        <h1 className={dStyles.pageTitle}>Ajouter un Logement</h1>
        <p className={dStyles.pageSubtitle}>Renseignez les informations de votre nouvelle villa</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informations générales</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nom du logement</label>
              <input className={styles.input} placeholder="ex: Villa Sunset Paradise" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Type</label>
              <select className={styles.input}>
                <option>Villa</option>
                <option>Hôtel</option>
                <option>Appartement</option>
              </select>
            </div>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Ville</label>
              <select className={styles.input}>
                {VILLES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Quartier / Adresse</label>
              <input className={styles.input} placeholder="ex: Almadies, Corniche" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} rows={4} placeholder="Décrivez votre logement en détail..." required />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tarification</h2>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label}>Prix par nuit (FCFA)</label>
              <input className={styles.input} type="number" placeholder="ex: 300000" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nombre de chambres</label>
              <input className={styles.input} type="number" placeholder="ex: 4" min="1" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Capacité (personnes)</label>
              <input className={styles.input} type="number" placeholder="ex: 8" min="1" />
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

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Photos</h2>
          <label className={styles.uploadZone}>
            <input type="file" multiple accept="image/*" className={styles.hiddenInput} />
            <Upload size={28} className={styles.uploadIcon} />
            <p className={styles.uploadText}>Glissez vos photos ici ou <span>cliquez pour sélectionner</span></p>
            <p className={styles.uploadHint}>JPG, PNG — max 5 Mo par image</p>
          </label>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.draftBtn}>Sauvegarder brouillon</button>
          <button type="submit" className={styles.submitBtn}>
            {saved ? <><Check size={15} /> Logement ajouté !</> : 'Publier le logement'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AjouterLogementPage;
