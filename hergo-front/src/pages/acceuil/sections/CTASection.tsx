import { Link } from 'react-router-dom';
import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Prêt à réserver votre prochain séjour ?</h2>
      <p className={styles.subtitle}>
        Rejoignez des milliers de voyageurs qui font confiance à HERGO
      </p>
      <div className={styles.actions}>
        <Link to="/logements" className={styles.actionLink}>Explorer les hébergements</Link>
        <Link to="/inscription" className={styles.actionLink}>Devenir hôte</Link>
      </div>
    </section>
  );
};

export default CTASection;
