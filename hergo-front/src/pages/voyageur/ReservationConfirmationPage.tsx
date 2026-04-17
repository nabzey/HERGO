import { Link } from "react-router-dom";
import {
  CheckCircle, CalendarDays, MapPin, CreditCard, ArrowLeft, Home
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './ReservationConfirmationPage.module.css';

const ReservationConfirmationPage = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={14} /> Retour à l'accueil
          </Link>
        </div>

        {/* Confirmation Card */}
        <div className={styles.confirmationCard}>
          <div className={styles.iconWrapper}>
            <CheckCircle size={80} className={styles.confirmIcon} />
          </div>
          
          <h1 className={styles.title}>Réservation confirmée !</h1>
          <p className={styles.subtitle}>
            Merci pour votre confiance. Votre réservation a été validée avec succès.
          </p>

          <div className={styles.reservationInfo}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Numéro de réservation</div>
              <div className={styles.infoValue}>HRG-000001</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Hébergement</div>
              <div className={styles.infoValue}>Villa Sunset Paradise</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Dates</div>
              <div className={styles.infoValue}>
                <CalendarDays size={12} /> 15 Mar 2026 → 22 Mar 2026
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Localisation</div>
              <div className={styles.infoValue}>
                <MapPin size={12} /> Dakar, Sénégal
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Paiement</div>
              <div className={styles.infoValue}>
                <CreditCard size={12} /> Carte bancaire •••• 4242
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Montant total</div>
              <div className={styles.infoValue}>2 100 000 FCFA</div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link to="/mes-reservations/1" className={styles.primaryBtn}>
              Voir ma réservation
            </Link>
            <Link to="/" className={styles.secondaryBtn}>
              <Home size={16} /> Continuer à naviguer
            </Link>
          </div>

          <div className={styles.emailNotice}>
            <div className={styles.emailIcon}>📧</div>
            <div className={styles.emailText}>
              <strong>Email de confirmation envoyé</strong><br />
              Vérifiez votre boîte mail (amadou.diallo@gmail.com) pour les détails complets.
            </div>
          </div>
        </div>

        {/* Informations Complémentaires */}
        <div className={styles.additionalInfo}>
          <h3 className={styles.infoTitle}>Informations importantes</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <strong>Check-in:</strong> À partir de 14h00
            </div>
            <div className={styles.infoItem}>
              <strong>Check-out:</strong> Jusqu'à 11h00
            </div>
            <div className={styles.infoItem}>
              <strong>Contact hôte:</strong> Fatou Seck (+221 77 800 00 00)
            </div>
            <div className={styles.infoItem}>
              <strong>Política d'annulation:</strong> Annulation gratuite jusqu'à 7 jours avant l'arrivée
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationConfirmationPage;
