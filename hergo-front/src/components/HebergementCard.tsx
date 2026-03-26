import { useState } from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import { type Hebergement } from '../data/mockData';
import styles from './HebergementCard.module.css';

interface HebergementCardProps {
  hebergement: Hebergement;
}

const HebergementCard = ({ hebergement }: HebergementCardProps) => {
  const [isFav, setIsFav] = useState(hebergement.isFavorite);

  const formatPrice = (price: number) =>
    price.toLocaleString('fr-FR');

  return (
    <div className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img
          src={hebergement.image}
          alt={hebergement.name}
          className={styles.image}
        />
        <span className={styles.typeBadge}>{hebergement.type}</span>
        <button
          className={styles.favoriteBtn}
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          aria-label="Ajouter aux favoris"
        >
          <Heart
            size={16}
            className={isFav ? styles.favIconActive : styles.favIcon}
          />
        </button>
      </div>

      {/* Contenu */}
      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{hebergement.name}</h3>
          <div className={styles.rating}>
            <Star size={14} className={styles.starIcon} fill="currentColor" />
            <span className={styles.ratingValue}>{hebergement.rating}</span>
          </div>
        </div>

        <div className={styles.location}>
          <MapPin size={13} className={styles.locationIcon} />
          <span>{hebergement.location}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceValue}>
              {formatPrice(hebergement.pricePerNight)}
            </span>
            <span className={styles.priceUnit}>FCFA/nuit</span>
          </div>
          <span className={styles.reviews}>{hebergement.reviewCount} avis</span>
        </div>
      </div>
    </div>
  );
};

export default HebergementCard;
