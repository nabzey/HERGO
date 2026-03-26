import { Search, ShieldCheck, Zap } from 'lucide-react';
import styles from './WhyHergo.module.css';

const features = [
  {
    id: 1,
    icon: <Search size={26} color="#7C3AED" />,
    title: 'Recherche facile',
    description:
      "Trouvez rapidement l'hébergement parfait grâce à nos filtres avancés et notre système de géolocalisation",
  },
  {
    id: 2,
    icon: <ShieldCheck size={26} color="#7C3AED" />,
    title: 'Réservation sécurisée',
    description:
      'Paiement mobile sécurisé et protection de vos données personnelles garantie',
  },
  {
    id: 3,
    icon: <Zap size={26} color="#7C3AED" />,
    title: 'Recommandations personnalisées',
    description:
      'Des suggestions adaptées à vos préférences, votre budget et votre localisation',
  },
];

const WhyHergo = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className="section-title">Pourquoi choisir HERGO ?</h2>
        <p className="section-subtitle">
          Une plateforme conçue pour simplifier vos réservations
        </p>

        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.id} className={styles.card}>
              <div className={styles.iconWrapper}>{f.icon}</div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyHergo;
