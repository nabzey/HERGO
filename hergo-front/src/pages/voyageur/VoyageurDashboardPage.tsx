import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Bell, Star, Settings, Heart, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { notificationsApi, reservationsApi } from '../../core/api/api';
import VoyageurLayout from '../../components/VoyageurLayout';
import styles from './VoyageurDashboardPage.module.css';
import heroImageOne from '../../assets/im1.jpeg';
import heroImageTwo from '../../assets/im7.jpeg';
import heroImageThree from '../../assets/im9.jpeg';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

const VoyageurDashboardPage = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = user as User | null;
        if (userData) {
          setCurrentUser(userData);
        }

        const [notifications, reservations] = await Promise.all([
          notificationsApi.getAll().catch(() => []),
          reservationsApi.getAll().catch(() => []),
        ]);

        setNotificationsCount((notifications as []).filter((n: any) => !n.lu).length);
        setReservationsCount((reservations as []).filter((r: any) => r.statut !== 'TERMINE' && r.statut !== 'ANNULE').length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  return (
    <VoyageurLayout>
      <div className={styles.content}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeBackdrop}>
            <img src={heroImageOne} alt="" className={`${styles.heroImage} ${styles.heroImageMain}`} />
            <img src={heroImageTwo} alt="" className={`${styles.heroImage} ${styles.heroImageSide}`} />
            <img src={heroImageThree} alt="" className={`${styles.heroImage} ${styles.heroImageAccent}`} />
            <div className={styles.welcomeGlow} />
            <div className={styles.welcomeOverlay} />
          </div>

          <div className={styles.welcomeContent}>
            <div className={styles.welcomeBadge}>
              <Sparkles size={14} />
              Bonjour {currentUser?.firstName || 'voyageur'}
            </div>
            <h1 className={styles.welcomeTitle}>Préparez votre prochaine escapade avec HERGO</h1>
            <p className={styles.welcomeText}>
              Retrouvez vos séjours, vos favoris et vos notifications dans un espace plus immersif, pensé pour voyager d’un clic.
            </p>
            <div className={styles.welcomeActions}>
              <Link to="/logements" className={styles.homeLink}>
                <MapPin size={16} />
                Explorer les logements
                <ChevronRight size={16} />
              </Link>
              <Link to="/mes-reservations" className={styles.secondaryLink}>
                <CalendarDays size={16} />
                Voir mes réservations
              </Link>
            </div>
          </div>

          <div className={styles.welcomePanels}>
            <div className={`${styles.floatingPanel} ${styles.panelPrimary}`}>
              <span className={styles.panelLabel}>Séjours actifs</span>
              <strong className={styles.panelValue}>{reservationsCount}</strong>
              <span className={styles.panelHint}>vos réservations en cours</span>
            </div>
            <div className={`${styles.floatingPanel} ${styles.panelSecondary}`}>
              <span className={styles.panelLabel}>Ambiance HERGO</span>
              <strong className={styles.panelValue}>Dakar • Saly • Casamance</strong>
              <span className={styles.panelHint}>des inspirations qui bougent en arrière-plan</span>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <Link to="/mes-reservations" className={styles.statCard}>
            <div className={styles.statIcon}><CalendarDays size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{reservationsCount}</span>
              <span className={styles.statLabel}>Réservations en cours</span>
            </div>
          </Link>

          <Link to="/notifications" className={styles.statCard}>
            <div className={styles.statIcon}><Bell size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{notificationsCount}</span>
              <span className={styles.statLabel}>Notifications</span>
            </div>
          </Link>

          <Link to="/favoris" className={styles.statCard}>
            <div className={styles.statIcon}><Heart size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>-</span>
              <span className={styles.statLabel}>Favoris</span>
            </div>
          </Link>

          <Link to="/avis/0" className={styles.statCard}>
            <div className={styles.statIcon}><Star size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>-</span>
              <span className={styles.statLabel}>Avis</span>
            </div>
          </Link>
        </div>

        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Actions rapides</h2>
          <div className={styles.actionsGrid}>
            <Link to="/logements" className={styles.actionCard}>
              <MapPin size={20} />
              <span>Voir les hébergements</span>
            </Link>
            <Link to="/mes-reservations" className={styles.actionCard}>
              <CalendarDays size={20} />
              <span>Mes réservations</span>
            </Link>
            <Link to="/notifications" className={styles.actionCard}>
              <Bell size={20} />
              <span>Mes notifications</span>
            </Link>
            <Link to="/parametres" className={styles.actionCard}>
              <Settings size={20} />
              <span>Paramètres</span>
            </Link>
          </div>
        </div>
      </div>
    </VoyageurLayout>
  );
};

export default VoyageurDashboardPage;
