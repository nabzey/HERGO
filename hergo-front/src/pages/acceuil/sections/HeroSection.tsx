import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/im1.jpeg';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [depart, setDepart] = useState('');
  const [voyageurs, setVoyageurs] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (arrivee) params.set('arrivee', arrivee);
    if (depart) params.set('depart', depart);
    if (voyageurs) params.set('voyageurs', String(voyageurs));
    navigate(`/logements?${params.toString()}`);
  };

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1 className={styles.title}>Trouvez votre hébergement idéal</h1>
        <p className={styles.subtitle}>
          Réservez des hôtels et villas de qualité pour vos séjours temporaires
        </p>
      </div>

      {/* Formulaire de recherche */}
      <div className={styles.searchCard}>
        <div className={styles.fieldsRow}>
          {/* Destination */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Destination</label>
            <div className={styles.inputWrapper}>
              <MapPin size={16} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Où allez-vous ?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          {/* Arrivée */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Arrivée</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} className={styles.inputIcon} />
              <input
                type="date"
                className={styles.input}
                value={arrivee}
                onChange={(e) => setArrivee(e.target.value)}
              />
            </div>
          </div>

          {/* Départ */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Départ</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} className={styles.inputIcon} />
              <input
                type="date"
                className={styles.input}
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
              />
            </div>
          </div>

          {/* Voyageurs */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Voyageurs</label>
            <div className={styles.inputWrapper}>
              <Users size={16} className={styles.inputIcon} />
              <input
                type="number"
                className={styles.input}
                min={1}
                max={20}
                value={voyageurs}
                onChange={(e) => setVoyageurs(Number(e.target.value))}
                placeholder="2 voyageurs"
              />
            </div>
          </div>
        </div>

        <button className={styles.searchBtn} onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
