import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { getDashboardRoute, useAuth } from '../../hooks/useAuth';
import videoOne from '../../assets/video 1.mp4';
import videoTwo from '../../assets/video2.mp4';
import imageOne from '../../assets/image1.jpeg';
import imageTwo from '../../assets/image2.jpeg';
import imageThree from '../../assets/image3.jpeg';
import imageFour from '../../assets/image4.jpeg';
import imageFive from '../../assets/image 5.jpeg';
import imOne from '../../assets/im1.jpeg';
import imTwo from '../../assets/im2.jpeg';
import imThree from '../../assets/im3.jpeg';
import imFour from '../../assets/im4.jpeg';
import imFive from '../../assets/im5.jpeg';
import imSix from '../../assets/im6.jpeg';
import imSeven from '../../assets/im7.jpeg';
import imEight from '../../assets/im8.jpeg';
import imNine from '../../assets/im9.jpeg';
import styles from './WelcomePage.module.css';

const HERO_MEDIA = [
  { type: 'video', src: videoOne, title: 'Video HERGO 1' },
  { type: 'image', src: imageOne, alt: 'Destination HERGO image 1' },
  { type: 'image', src: imageTwo, alt: 'Destination HERGO image 2' },
  { type: 'video', src: videoTwo, title: 'Video HERGO 2' },
  { type: 'image', src: imageThree, alt: 'Destination HERGO image 3' },
  { type: 'image', src: imageFour, alt: 'Destination HERGO image 4' },
  { type: 'image', src: imageFive, alt: 'Destination HERGO image 5' },
  { type: 'image', src: imOne, alt: 'Destination HERGO image 6' },
  { type: 'image', src: imTwo, alt: 'Destination HERGO image 7' },
  { type: 'image', src: imThree, alt: 'Destination HERGO image 8' },
  { type: 'image', src: imFour, alt: 'Destination HERGO image 9' },
  { type: 'image', src: imFive, alt: 'Destination HERGO image 10' },
  { type: 'image', src: imSix, alt: 'Destination HERGO image 11' },
  { type: 'image', src: imSeven, alt: 'Destination HERGO image 12' },
  { type: 'image', src: imEight, alt: 'Destination HERGO image 13' },
  { type: 'image', src: imNine, alt: 'Destination HERGO image 14' },
];

const renderMedia = (media: (typeof HERO_MEDIA)[number], className: string) => {
  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        title={media.title}
        className={className}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return <img src={media.src} alt={media.alt} className={className} />;
};

const WelcomePage = () => {
  const { loading, user } = useAuth();

  if (!loading && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCard}>
            <div className={styles.backgroundStack}>
              {HERO_MEDIA.map((media, index) => (
                <div
                  key={`${media.src}-${index}`}
                  className={styles.backgroundSlide}
                  style={{ animationDelay: `${index * 2.4}s` }}
                >
                  {renderMedia(media, styles.backgroundMedia)}
                </div>
              ))}
            </div>

            <div className={styles.overlay} />

            <div className={styles.brand}>
              <div className={styles.brandIcon}>
                <LayoutGrid size={18} />
              </div>
              <span className={styles.brandText}>HERGO</span>
            </div>

            <div className={styles.copy}>
           

              <p className={styles.eyebrow}>Reservation d&apos;hebergements temporaires</p>
              <h1 className={styles.title}>Trouvez votre sejour ideal avec HERGO.</h1>
              
            </div>

            <div className={styles.footerRow}>
              <Link to="/accueil" className={styles.primaryButton}>
                Visiter le site
                <ArrowRight size={18} />
              </Link>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WelcomePage;
