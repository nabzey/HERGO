import { Home, Users, Calendar, CreditCard } from 'lucide-react';
import styles from './WelcomeSection.module.css';

const features = [
  {
    id: 1,
    icon: <Home size={28} />,
    title: 'Hébergements de qualité',
    description: 'Découvrez des villas, hôtels et appartements vérifiés par notre équipe',
  },
  {
    id: 2,
    icon: <Users size={28} />,
    title: 'Hôtes fiables',
    description: 'Tous nos hôtes sont certifiés pour vous garantir un séjour serein',
  },
  {
    id: 3,
    icon: <Calendar size={28} />,
    title: 'Réservation flexible',
    description: 'Choisissez vos dates et payez selon vos préférences (acompte ou total)',
  },
  {
    id: 4,
    icon: <CreditCard size={28} />,
    title: 'Paiement sécurisé',
    description: 'Transactions sécurisées via Mobile Money pour une totale tranquillité',
  },
];

const WelcomeSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bienvenue sur HERGO</h1>
          <p className={styles.subtitle}>
            Votre plateforme de réservation d&apos;hébergement temporaire en Afrique de l&apos;Ouest
          </p>
          <p className={styles.description}>
            HERGO simplifie la recherche et la réservation de logements temporaires. 
            Que vous voyagiez pour affaires ou plaisir, trouvez l&apos;hébergement idéal 
            parmi notre sélection de villas, hôtels et appartements de prestige. 
            Réservez en toute simplicité avec des paiement mobiles sécurisés.
          </p>
        </div>

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

export default WelcomeSection;