import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Home, Plus, ClipboardList, Upload, Check, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { logementsApi } from '../../core/api/api';
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
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Villa',
    ville: 'Dakar',
    adresse: '',
    description: '',
    prix: '',
    chambres: '',
    capacite: '',
  });

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const logementData = {
        titre: formData.name,
        description: formData.description,
        prixJour: parseFloat(formData.prix),
        capacite: parseInt(formData.capacite) || 1,
        adresse: formData.adresse,
        ville: formData.ville,
        pays: 'Sénégal',
        statut: 'EN_ATTENTE',
      };

      const logement = await logementsApi.create(logementData) as { id: number };

      if (amenities.length > 0) {
        await logementsApi.manageEquipements(logement.id, amenities);
      }

      if (images.length > 0) {
        for (const image of images) {
          const formDataImages = new FormData();
          formDataImages.append('image', image);
          await logementsApi.uploadImage(logement.id, formDataImages);
        }
      }

      setSaved(true);
      setTimeout(() => {
        navigate('/hote/mes-logements');
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la création du logement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote">
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Ajouter un Logement</h1>
        <p className={dStyles.pageSubtitle}>Renseignez les informations de votre nouvelle villa</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informations générales</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nom du logement</label>
              <input
                className={styles.input}
                placeholder="ex: Villa Sunset Paradise"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Type</label>
              <select
                className={styles.input}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Villa</option>
                <option>Hôtel</option>
                <option>Appartement</option>
              </select>
            </div>
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Ville</label>
              <select
                className={styles.input}
                value={formData.ville}
                onChange={(e) => setFormData({...formData, ville: e.target.value})}
              >
                {VILLES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Quartier / Adresse</label>
              <input
                className={styles.input}
                placeholder="ex: Almadies, Corniche"
                value={formData.adresse}
                onChange={(e) => setFormData({...formData, adresse: e.target.value})}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="Décrivez votre logement en détail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tarification</h2>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label}>Prix par nuit (FCFA)</label>
              <input
                className={styles.input}
                type="number"
                placeholder="ex: 300000"
                value={formData.prix}
                onChange={(e) => setFormData({...formData, prix: e.target.value})}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nombre de chambres</label>
              <input
                className={styles.input}
                type="number"
                placeholder="ex: 4"
                min="1"
                value={formData.chambres}
                onChange={(e) => setFormData({...formData, chambres: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Capacité (personnes)</label>
              <input
                className={styles.input}
                type="number"
                placeholder="ex: 8"
                min="1"
                value={formData.capacite}
                onChange={(e) => setFormData({...formData, capacite: e.target.value})}
              />
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
            <input
              type="file"
              multiple
              accept="image/*"
              capture="environment"
              className={styles.hiddenInput}
              onChange={handleImageChange}
            />
            <Upload size={28} className={styles.uploadIcon} />
            <p className={styles.uploadText}>Glissez vos photos ici ou <span>cliquez pour sélectionner</span></p>
            <p className={styles.uploadHint}>JPG, PNG — max 5 Mo par image</p>
          </label>
          {images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {images.map((img, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.draftBtn}>Sauvegarder brouillon</button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Création en cours...' : saved ? <><Check size={15} /> Logement ajouté !</> : 'Publier le logement'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AjouterLogementPage;
