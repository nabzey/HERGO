import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star, ChevronLeft, Send, CheckCircle,
  Smile, Home, MapPin, Coffee,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './AvisPage.module.css';

const CATEGORIES = [
  { key: 'proprete', label: 'Propreté', icon: <Star size={16} /> },
  { key: 'confort', label: 'Confort', icon: <Home size={16} /> },
  { key: 'emplacement', label: 'Emplacement', icon: <MapPin size={16} /> },
  { key: 'accueil', label: 'Accueil', icon: <Smile size={16} /> },
  { key: 'rapport_qualite', label: 'Rapport qualité/prix', icon: <Coffee size={16} /> },
];

const QUICK_TAGS = [
  'Très bien situé', 'Accueil chaleureux', 'Propre', 'Équipements complets',
  'Vue magnifique', 'Calme et reposant', 'Personnel attentionné', 'Excellent rapport qualité/prix',
];

const AvisPage = () => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleCategoryRating = (key: string, value: number) =>
    setCategoryRatings((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const RATING_LABELS: Record<number, string> = {
    1: 'Décevant',
    2: 'Passable',
    3: 'Bien',
    4: 'Très bien',
    5: 'Exceptionnel',
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <div className={styles.thanksCard}>
            <div className={styles.successIconWrap}>
              <CheckCircle size={64} className={styles.successIcon} />
            </div>
            <h1 className={styles.thanksTitle}>Merci pour votre avis !</h1>
            <p className={styles.thanksSubtitle}>
              Votre évaluation a bien été enregistrée. Elle aidera d'autres voyageurs à faire le meilleur choix.
            </p>
            <div className={styles.thanksMeta}>
              <div className={styles.thanksRating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < rating ? 'currentColor' : 'none'}
                    className={styles.thanksStarIcon}
                  />
                ))}
              </div>
              <span className={styles.thanksRatingLabel}>{RATING_LABELS[rating] ?? ''} — Villa Sunset Paradise</span>
            </div>
            <div className={styles.thanksActions}>
              <Link to="/mes-reservations" className={styles.primaryBtn}>
                Retour à mes réservations
              </Link>
              <Link to="/" className={styles.secondaryBtn}>
                Accueil
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.inner}>
        <div className={styles.header}>
          <Link to="/mes-reservations" className={styles.backLink}>
            <ChevronLeft size={14} /> Retour à mes réservations
          </Link>
        </div>

        {/* Page title */}
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Laisser un avis</h1>
          <p className={styles.subtitle}>
            Partagez votre expérience à <strong>Villa Sunset Paradise</strong>
          </p>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Overall rating */}
            <div className={styles.section}>
              <label className={styles.label}>Note globale</label>
              <div className={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={styles.starBtn}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={36}
                      fill={(hovered || rating) >= star ? 'currentColor' : 'none'}
                      className={(hovered || rating) >= star ? styles.starActive : styles.starInactive}
                    />
                  </button>
                ))}
                <span className={styles.ratingLabel}>
                  {(hovered || rating) > 0 ? RATING_LABELS[hovered || rating] : 'Sélectionnez une note'}
                </span>
              </div>
            </div>

            {/* Category ratings */}
            <div className={styles.section}>
              <label className={styles.label}>Notes détaillées</label>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <div key={cat.key} className={styles.categoryItem}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <span className={styles.categoryLabel}>{cat.label}</span>
                    </div>
                    <div className={styles.categoryStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={styles.catStarBtn}
                          onClick={() => handleCategoryRating(cat.key, s)}
                          aria-label={`${s} étoile`}
                        >
                          <Star
                            size={18}
                            fill={(categoryRatings[cat.key] ?? 0) >= s ? 'currentColor' : 'none'}
                            className={(categoryRatings[cat.key] ?? 0) >= s ? styles.catStarActive : styles.catStarInactive}
                          />
                        </button>
                      ))}
                      {categoryRatings[cat.key] && (
                        <span className={styles.catScoreLabel}>{categoryRatings[cat.key]}/5</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tags */}
            <div className={styles.section}>
              <label className={styles.label}>Points forts <span className={styles.optional}>(optionnel)</span></label>
              <div className={styles.tagContainer}>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagBtn} ${selectedTags.includes(tag) ? styles.tagBtnActive : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment textarea */}
            <div className={styles.section}>
              <label className={styles.label}>Votre avis détaillé</label>
              <textarea
                className={styles.textarea}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Décrivez votre expérience : qualité de l'hébergement, accueil, équipements, points à améliorer..."
                rows={6}
                required
              />
              <span className={styles.charCount}>{comment.length} / 1000 caractères</span>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={rating === 0 || comment.trim().length < 10}
            >
              <Send size={16} /> Envoyer mon avis
            </button>

            {rating === 0 && (
              <p className={styles.submitHint}>Veuillez sélectionner une note globale pour continuer.</p>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AvisPage;
