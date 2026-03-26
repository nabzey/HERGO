import { useState, useEffect } from 'react';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './AuthPage.module.css';

import im1 from '../../assets/im1.jpeg';
import im2 from '../../assets/im2.jpeg';
import im3 from '../../assets/im3.jpeg';
import im4 from '../../assets/im4.jpeg';
import im5 from '../../assets/im5.jpeg';
import im6 from '../../assets/im6.jpeg';
import im7 from '../../assets/im7.jpeg';
import im8 from '../../assets/im8.jpeg';
import im9 from '../../assets/im9.jpeg';

const SLIDES = [im1, im2, im3, im4, im5, im6, im7, im8, im9];

type AuthTab = 'connexion' | 'inscription';

interface AuthPageProps {
  defaultTab?: AuthTab;
}

const AuthPage = ({ defaultTab = 'connexion' }: AuthPageProps) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* Slideshow de fond */}
      <div className={styles.slideshow}>
        {SLIDES.map((img, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === currentSlide ? styles.slideActive : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className={styles.slideshowOverlay} />
      </div>

      {/* Lien retour accueil */}
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={14} />
        Retour à l'accueil
      </Link>

      {/* Carte d'authentification */}
      <div className={styles.card}>
        {/* En-tête avec logo */}
        <div className={styles.cardHeader}>
          <div className={styles.logoIcon}>
            <LayoutGrid size={18} />
          </div>
          <span className={styles.logoText}>HERGO</span>
        </div>

        {/* Onglets */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'connexion' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('connexion')}
          >
            Connexion
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'inscription' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('inscription')}
          >
            Inscription
          </button>
        </div>

        {/* Corps */}
        <div className={styles.body}>
          {activeTab === 'connexion' ? (
            <LoginForm onSwitchToRegister={() => setActiveTab('inscription')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setActiveTab('connexion')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
