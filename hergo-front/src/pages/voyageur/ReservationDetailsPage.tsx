import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  CalendarDays, MapPin, Users, CreditCard, CheckCircle, XCircle, ChevronLeft,
  Phone, Mail, Clock, FileText
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { reservationsApi } from '../../core/api/api';
import hostImg from '../../assets/im7.jpeg';
import styles from './ReservationDetailsPage.module.css';

interface Reservation {
  id: number;
  idVoyageur: number;
  idLogement: number;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  prixTotal: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  titre: string;
  ville: string;
  pays: string;
}

const ReservationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!id) return;
        const response = await reservationsApi.getById(id) as unknown as { reservation: Reservation };
        setReservation(response.reservation);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement de la réservation');
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  const handleCancel = async () => {
    if (!reservation) return;
    setIsCanceling(true);
    try {
      await reservationsApi.cancel(reservation.id);
      setReservation({ ...reservation, statut: 'ANNULE' });
      setShowCancelConfirm(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de l\'annulation');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleModify = () => {
    if (!reservation) return;
    navigate(`/reservation/${reservation.idLogement}`, { state: { reservation } });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <p>Chargement de la réservation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <p style={{ color: 'red' }}>{error || 'Réservation non trouvée'}</p>
        </div>
        <Footer />
      </div>
    );
  }

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
            reservation.statut === 'CONFIRME' ? styles.badgeGreen :
            reservation.statut === 'EN_ATTENTE' ? styles.badgeYellow : styles.badgeRed
          }`}>
            {reservation.statut === 'CONFIRME' ? <CheckCircle size={14} /> :
             reservation.statut === 'ANNULE' ? <XCircle size={14} /> : <Clock size={14} />}
            {reservation.statut === 'CONFIRME' ? 'confirmée' : reservation.statut === 'ANNULE' ? 'annulée' : 'en attente'}
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
                <img src="/placeholder.jpg" alt={reservation.titre} className={styles.logementImage} />
                <div className={styles.logementInfo}>
                  <h3 className={styles.logementName}>{reservation.titre}</h3>
                  <p className={styles.logementLocation}>
                    <MapPin size={14} /> {reservation.ville}, {reservation.pays}
                  </p>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}><CalendarDays size={14} /> Dates</span>
                  <div className={styles.detailValue}>
                    <div>Arrivée: <strong>{new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</strong></div>
                    <div>Départ: <strong>{new Date(reservation.dateFin).toLocaleDateString('fr-FR')}</strong></div>
                    <div>{Math.ceil((new Date(reservation.dateFin).getTime() - new Date(reservation.dateDebut).getTime()) / (1000 * 60 * 60 * 24))} nuits</div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}><Users size={14} /> Voyageurs</span>
                  <span className={styles.detailValue}>{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}><FileText size={14} /> Type de chambre</span>
                  <span className={styles.detailValue}>Chambre standard</span>
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
                  <span>Prix total</span>
                  <span>{reservation.prixTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className={styles.paymentTotal}>
                  <span>Total</span>
                  <span>{reservation.prixTotal.toLocaleString('fr-FR')} FCFA</span>
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
                {reservation.statut === 'CONFIRME' && (
                  <>
                    <button className={styles.modifyBtn} onClick={handleModify}>Modifier la réservation</button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Annuler la réservation
                    </button>
                  </>
                )}
                
                {reservation.statut === 'EN_ATTENTE' && (
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
