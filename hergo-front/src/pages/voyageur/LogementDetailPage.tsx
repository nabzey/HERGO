import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Star, MapPin, Waves, ChefHat, Wind, Wifi, Car,
  BedDouble, Dumbbell, CalendarDays, Users, Check,
  Plane, Bus, ChevronRight, Images, ShowerHead,
  TreePalm, Sofa, ArrowLeft,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { villaDetails, type EspaceLogement } from '../../data/adminMockData';
import styles from './LogementDetailPage.module.css';

/* ── Icon maps ─────────────────────────────────────────── */
const TRANSPORT_ICON_MAP: Record<string, React.ReactNode> = {
  'Transfert aéroport': <Plane size={15} />,
  'Parking privé': <Car size={15} />,
  'Navette centre-ville': <Bus size={15} />,
};

const AMENITY_ICON_MAP: Record<string, React.ReactNode> = {
  Waves: <Waves size={18} />,
  ChefHat: <ChefHat size={18} />,
  Wind: <Wind size={18} />,
  Wifi: <Wifi size={18} />,
  Car: <Car size={18} />,
  BedDouble: <BedDouble size={18} />,
  Dumbbell: <Dumbbell size={18} />,
  Sunset: <Star size={18} />,
};

const ESPACE_ICON_MAP: Record<string, React.ReactNode> = {
  BedDouble: <BedDouble size={22} />,
  Sofa: <Sofa size={22} />,
  ChefHat: <ChefHat size={22} />,
  Waves: <Waves size={22} />,
  ShowerHead: <ShowerHead size={22} />,
  TreePalm: <TreePalm size={22} />,
};

