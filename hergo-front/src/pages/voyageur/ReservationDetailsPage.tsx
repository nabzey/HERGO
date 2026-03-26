import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays, MapPin, Users, CreditCard, CheckCircle, XCircle, ChevronLeft,
  Phone, Mail, Clock, FileText
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mockReservations } from '../../data/adminMockData';
import hostImg from '../../assets/im7.jpeg';
import type { Reservation } from '../../data/adminMockData';
import styles from './ReservationDetailsPage.module.css';

const ReservationDetailsPage = () => {
  const [reservation] = useState<Reservation>(mockReservations[0]);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = () => {
    setIsCanceling(true);
    setTimeout(() => {
      setIsCanceling(false);
      setShowCancelConfirm(false);
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadLink}><ChevronLeft size={14} /> Accueil</Link>
          <span className={styles.breadSep}>/</span>
          <Link to="/mes-reservations" className={styles.breadLink}>Mes Réservations</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>Détails</span>
        </div>

        <h1 className={styles.pageTitle}>Détails de la Réservation</h1>
        
        {/* Status Badge */}
        <div className={styles.statusHeader}>
          <div className={`${styles.statusBadge} ${
            reservation.status === 'confirmée' ? styles.badgeGreen :
            reservation.status === 'en attente' ? styles.badgeYellow : styles.badgeRed
          }`}>
            {reservation.status === 'confirmée' ? <CheckCircle size={14} /> :
             reservation.status === 'annulée' ? <XCircle size={14} /> : <Clock size={14} />}
            {reservation.status}
          </div>
          <span className={styles.reservationNumber}>Numéro de réservation: #HRG-{reservation.id.toString().padStart(6, '0')}</span>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Left Column: Logement Info */}
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Hébergement</h2>
              
              <div className={styles.logementHeader}>
                <img src={reservation.image} alt={reservation.villaName} className={styles.logementImage} />
                <div className={styles.logementInfo}>
                  <h3 className={styles.logementName}>{reservation.villaName}</h3>
                  <p className={styles.logementLocation}>
                    <MapPin size={14} /> {reservation.location}
                  </p>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}><CalendarDays size={14} /> Dates</span>
                  <div className={styles.detailValue}>
                    <div>Arrivée: <strong>{reservation.dateArrivee}</strong></div>
                    <div>Départ: <strong>{reservation.dateDepart}</strong></div>
                    <div>{reservation.nuits} nuits</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}><Users size={14} /> Voyageurs</span>
                  <span className={styles.detailValue}>2 adultes, 1 enfant</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}><FileText size={14} /> Type de chambre</span>
                  <span className={styles.detailValue}>Chambre double deluxe avec vue sur mer</span>
                </div>
              </div>

              <hr className={styles.separator} />

              <div className={styles.hostSection}>
                <h3 className={styles.subtitle}>Contact hôte</h3>
                <div className={styles.hostInfo}>
                  <img src={hostImg} alt="Hôte" className={styles.hostAvatar} />
                  <div>
                    <div className={styles.hostName}>Fatou Seck</div>
                    <div className={styles.hostContact}>
                      <span><Phone size={12} /> +221 77 800 00 00</span>
                      <span><Mail size={12} /> fatou.seck@hergo.sn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Conditions d'annulation</h2>
              <div className={styles.cancellationPolicy}>
                <div className={styles.policyItem}>
                  <strong>Annulation gratuite</strong> jusqu'à 7 jours avant l'arrivée
                </div>
                <div className={styles.policyItem}>
                  <strong>Annulation partielle</strong> entre 3 et 6 jours avant l'arrivée (50% du montant)
                </div>
                <div className={styles.policyItem}>
                  <strong>Annulation non remboursable</strong> moins de 3 jours avant l'arrivée
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Actions */}
          <div className={styles.rightCol}>
            <div className={styles.paymentCard}>
              <h2 className={styles.sectionTitle}>Paiement</h2>
              
              <div className={styles.paymentSummary}>
                <div className={styles.paymentRow}>
                  <span>Prix par nuit</span>
                  <span>300 000 FCFA</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>× {reservation.nuits} nuits</span>
                  <span>2 100 000 FCFA</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Frais de service</span>
                  <span>150 000 FCFA</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Frais de taxe</span>
                  <span>105 000 FCFA</span>
                </div>
                <div className={styles.paymentTotal}>
                  <span>Total</span>
                  <span>{reservation.montant}</span>
                </div>
              </div>

              <div className={styles.paymentMethod}>
                <div className={styles.methodRow}>
                  <CreditCard size={16} />
                  <span>Paiement par carte bancaire</span>
                </div>
                <div className={styles.cardNumber}>•••• •••• •••• 4242</div>
              </div>

              <div className={styles.actionButtons}>
                {reservation.status === 'confirmée' && (
                  <>
                    <button className={styles.modifyBtn}>Modifier la réservation</button>
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Annuler la réservation
                    </button>
                  </>
                )}
                
                {reservation.status === 'en attente' && (
                  <button className={styles.confirmBtn}>Confirmer la réservation</button>
                )}
              </div>
            </div>

            <div className={styles.helpCard}>
              <h3 className={styles.helpTitle}>Besoin d'aide ?</h3>
              <p className={styles.helpText}>
                Notre équipe est disponible 24/7 pour vous aider avec votre réservation.
              </p>
              <button className={styles.helpBtn}>Contacter le support</button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirmer l'annulation</h3>
            <p className={styles.modalText}>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancel}
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCanceling}
              >
                Retour
              </button>
              <button 
                className={styles.modalConfirm}
                onClick={handleCancel}
                disabled={isCanceling}
              >
                {isCanceling ? 'Annulation...' : 'Confirmer l\'annulation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReservationDetailsPage;