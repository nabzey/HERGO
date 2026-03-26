import DestinationCard from '../../../components/DestinationCard';
import { destinations } from '../../../data/mockData';
import styles from './TrendingDestinations.module.css';

const TrendingDestinations = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">Destinations tendances</h2>
        <p className="section-subtitle">
          Explorez les villes les plus prisées pour vos séjours
        </p>

        <div className={styles.grid}>
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;
