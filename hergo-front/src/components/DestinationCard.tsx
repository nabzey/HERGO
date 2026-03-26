import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Destination } from '../data/mockData';
import styles from './DestinationCard.module.css';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  return (
    <Link to="/logements" className={styles.card}>
      <img
        src={destination.image}
        alt={`${destination.city}, ${destination.country}`}
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h3 className={styles.city}>{destination.city}</h3>
        <p className={styles.country}>{destination.country}</p>
        <div className={styles.properties}>
          <Building2 size={12} />
          <span>{destination.propertyCount} propriétés</span>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