/* ── Sub-components ─────────────────────────────────────── */
function EspaceCard({ espace }: { espace: EspaceLogement }) {
  return (
    <div className={styles.espaceCard}>
      <div className={styles.espaceImgWrap}>
        <img src={espace.image} alt={espace.nom} className={styles.espaceImg} />
        <div className={styles.espaceImgOverlay} />
        <div className={styles.espaceIconBadge}>
          {ESPACE_ICON_MAP[espace.icon] ?? <Check size={22} />}
        </div>
      </div>
      <div className={styles.espaceBody}>
        <div className={styles.espaceHeader}>
          <span className={styles.espaceNom}>{espace.nom}</span>
          {espace.surface && (
            <span className={styles.espaceSurface}>{espace.surface}</span>
          )}
        </div>
        <p className={styles.espaceDesc}>{espace.description}</p>
        <ul className={styles.espaceDetails}>
          {espace.details.map((d) => (
            <li key={d} className={styles.espaceDetailItem}>
              <Check size={11} className={styles.espaceCheck} />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  return (
    <div className={styles.scoreBarWrap}>
      <div className={styles.scoreBarTrack}>
        <div className={styles.scoreBarFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────── */
const LogementDetailPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const villa = villaDetails;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [dateArrivee, setDateArrivee] = useState('');
  const [dateDepart, setDateDepart] = useState('');
  const [voyageurs, setVoyageurs] = useState(2);

  const mainImg = villa.images[0];
  const sideImg1 = villa.images[1];
  const sideImg2 = villa.images[2];
  const thumbs = villa.images.slice(3); // images 3..7

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.inner}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadLink}>Accueil</Link>
          <span className={styles.breadSep}>/</span>
          <Link to="/logements" className={styles.breadLink}>Logements</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>{villa.name}</span>
        </div>

        {/* ── Gallery + Rating Sidebar ── */}
        <div className={styles.topRow}>

          {/* Gallery */}
          <div className={styles.galleryArea}>
            {/* Main grid: big photo + 2 side photos */}
            <div className={styles.mainGallery}>
              <div className={styles.bigPhotoWrap} onClick={() => openLightbox(0)}>
                <img src={mainImg} alt={villa.name} className={styles.bigPhoto} />
                <div className={styles.photoOverlay} />
              </div>
              <div className={styles.sidePhotos}>
                <div className={styles.sidePhotoWrap} onClick={() => openLightbox(1)}>
                  <img src={sideImg1} alt="Vue 2" className={styles.sidePhoto} />
                  <div className={styles.photoOverlay} />
                </div>
                <div className={styles.sidePhotoWrap} onClick={() => openLightbox(2)}>
                  <img src={sideImg2} alt="Vue 3" className={styles.sidePhoto} />
                  <div className={styles.photoOverlay} />
                </div>
              </div>
            </div>

            {/* Thumbnail row */}
            <div className={styles.thumbRow}>
              {thumbs.slice(0, 4).map((img, i) => (
                <div key={i} className={styles.thumbWrap} onClick={() => openLightbox(i + 3)}>
                  <img src={img} alt={`Vue ${i + 4}`} className={styles.thumbPhoto} />
                  <div className={styles.photoOverlay} />
                </div>
              ))}
              {/* Last thumb with "autres photos" overlay */}
              <div className={styles.thumbWrap} onClick={() => openLightbox(7)} style={{ position: 'relative' }}>
                {thumbs[4] && (
                  <img src={thumbs[4]} alt="Plus de photos" className={styles.thumbPhoto} />
                )}
                <div className={styles.morePhotosOverlay}>
                  <Images size={20} />
                  <span>{villa.images.length - 3} autres photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Rating Sidebar ── */}
          <aside className={styles.ratingSidebar}>
            {/* Global score */}
            <div className={styles.ratingBox}>
              <div className={styles.ratingTopRow}>
                <div className={styles.ratingLabel}>{villa.scores.label}</div>
                <div className={styles.ratingBadge}>
                  {villa.scores.global.toFixed(1).replace('.', ',')}
                </div>
              </div>
              <p className={styles.experiencesCount}>
                {villa.scores.totalExperiences.toLocaleString('fr-FR')} expériences vécues
              </p>
            </div>

            {/* Featured review */}
            <div className={styles.reviewQuoteBox}>
              <p className={styles.reviewQuoteTitle}>
                Ce que les personnes ayant séjourné ici ont adoré :
              </p>
              <p className={styles.reviewQuoteText}>
                « {villa.scores.avisVedette.quote} »
              </p>
              <div className={styles.reviewQuoteAuthor}>
                <div className={styles.reviewerInitial}>
                  {villa.scores.avisVedette.initial}
                </div>
                <span className={styles.reviewerName}>{villa.scores.avisVedette.author}</span>
                <span className={styles.reviewerFlag}>{villa.scores.avisVedette.flag}</span>
                <span className={styles.reviewerCountry}>{villa.scores.avisVedette.country}</span>
                <ChevronRight size={14} className={styles.reviewerArrow} />
              </div>
            </div>

            {/* Score categories */}
            <div className={styles.scoresBox}>
              {villa.scores.categories.map((cat) => (
                <div key={cat.label} className={styles.scoreRow}>
                  <span className={styles.scoreCatLabel}>{cat.label}</span>
                  <ScoreBar score={cat.score} />
                  <span className={styles.scoreCatValue}>
                    {cat.score.toFixed(1).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className={styles.mapBox}>
              <div className={styles.mapImgWrap}>
                <img
                  src={`https://maps.wikimedia.org/img/osm-intl,14,${villa.coordinates.lat},${villa.coordinates.lng},280x140.png`}
                  alt="Carte"
                  className={styles.mapImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://picsum.photos/seed/dakar-map/280/140';
                  }}
                />
                <div className={styles.mapPin}>
                  <MapPin size={20} fill="currentColor" />
                </div>
              </div>
              <button className={styles.mapBtn}>
                <MapPin size={14} />
                Voir sur la carte
              </button>
            </div>
          </aside>
        </div>

        {/* ── Content + Booking Card ── */}
        <div className={styles.contentRow}>
          {/* ── Main Content ── */}
          <div className={styles.mainContent}>

            {/* Title block */}
            <div className={styles.titleBlock}>
              <div className={styles.titleMeta}>
                <span className={styles.typeBadge}>{villa.bedrooms} chambres · {villa.capacity} personnes</span>
              </div>
              <h1 className={styles.villaTitle}>{villa.name}</h1>
              <div className={styles.metaRow}>
                <div className={styles.ratingInline}>
                  <Star size={14} fill="currentColor" className={styles.starIcon} />
                  <strong>{villa.rating}</strong>
                  <span className={styles.reviewCountInline}>({villa.reviewCount} avis)</span>
                </div>
                <span className={styles.metaDot}>·</span>
                <div className={styles.locationInline}>
                  <MapPin size={13} />
                  {villa.location}
                </div>
              </div>
            </div>

            {/* Host */}
            <div className={styles.hostRow}>
              <img src={villa.host.avatar} alt={villa.host.name} className={styles.hostAvatar} />
              <div>
                <p className={styles.hostedBy}>Hébergement proposé par</p>
                <p className={styles.hostName}>{villa.host.name}</p>
                <p className={styles.hostSince}>Hôte depuis {villa.host.joinDate} · Note {villa.host.rating}/5</p>
              </div>
            </div>

            <hr className={styles.sep} />

            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>À propos de ce logement</h2>
              <p className={styles.description}>{villa.description}</p>
            </section>

            <hr className={styles.sep} />

            {/* ── Espaces section (NEW) ── */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Les espaces du logement</h2>
              <p className={styles.sectionSub}>
                Découvrez chaque pièce et espace de ce logement d'exception
              </p>
              <div className={styles.espacesGrid}>
                {villa.espaces.map((espace) => (
                  <EspaceCard key={espace.id} espace={espace} />
                ))}
              </div>
            </section>

            <hr className={styles.sep} />

            {/* Amenities */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Équipements inclus</h2>
              <div className={styles.amenitiesGrid}>
                {villa.amenities.map((a) => (
                  <div key={a.label} className={styles.amenityItem}>
                    <span className={styles.amenityIcon}>
                      {AMENITY_ICON_MAP[a.icon] ?? <Check size={18} />}
                    </span>
                    <span className={styles.amenityLabel}>{a.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Transport */}
            {villa.transportPropose && villa.transportPropose.length > 0 && (
              <>
                <hr className={styles.sep} />
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Transport proposé</h2>
                  <div className={styles.transportGrid}>
                    {villa.transportPropose.map((t) => (
                      <div key={t} className={styles.transportItem}>
                        <span className={styles.transportIcon}>
                          {TRANSPORT_ICON_MAP[t] ?? <Car size={15} />}
                        </span>
                        <span className={styles.transportLabel}>{t}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <hr className={styles.sep} />

            {/* Reviews */}
            <section className={styles.section}>
              <div className={styles.reviewsHeader}>
                <Star size={18} fill="currentColor" className={styles.starIcon} />
                <h2 className={styles.sectionTitle}>
                  {villa.rating} · {villa.reviewCount} avis
                </h2>
              </div>
              {villa.avis && villa.avis.length > 0 && (
                <div className={styles.reviewsGrid}>
                  {villa.avis.map((avis) => (
                    <div key={avis.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <img src={avis.avatar} alt={avis.author} className={styles.reviewAvatar} />
                        <div className={styles.reviewMeta}>
                          <span className={styles.reviewAuthor}>{avis.author}</span>
                          <span className={styles.reviewDate}>{avis.date}</span>
                        </div>
                        <div className={styles.reviewStars}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={11}
                              fill={i < avis.rating ? 'currentColor' : 'none'}
                              className={i < avis.rating ? styles.starFilled : styles.starEmpty}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{avis.comment}</p>
                      <div className={styles.reviewCategories}>
                        {Object.entries(avis.categories).map(([key, val]) => (
                          <span key={key} className={styles.reviewCatChip}>
                            {key === 'proprete'
                              ? 'Propreté'
                              : key === 'confort'
                              ? 'Confort'
                              : key === 'emplacement'
                              ? 'Emplacement'
                              : 'Accueil'}{' '}
                            {val}/5
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Booking Card ── */}
          <aside className={styles.bookingAside}>
            <div className={styles.bookingCard}>
              <p className={styles.bookingPrice}>
                <strong>{villa.pricePerNight.toLocaleString('fr-FR')} FCFA</strong>
                <span> / nuit</span>
              </p>

              <div className={styles.ratingSmall}>
                <Star size={12} fill="currentColor" className={styles.starIcon} />
                <strong>{villa.rating}</strong>
                <span className={styles.reviewCountSmall}>({villa.reviewCount} avis)</span>
              </div>

              <div className={styles.dateGrid}>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>
                    <CalendarDays size={11} /> ARRIVÉE
                  </label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateArrivee}
                    onChange={(e) => setDateArrivee(e.target.value)}
                  />
                </div>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>
                    <CalendarDays size={11} /> DÉPART
                  </label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateDepart}
                    onChange={(e) => setDateDepart(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.voyageursField}>
                <label className={styles.dateLabel}>
                  <Users size={11} /> VOYAGEURS
                </label>
                <div className={styles.counter}>
                  <button className={styles.counterBtn} onClick={() => setVoyageurs(Math.max(1, voyageurs - 1))}>−</button>
                  <span className={styles.counterVal}>{voyageurs}</span>
                  <button className={styles.counterBtn} onClick={() => setVoyageurs(Math.min(villa.capacity, voyageurs + 1))}>+</button>
                </div>
              </div>

              <button
                className={styles.reserveBtn}
                onClick={() => {
                  if (isAuthenticated()) {
                    navigate('/reservation');
                  } else {
                    navigate('/connexion');
                  }
                }}
              >
                Réserver maintenant
              </button>

              <div className={styles.bookingSummary}>
                <div className={styles.summaryRow}>
                  <span>{villa.pricePerNight.toLocaleString('fr-FR')} × 7 nuits</span>
                  <span>{(villa.pricePerNight * 7).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Frais de service</span>
                  <span>150 000 FCFA</span>
                </div>
                <hr className={styles.sumSep} />
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total estimé</span>
                  <span>{(villa.pricePerNight * 7 + 150000).toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <p className={styles.bookingNote}>
                Vous ne serez débité qu'après confirmation de l'hôte.
              </p>
            </div>

            {/* Back link */}
            <Link to="/logements" className={styles.backLink}>
              <ArrowLeft size={14} />
              Retour aux logements
            </Link>
          </aside>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>✕</button>
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={() => setLightboxIdx((i) => (i - 1 + villa.images.length) % villa.images.length)}
            >
              ‹
            </button>
            <img
              src={villa.images[lightboxIdx]}
              alt={`Photo ${lightboxIdx + 1}`}
              className={styles.lightboxImg}
            />
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={() => setLightboxIdx((i) => (i + 1) % villa.images.length)}
            >
              ›
            </button>
            <div className={styles.lightboxCount}>
              {lightboxIdx + 1} / {villa.images.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LogementDetailPage;
