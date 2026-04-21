import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Star, MapPin, CalendarDays, Users, Check,
  Images, Heart, ArrowLeft,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { logementsApi, favorisApi } from '../../core/api/api';
import toast from 'react-hot-toast';
import styles from './LogementDetailPage.module.css';


/* ── Main page ──────────────────────────────────────────── */
const LogementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [villa, setVilla] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const logementId = Number(id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [dateArrivee, setDateArrivee] = useState('');
  const [dateDepart, setDateDepart] = useState('');
  const [voyageurs, setVoyageurs] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [dateError, setDateError] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch logement
        const response = await logementsApi.getById(logementId) as { logement: any };
        const v = response.logement;

        // Si le logement n'est pas publié et que l'utilisateur n'est pas l'admin/hôte (simplifié ici par check statut)
        if (v.statut !== 'PUBLIE') {
          // Note: On pourrait ajouter un check req.user ici, mais api.ts getById catch déjà les erreurs
          // Pour l'instant on force la redirection si pas PUBLIE pour le voyageur
          navigate('/');
          return;
        }

        setVilla(v);

        // Fetch favori status
        const isFav = await favorisApi.check(logementId);
        setIsFavorite(isFav);

        // Fetch reservations to check busy dates (simplified logic)
        // Note: idealement on aurait un endpoint /logements/:id/busy-dates
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logementId, navigate]);

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };



  if (loading) return <div className={styles.page}><Navbar /><div className={styles.inner}><p>Chargement...</p></div><Footer /></div>;
  if (error || !villa) return <div className={styles.page}><Navbar /><div className={styles.inner}><p>{error || 'Logement introuvable'}</p></div><Footer /></div>;

  const images = villa.images?.length > 0 ? villa.images.map((img: any) => img.url) : ['/vite.svg'];
  const mainImg = images[0];
  const sideImg1 = images[1] || mainImg;
  const sideImg2 = images[2] || mainImg;
  const thumbs = images.slice(3);

  const handleToggleFavorite = async () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    setFavoriteMessage(newState ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');

    if (isAuthenticated()) {
      try {
        if (!newState) {
          await favorisApi.remove(logementId);
        } else {
          await favorisApi.add(logementId);
        }
      } catch (error) {
        setIsFavorite(!newState);
        setFavoriteMessage('Erreur lors de la mise à jour des favoris');
      }
    }
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
          <span className={styles.breadCurrent}>{villa.titre}</span>
        </div>

        {/* ── Gallery + Rating Sidebar ── */}
        <div className={styles.topRow}>

          {/* Gallery */}
          <div className={styles.galleryArea}>
            {/* Main grid: big photo + 2 side photos */}
            <div className={styles.mainGallery}>
              <div className={styles.bigPhotoWrap} style={{ position: 'relative' }}>
                <img src={mainImg} alt={villa.titre} className={styles.bigPhoto} onClick={() => openLightbox(0)} style={{ cursor: 'pointer' }} />
                <div className={styles.photoOverlay} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart size={32} fill={isFavorite ? '#ef4444' : 'rgba(0,0,0,0.4)'} color="#fff" />
                </button>
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
              {thumbs.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className={styles.thumbWrap} onClick={() => openLightbox(i + 3)}>
                  <img src={img} alt={`Vue ${i + 4}`} className={styles.thumbPhoto} />
                  <div className={styles.photoOverlay} />
                </div>
              ))}
              {/* Last thumb with "autres photos" overlay */}
              <div className={styles.thumbWrap} onClick={() => openLightbox(Math.max(0, images.length - 1))} style={{ position: 'relative' }}>
                {thumbs[4] && (
                  <img src={thumbs[4]} alt="Plus de photos" className={styles.thumbPhoto} />
                )}
                <div className={styles.morePhotosOverlay}>
                  <Images size={20} />
                  <span>{images.length} photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Rating Sidebar ── */}
          <aside className={styles.ratingSidebar}>
            {/* Global score */}
            <div className={styles.ratingBox}>
              <div className={styles.ratingTopRow}>
                <div className={styles.ratingLabel}>Très bien</div>
                <div className={styles.ratingBadge}>
                  {(villa.rating || 4.5).toFixed(1).replace('.', ',')}
                </div>
              </div>
              <p className={styles.experiencesCount}>
                {(villa.reviewCount || 12).toLocaleString('fr-FR')} expériences vécues
              </p>
            </div>

            {/* Featured review (mock for now as real reviews are not fetched) */}
            <div className={styles.reviewQuoteBox}>
              <p className={styles.reviewQuoteTitle}>
                Ce que les voyageurs adorent :
              </p>
              <p className={styles.reviewQuoteText}>
                « Un séjour inoubliable dans un cadre idyllique. Le confort est au rendez-vous. »
              </p>
            </div>

            {/* Map */}
            <div className={styles.mapBox}>
              <div className={styles.mapImgWrap}>
                <img
                  src={`https://maps.wikimedia.org/img/osm-intl,14,${villa.latitude || 14.7167},${villa.longitude || -17.4677},280x140.png`}
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
                <span className={styles.typeBadge}>{villa.type || 'Villa'} · {villa.capacite} personnes</span>
              </div>
              <h1 className={styles.villaTitle}>{villa.titre}</h1>
              <div className={styles.metaRow}>
                <div className={styles.ratingInline}>
                  <Star size={14} fill="currentColor" className={styles.starIcon} />
                  <strong>{villa.rating || 4.5}</strong>
                  <span className={styles.reviewCountInline}>({villa.reviewCount || 12} avis)</span>
                </div>
                <span className={styles.metaDot}>·</span>
                <div className={styles.locationInline}>
                  <MapPin size={13} />
                  {villa.ville}, {villa.pays}
                </div>
              </div>
            </div>

            {/* Host */}
            <div className={styles.hostRow}>
              <img src={villa.proprietaire?.avatar || 'https://ui-avatars.com/api/?name=Hote&background=c9a570&color=fff'} alt={villa.proprietaire?.firstName} className={styles.hostAvatar} />
              <div>
                <p className={styles.hostedBy}>Hébergement proposé par</p>
                <p className={styles.hostName}>{villa.proprietaire?.firstName || 'Hôte'} {villa.proprietaire?.lastName || ''}</p>
                <p className={styles.hostSince}>Hôte vérifié · Note 4.8/5</p>
              </div>
            </div>

            <hr className={styles.sep} />

            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>À propos de ce logement</h2>
              <p className={styles.description}>{villa.description}</p>
            </section>

            <hr className={styles.sep} />

            {/* ── Espaces section ── */}
            {villa.espaces?.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Les espaces du logement</h2>
                <div className={styles.espacesGrid}>
                  {villa.espaces.map((espace: any) => (
                    <div key={espace.id} className={styles.espaceCard}>
                      <div className={styles.espaceBody}>
                        <span className={styles.espaceNom}>{espace.nom}</span>
                        <p className={styles.espaceDesc}>{espace.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {villa.espaces?.length > 0 && <hr className={styles.sep} />}

            {/* Amenities */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Équipements inclus</h2>
              <div className={styles.amenitiesGrid}>
                {villa.equipements?.map((a: any) => (
                  <div key={a.id} className={styles.amenityItem}>
                    <span className={styles.amenityIcon}>
                      <Check size={18} />
                    </span>
                    <span className={styles.amenityLabel}>{a.nom}</span>
                  </div>
                ))}
              </div>
            </section>



            <hr className={styles.sep} />

            {/* Reviews */}
            <section className={styles.section}>
              <div className={styles.reviewsHeader}>
                <Star size={18} fill="currentColor" className={styles.starIcon} />
                <h2 className={styles.sectionTitle}>
                  {(villa.rating || 4.5).toFixed(1)} · {villa.reviews?.length || 0} avis
                </h2>
              </div>
              {villa.reviews && villa.reviews.length > 0 && (
                <div className={styles.reviewsGrid}>
                  {villa.reviews.map((review: any) => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <img
                          src={review.voyageur?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((review.voyageur?.firstName || 'U') + ' ' + (review.voyageur?.lastName || ''))}&background=c9a570&color=fff`}
                          alt={review.voyageur?.firstName || 'Voyageur'}
                          className={styles.reviewAvatar}
                        />
                        <div className={styles.reviewMeta}>
                          <span className={styles.reviewAuthor}>{review.voyageur?.firstName || 'Voyageur'} {review.voyageur?.lastName || ''}</span>
                          <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className={styles.reviewStars}>
                          {Array.from({ length: 5 }, (_, i: number) => (
                            <Star
                              key={i}
                              size={11}
                              fill={i < review.note ? 'currentColor' : 'none'}
                              className={i < review.note ? styles.starFilled : styles.starEmpty}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{review.commentaire}</p>
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
                <strong>{(villa.prixJour || 0).toLocaleString('fr-FR')} FCFA</strong>
                <span> / nuit</span>
              </p>

              <div className={styles.ratingSmall}>
                <Star size={12} fill="currentColor" className={styles.starIcon} />
                <strong>{villa.rating || 4.5}</strong>
                <span className={styles.reviewCountSmall}>({villa.reviewCount || 12} avis)</span>
              </div>

              <div className={`${styles.dateGrid} ${dateError ? styles.dateGridError : ''}`} style={dateError ? { border: '1px solid #ef4444', borderRadius: '8px', padding: '4px' } : {}}>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel} style={dateError ? { color: '#ef4444' } : {}}>
                    <CalendarDays size={11} /> ARRIVÉE
                  </label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    min={new Date().toISOString().split('T')[0]}
                    value={dateArrivee}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                    onChange={(e) => { setDateArrivee(e.target.value); setDateError(false); }}
                  />
                </div>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel} style={dateError ? { color: '#ef4444' } : {}}>
                    <CalendarDays size={11} /> DÉPART
                  </label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    min={dateArrivee || new Date().toISOString().split('T')[0]}
                    value={dateDepart}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                    onChange={(e) => { setDateDepart(e.target.value); setDateError(false); }}
                  />
                </div>
              </div>
              {dateError && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', textAlign: 'center' }}>
                  Veuillez sélectionner vos dates de séjour
                </p>
              )}

              <div className={styles.voyageursField}>
                <label className={styles.dateLabel}>
                  <Users size={11} /> VOYAGEURS
                </label>
                <div className={styles.counter}>
                  <button className={styles.counterBtn} onClick={() => setVoyageurs(Math.max(1, voyageurs - 1))}>−</button>
                  <span className={styles.counterVal}>{voyageurs}</span>
                  <button className={styles.counterBtn} onClick={() => setVoyageurs(Math.min(villa.capacite || 10, voyageurs + 1))}>+</button>
                </div>
              </div>

              <button
                className={styles.reserveBtn}
                onClick={() => {
                  if (!dateArrivee || !dateDepart) {
                    setDateError(true);
                    return;
                  }
                  if (isAuthenticated()) {
                    navigate(`/reservation/${logementId}`, {
                      state: {
                        dateArrivee,
                        dateDepart,
                        voyageurs,
                        villa
                      },
                    });
                  } else {
                    navigate('/connexion');
                  }
                }}
              >
                Réserver maintenant
              </button>

              {favoriteMessage && (
                <p className={styles.bookingNote} style={{ marginTop: '0.5rem', color: '#10b981', fontWeight: 500 }}>
                  {favoriteMessage}
                </p>
              )}

              {dateArrivee && dateDepart && (
                <div className={styles.bookingSummary}>
                  <div className={styles.summaryRow}>
                    <span>{villa.prixJour.toLocaleString('fr-FR')} × {Math.ceil((new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) / (1000 * 3600 * 24))} nuits</span>
                    <span>{(villa.prixJour * Math.ceil((new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) / (1000 * 3600 * 24))).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Frais de service</span>
                    <span>15 000 FCFA</span>
                  </div>
                  <hr className={styles.sumSep} />
                  <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                    <span>Total estimé</span>
                    <span>{(villa.prixJour * Math.ceil((new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) / (1000 * 3600 * 24)) + 15000).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              )}

              <p className={styles.bookingNote}>
                L'hôte doit valider votre demande avant tout paiement.
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
              onClick={() => setLightboxIdx((i: number) => (i - 1 + images.length) % images.length)}
            >
              ‹
            </button>
            <img
              src={images[lightboxIdx]}
              alt={`Photo ${lightboxIdx + 1}`}
              className={styles.lightboxImg}
            />
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={() => setLightboxIdx((i: number) => (i + 1) % images.length)}
            >
              ›
            </button>
            <div className={styles.lightboxCount}>
              {lightboxIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LogementDetailPage;
