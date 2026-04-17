import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Star, MapPin, ChevronDown, Filter } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import VoyageurLayout from '../../components/VoyageurLayout';
import { useAuth } from '../../hooks/useAuth';
import { hebergements, poolImage, kitchenImage, EQUIPMENTS, type Equipment } from '../../data/mockData';
import videoOne from '../../assets/video 1.mp4';
import videoTwo from '../../assets/video2.mp4';
import imageOne from '../../assets/image1.jpeg';
import imageTwo from '../../assets/image2.jpeg';
import imageThree from '../../assets/image3.jpeg';
import imageFour from '../../assets/image4.jpeg';
import imageFive from '../../assets/image 5.jpeg';
import imOne from '../../assets/im1.jpeg';
import imTwo from '../../assets/im2.jpeg';
import imThree from '../../assets/im3.jpeg';
import imFour from '../../assets/im4.jpeg';
import imFive from '../../assets/im5.jpeg';
import imSix from '../../assets/im6.jpeg';
import imSeven from '../../assets/im7.jpeg';
import imEight from '../../assets/im8.jpeg';
import imNine from '../../assets/im9.jpeg';
import styles from './LogementsPage.module.css';

const TYPES = ['Tous', 'Villa', 'Hôtel'];
const PRIX_MAX_OPTIONS = [
  { label: 'Tous les budgets', value: 0 },
  { label: "Jusqu'à 50 000 FCFA", value: 50000 },
  { label: "Jusqu'à 80 000 FCFA", value: 80000 },
  { label: "Jusqu'à 120 000 FCFA", value: 120000 },
];
const NOTE_MIN_OPTIONS = [
  { label: 'Toutes notes', value: 0 },
  { label: '4.0 et plus', value: 4.0 },
  { label: '4.5 et plus', value: 4.5 },
  { label: '4.8 et plus', value: 4.8 },
];
const HERO_MEDIA = [
  { type: 'video', src: videoOne, title: 'Video logements 1' },
  { type: 'image', src: imageOne, alt: 'Logements image 1' },
  { type: 'image', src: imageTwo, alt: 'Logements image 2' },
  { type: 'video', src: videoTwo, title: 'Video logements 2' },
  { type: 'image', src: imageThree, alt: 'Logements image 3' },
  { type: 'image', src: imageFour, alt: 'Logements image 4' },
  { type: 'image', src: imageFive, alt: 'Logements image 5' },
  { type: 'image', src: imOne, alt: 'Logements image 6' },
  { type: 'image', src: imTwo, alt: 'Logements image 7' },
  { type: 'image', src: imThree, alt: 'Logements image 8' },
  { type: 'image', src: imFour, alt: 'Logements image 9' },
  { type: 'image', src: imFive, alt: 'Logements image 10' },
  { type: 'image', src: imSix, alt: 'Logements image 11' },
  { type: 'image', src: imSeven, alt: 'Logements image 12' },
  { type: 'image', src: imEight, alt: 'Logements image 13' },
  { type: 'image', src: imNine, alt: 'Logements image 14' },
];

const renderMedia = (media: (typeof HERO_MEDIA)[number], className: string) => {
  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        title={media.title}
        className={className}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return <img src={media.src} alt={media.alt} className={className} />;
};

const LogementsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [searchText, setSearchText] = useState(searchParams.get('destination') ?? '');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [prixMax, setPrixMax] = useState(0);
  const [noteMin, setNoteMin] = useState(0);
  const [selectedEquipments, setSelectedEquipments] = useState<Equipment[]>([]);
  const [showEquipmentFilter, setShowEquipmentFilter] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    return hebergements.filter((h) => {
      const matchSearch =
        !searchText ||
        h.name.toLowerCase().includes(searchText.toLowerCase()) ||
        h.location.toLowerCase().includes(searchText.toLowerCase());
      const matchType = typeFilter === 'Tous' || h.type === typeFilter;
      const matchPrice = prixMax === 0 || h.pricePerNight <= prixMax;
      const matchNote = noteMin === 0 || h.rating >= noteMin;
      const matchEquipments =
        selectedEquipments.length === 0 || selectedEquipments.every((eq) => h.equipments.includes(eq));

      return matchSearch && matchType && matchPrice && matchNote && matchEquipments;
    });
  }, [searchText, typeFilter, prixMax, noteMin, selectedEquipments]);

  const toggleEquipment = (equipment: Equipment) => {
    setSelectedEquipments((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  };

  const clearEquipmentFilter = () => {
    setSelectedEquipments([]);
  };

  const displayed = showAll ? filtered : filtered.slice(0, 6);

  const handleSearch = () => {
    navigate(`/logements?destination=${encodeURIComponent(searchText)}`);
  };

  const content = (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackgroundStack}>
          {HERO_MEDIA.map((media, index) => (
            <div
              key={`${media.src}-${index}`}
              className={styles.heroBackgroundFrame}
              style={{ animationDelay: `${index * 2.4}s` }}
            >
              {renderMedia(media, styles.heroBackgroundMedia)}
            </div>
          ))}
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link to={user?.role === 'Voyageur' ? '/dashboard' : '/'} className={styles.backLink}>
            <ArrowLeft size={14} />
            Retour
          </Link>
          <h1 className={styles.heroTitle}>Nos Hébergements</h1>
          <p className={styles.heroSub}>Villas, hôtels et appartements de prestige pour des séjours inoubliables</p>
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className={styles.searchInner}>
          <p className={styles.searchHeading}>Affinez votre recherche</p>
          <div className={styles.searchRow}>
            <div className={styles.filterGroup} style={{ flex: 2, minWidth: 200 }}>
              <span className={styles.filterLabel}>Destination</span>
              <div className={styles.inputWrapper}>
                <MapPin size={14} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Ville, quartier, nom..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Type</span>
              <div className={styles.selectWrapper}>
                <select className={styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Budget / nuit</span>
              <div className={styles.selectWrapper}>
                <select className={styles.select} value={prixMax} onChange={(e) => setPrixMax(Number(e.target.value))}>
                  {PRIX_MAX_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Note minimum</span>
              <div className={styles.selectWrapper}>
                <select className={styles.select} value={noteMin} onChange={(e) => setNoteMin(Number(e.target.value))}>
                  {NOTE_MIN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Équipements</span>
              <button
                className={`${styles.select} ${styles.equipmentBtn} ${
                  selectedEquipments.length > 0 ? styles.equipmentBtnActive : ''
                }`}
                onClick={() => setShowEquipmentFilter(!showEquipmentFilter)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Filter size={14} />
                  {selectedEquipments.length > 0 ? `${selectedEquipments.length} sélectionné(s)` : 'Tous'}
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: showEquipmentFilter ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
            </div>

            <button className={styles.searchBtn} onClick={handleSearch}>
              <Search size={15} />
              Rechercher
            </button>
          </div>

          {showEquipmentFilter && (
            <div className={styles.equipmentDropdown}>
              <div className={styles.equipmentList}>
                {EQUIPMENTS.map((eq) => (
                  <label key={eq.value} className={styles.equipmentItem}>
                    <input
                      type="checkbox"
                      checked={selectedEquipments.includes(eq.value)}
                      onChange={() => toggleEquipment(eq.value)}
                      className={styles.equipmentCheckbox}
                    />
                    <span>{eq.label}</span>
                  </label>
                ))}
              </div>
              {selectedEquipments.length > 0 && (
                <button className={styles.clearFilterBtn} onClick={clearEquipmentFilter}>
                  Réinitialiser
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.gridInner}>
          <div className={styles.gridHeader}>
            <span className={styles.resultCount}>
              {filtered.length} hébergement{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {displayed.length === 0 ? (
            <div className={styles.emptyState}>
              <Search size={40} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Aucun hébergement ne correspond à vos critères.</p>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setSearchText('');
                  setTypeFilter('Tous');
                  setPrixMax(0);
                  setNoteMin(0);
                  setSelectedEquipments([]);
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className={styles.propertyGrid}>
              {displayed.map((h) => (
                <Link to={`/logements/${h.id}`} key={h.id} className={styles.propertyCard}>
                  <div className={styles.propertyImageWrapper}>
                    <img src={h.image} alt={h.name} className={styles.propertyImage} />
                    <div className={styles.propertyOverlay} />
                    <span className={styles.typeBadge}>{h.type}</span>
                    <span className={styles.ratingBadge}>
                      <Star size={10} fill="currentColor" /> {h.rating}
                    </span>
                  </div>
                  <div className={styles.propertyInfo}>
                    <div className={styles.propertyDetails}>
                      <span className={styles.propertyName}>{h.name}</span>
                      <span className={styles.propertyLocation}>
                        <MapPin size={11} /> {h.location}
                      </span>
                      <span className={styles.propertyReviews}>{h.reviewCount} avis</span>
                    </div>
                    <div className={styles.propertyFooter}>
                      <span className={styles.propertyPrice}>
                        {h.pricePerNight.toLocaleString('fr-FR')} <small>FCFA/nuit</small>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!showAll && filtered.length > 6 && (
            <div className={styles.showMoreWrapper}>
              <button className={styles.showMoreBtn} onClick={() => setShowAll(true)}>
                Voir plus ({filtered.length - 6} autres)
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoInner}>
          <h2 className={styles.infoTitle}>Ce que nos hébergements offrent</h2>

          <div className={styles.infoRow}>
            <div className={styles.infoImageWrapper}>
              <img src={poolImage} alt="Piscine de la villa" className={styles.infoImage} />
            </div>
            <div className={styles.infoContent}>
              <h3 className={styles.infoFeatureTitle}>Piscine Privée</h3>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th>Longueur</th>
                    <th>Largeur</th>
                    <th>Profondeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>12 m</td>
                    <td>5 m</td>
                    <td>1,4 m</td>
                  </tr>
                </tbody>
              </table>
              <p className={styles.infoText}>
                Chaque villa dispose d&apos;une piscine privée. Nous proposons différents types de bassins :
                familial, sportif et décoratif. Ils varient en taille le type de piscine dépend
                du nombre de chambres et de la superficie de la villa.
              </p>
            </div>
          </div>

          <div className={`${styles.infoRow} ${styles.infoRowReverse}`}>
            <div className={styles.infoContent}>
              <h3 className={styles.infoFeatureTitle}>Cuisine Équipée</h3>
              <p className={styles.infoText}>
                Des cuisines spacieuses et lumineuses avec îlot central, espaces de repas pour les
                invités et la famille. Chaque cuisine est adaptée au style de la villa. La plupart
                de nos cuisines sont ouvertes sur le salon, mais nous proposons aussi des espaces
                fermés avec accès direct à la terrasse.
              </p>
            </div>
            <div className={styles.infoImageWrapper}>
              <img src={kitchenImage} alt="Cuisine de la villa" className={styles.infoImage} />
            </div>
          </div>
        </div>
      </section>
    </>
  );

  if (user?.role === 'Voyageur') {
    return <VoyageurLayout>{content}</VoyageurLayout>;
  }

  return (
    <div className={styles.page}>
      <Navbar />
      {content}
      <Footer />
    </div>
  );
};

export default LogementsPage;
