import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HebergementCard from '../../../components/HebergementCard';
import { hebergements } from '../../../data/mockData';
import styles from './PopularHebergements.module.css';

const PopularHebergements = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">Hébergements populaires</h2>
        <p className="section-subtitle">
          Découvrez notre sélection d'hôtels et villas les mieux notés
        </p>

        <div className={styles.grid}>
          {hebergements.map((h) => (
            <HebergementCard key={h.id} hebergement={h} />
          ))}
        </div>

        <div className={styles.viewAllWrapper}>
          <Link to="/logements" className={styles.viewAllBtn}>
            Voir tous les hébergements
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularHebergements;
