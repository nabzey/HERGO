import { MapPin, Calendar, Users, Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import videoOne from '../../../assets/video 1.mp4';
import videoTwo from '../../../assets/video2.mp4';
import imageOne from '../../../assets/image1.jpeg';
import imageTwo from '../../../assets/image2.jpeg';
import imageThree from '../../../assets/image3.jpeg';
import imageFour from '../../../assets/image4.jpeg';
import imageFive from '../../../assets/image 5.jpeg';
import imOne from '../../../assets/im1.jpeg';
import imTwo from '../../../assets/im2.jpeg';
import imThree from '../../../assets/im3.jpeg';
import imFour from '../../../assets/im4.jpeg';
import imFive from '../../../assets/im5.jpeg';
import imSix from '../../../assets/im6.jpeg';
import imSeven from '../../../assets/im7.jpeg';
import imEight from '../../../assets/im8.jpeg';
import imNine from '../../../assets/im9.jpeg';
import styles from './HeroSection.module.css';

const HERO_MEDIA = [
  { type: 'video', src: videoOne, title: 'Video accueil 1' },
  { type: 'image', src: imageOne, alt: 'Accueil image 1' },
  { type: 'image', src: imageTwo, alt: 'Accueil image 2' },
  { type: 'video', src: videoTwo, title: 'Video accueil 2' },
  { type: 'image', src: imageThree, alt: 'Accueil image 3' },
  { type: 'image', src: imageFour, alt: 'Accueil image 4' },
  { type: 'image', src: imageFive, alt: 'Accueil image 5' },
  { type: 'image', src: imOne, alt: 'Accueil image 6' },
  { type: 'image', src: imTwo, alt: 'Accueil image 7' },
  { type: 'image', src: imThree, alt: 'Accueil image 8' },
  { type: 'image', src: imFour, alt: 'Accueil image 9' },
  { type: 'image', src: imFive, alt: 'Accueil image 10' },
  { type: 'image', src: imSix, alt: 'Accueil image 11' },
  { type: 'image', src: imSeven, alt: 'Accueil image 12' },
  { type: 'image', src: imEight, alt: 'Accueil image 13' },
  { type: 'image', src: imNine, alt: 'Accueil image 14' },
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

const HeroSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [depart, setDepart] = useState('');
  const [voyageurs, setVoyageurs] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (arrivee) params.set('arrivee', arrivee);
    if (depart) params.set('depart', depart);
    if (voyageurs) params.set('voyageurs', String(voyageurs));
    navigate(`/logements?${params.toString()}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.backgroundStack}>
        {HERO_MEDIA.map((media, index) => (
          <div
            key={`${media.src}-${index}`}
            className={styles.backgroundFrame}
            style={{ animationDelay: `${index * 2.4}s` }}
          >
            {renderMedia(media, styles.backgroundMedia)}
          </div>
        ))}
      </div>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <Link to="/" className={styles.backToWelcome}>
          <ArrowLeft size={15} />
          Retour a la page welcome
        </Link>
        <h1 className={styles.title}>Trouvez votre hébergement idéal</h1>
        <p className={styles.subtitle}>
          Réservez des hôtels et villas de qualité pour vos séjours temporaires
        </p>
      </div>

      <div className={styles.searchCard}>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Destination</label>
            <div className={styles.inputWrapper}>
              <MapPin size={16} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Où allez-vous ?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Arrivée</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} className={styles.inputIcon} />
              <input
                type="date"
                className={styles.input}
                value={arrivee}
                onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                onChange={(e) => setArrivee(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Départ</label>
            <div className={styles.inputWrapper}>
              <Calendar size={16} className={styles.inputIcon} />
              <input
                type="date"
                className={styles.input}
                value={depart}
                onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                onChange={(e) => setDepart(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Voyageurs</label>
            <div className={styles.inputWrapper}>
              <Users size={16} className={styles.inputIcon} />
              <input
                type="number"
                className={styles.input}
                min={1}
                max={20}
                value={voyageurs}
                onChange={(e) => setVoyageurs(Number(e.target.value))}
                placeholder="2 voyageurs"
              />
            </div>
          </div>
        </div>

        <button className={styles.searchBtn} onClick={handleSearch}>
          <Search size={18} />
          Rechercher
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
