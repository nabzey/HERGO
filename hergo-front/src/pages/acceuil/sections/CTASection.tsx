import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Prêt à réserver votre prochain séjour ?</h2>
      <p className={styles.subtitle}>
        Rejoignez des milliers de voyageurs qui font confiance à HERGO
      </p>
      <div className={styles.actions}>
        <button className="btn-outline-white">Explorer les hébergements</button>
        <button className="btn-outline-white">Devenir hôte</button>
      </div>
    </section>
  );
};

export default CTASection;
