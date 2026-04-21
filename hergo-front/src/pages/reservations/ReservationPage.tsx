import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  User, Mail, Phone, Users, CalendarDays, MapPin, Star,
  Utensils, Car, Plane, Lock, Shield,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { logementsApi, reservationsApi, paymentsApi } from '../../core/api/api';
import styles from './ReservationPage.module.css';

interface Logement {
  id: number;
  titre: string;
  type: string;
  ville: string;
  pays: string;
  adresse: string;
  description: string;
  prixJour: number;
  chambres: number;
  capacite: number;
  equipements: string[];
  images: string[];
  note: number;
  idProprietaire: number;
  statut: string;
}

const ReservationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    adultes: 2,
    enfants: 0,
  });

  const [options, setOptions] = useState({
    petitDej: false,
    parking: false,
    transfert: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wave' | 'orange' | 'arrival'>('arrival');

  // Récupérer les dates depuis le state de la page précédente ou utiliser des dates par défaut
  const state = location.state as { dateArrivee?: string; dateDepart?: string; reservation?: any } | null;
  const dateArrivee = state?.dateArrivee || new Date().toISOString().split('T')[0];
  const dateDepart = state?.dateDepart || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Calculer le nombre de nuits
  const dateDebut = new Date(dateArrivee);
  const dateFin = new Date(dateDepart);
  const nuits = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));

  const PRIX_PETIT_DEJ = 15000; // par nuit
  const PRIX_PARKING = 25000;   // par nuit
  const PRIX_TRANSFERT = 50000; // fixe

  useEffect(() => {
    const fetchLogement = async () => {
      try {
        if (!id) return;
        const response = await logementsApi.getById(id) as unknown as { logement: Logement };
        setLogement(response.logement);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement du logement');
      } finally {
        setLoading(false);
      }
    };
    fetchLogement();
  }, [id]);

  const prixBase = logement ? logement.prixJour * nuits : 0;
  const prixPetitDej = options.petitDej ? PRIX_PETIT_DEJ * nuits : 0;
  const prixParking = options.parking ? PRIX_PARKING * nuits : 0;
  const prixTransfert = options.transfert ? PRIX_TRANSFERT : 0;
  const fraisService = 150000;
  const total = prixBase + prixPetitDej + prixParking + prixTransfert + fraisService;

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCounter = (field: 'adultes' | 'enfants', delta: number) =>
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(field === 'adultes' ? 1 : 0, prev[field] + delta),
    }));

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logement) return;
    
    setError('');
    setLoading(true);
    
    try {
      const nombrePersonnes = form.adultes + form.enfants;
      const res = await reservationsApi.create({
        idLogement: logement.id,
        dateDebut: dateArrivee,
        dateFin: dateDepart,
        nombrePersonnes,
      }) as { id: number };
      
      const reservationId = res.id;

      if (paymentMethod === 'card') {
        // Stripe - On redirige vers une simulation de succès pour l'instant
        // ou on pourrait appeler createIntent si Stripe était configuré
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate(`/mes-reservations/${reservationId}`);
      } else if (paymentMethod === 'arrival') {
        // Ne pas appeler le paiement, la réservation reste EN_ATTENTE
        navigate(`/mes-reservations/${reservationId}`);
      } else {
        // Wave ou Orange Money Simulation
        const method = paymentMethod === 'wave' ? 'WAVE' : 'ORANGE_MONEY';
        const phoneNumber = form.telephone || '770000000';
        
        await paymentsApi.simulateMobileMoney({
          reservationId,
          amount: total,
          method,
          phoneNumber
        });
        
        navigate(`/mes-reservations/${reservationId}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('fr-FR');

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <p>Chargement du logement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !logement) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <p style={{ color: 'red' }}>{error || 'Logement non trouvé'}</p>
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
          <Link to="/" className={styles.breadLink}>Accueil</Link>
          <span className={styles.breadSep}>/</span>
          <Link to="/logements" className={styles.breadLink}>Logements</Link>
          <span className={styles.breadSep}>/</span>
          <Link to={`/logements/${logement.id}`} className={styles.breadLink}>{logement.titre}</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>Réservation</span>
        </div>

        <h1 className={styles.pageTitle}>Finaliser votre réservation</h1>
        <p className={styles.pageSubtitle}>
          Complétez vos informations pour confirmer votre séjour
        </p>

        <form onSubmit={handleReserve}>
          <div className={styles.layout}>
            {/* ─── LEFT COLUMN ─── */}
            <div className={styles.formCol}>

              {/* Infos client */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <User size={18} className={styles.sectionTitleIcon} />
                  Informations du client
                </h2>

                <div className={styles.field}>
                  <label className={styles.label}>Nom complet</label>
                  <div className={styles.inputWrap}>
                    <User size={15} className={styles.inputIcon} />
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="ex : Amadou Diallo"
                      value={form.nom}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Adresse e-mail</label>
                    <div className={styles.inputWrap}>
                      <Mail size={15} className={styles.inputIcon} />
                      <input
                        className={styles.input}
                        type="email"
                        placeholder="amadou@email.com"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.field} style={{ marginBottom: 0 }}>
                    <label className={styles.label}>Téléphone</label>
                    <div className={styles.inputWrap}>
                      <Phone size={15} className={styles.inputIcon} />
                      <input
                        className={styles.input}
                        type="tel"
                        placeholder="+221 77 000 00 00"
                        value={form.telephone}
                        onChange={(e) => handleChange('telephone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.guestsRow} style={{ marginTop: '1rem' }}>
                  {/* Adultes */}
                  <div className={styles.guestField}>
                    <label className={styles.label}>
                      <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Adultes
                    </label>
                    <div className={styles.counterWrap}>
                      <button type="button" className={styles.counterBtn} onClick={() => handleCounter('adultes', -1)}>−</button>
                      <span className={styles.counterVal}>{form.adultes}</span>
                      <button type="button" className={styles.counterBtn} onClick={() => handleCounter('adultes', 1)}>+</button>
                    </div>
                  </div>
                  {/* Enfants */}
                  <div className={styles.guestField}>
                    <label className={styles.label}>Enfants</label>
                    <div className={styles.counterWrap}>
                      <button type="button" className={styles.counterBtn} onClick={() => handleCounter('enfants', -1)}>−</button>
                      <span className={styles.counterVal}>{form.enfants}</span>
                      <button type="button" className={styles.counterBtn} onClick={() => handleCounter('enfants', 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Options spéciales */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Star size={18} className={styles.sectionTitleIcon} />
                  Options proposées par l'hôte
                </h2>

                <div className={styles.optionsList}>
                  {/* Petit-déjeuner */}
                  <div className={styles.optionItem}>
                    <div className={styles.optionLeft}>
                      <span className={styles.optionLabel}>
                        <Utensils size={14} className={styles.optionLabelIcon} />
                        Petit-déjeuner
                      </span>
                      <span className={styles.optionDesc}>Buffet continental inclus pour tous les voyageurs</span>
                      <span className={styles.optionPrice}>+{fmt(PRIX_PETIT_DEJ)} FCFA / nuit</span>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={options.petitDej}
                        onChange={() => setOptions((p) => ({ ...p, petitDej: !p.petitDej }))}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>

                  {/* Parking */}
                  <div className={styles.optionItem}>
                    <div className={styles.optionLeft}>
                      <span className={styles.optionLabel}>
                        <Car size={14} className={styles.optionLabelIcon} />
                        Parking privé sécurisé
                      </span>
                      <span className={styles.optionDesc}>Parking fermé avec surveillance 24h/24</span>
                      <span className={styles.optionPrice}>+{fmt(PRIX_PARKING)} FCFA / nuit</span>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={options.parking}
                        onChange={() => setOptions((p) => ({ ...p, parking: !p.parking }))}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>

                  {/* Transfert aéroport */}
                  <div className={styles.optionItem}>
                    <div className={styles.optionLeft}>
                      <span className={styles.optionLabel}>
                        <Plane size={14} className={styles.optionLabelIcon} />
                        Transfert aéroport
                      </span>
                      <span className={styles.optionDesc}>Navette aller-retour entre l'aéroport et la villa</span>
                      <span className={styles.optionPrice}>+{fmt(PRIX_TRANSFERT)} FCFA (forfait)</span>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={options.transfert}
                        onChange={() => setOptions((p) => ({ ...p, transfert: !p.transfert }))}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Conditions d'annulation */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Shield size={18} className={styles.sectionTitleIcon} />
                  Conditions d'annulation
                </h2>

                <div className={styles.policyList}>
                  <div className={styles.policyItem}>
                    <span className={`${styles.policyDot}`} />
                    <span className={styles.policyText}>
                      <strong>Remboursement flexible :</strong> Le voyageur peut être remboursé intégralement s'il souhaite annuler sa réservation.
                    </span>
                  </div>
                  <div className={styles.policyItem}>
                    <span className={`${styles.policyDot} ${styles.policyDotGray}`} />
                    <span className={styles.policyText}>
                      <strong>Options de paiement :</strong> Vous avez la possibilité de payer un acompte, de régler la totalité au moment de la réservation, ou de payer directement à l'arrivée.
                    </span>
                  </div>
                </div>
              </div>
{/* Métode de paiement */}
<div className={styles.section}>
  <h2 className={styles.sectionTitle}>
    <Lock size={18} className={styles.sectionTitleIcon} />
    Moyen de paiement
  </h2>

  <div className={styles.paymentMethods}>
    <div
      className={`${styles.paymentMethod} ${
        paymentMethod === 'card' ? styles.paymentMethodActive : ''
      }`}
      onClick={() => setPaymentMethod('card')}
    >
      <div className={styles.paymentIcon}>💳</div>
      <div className={styles.paymentInfo}>
        <h4 className={styles.paymentTitle}>Carte bancaire</h4>
        <p className={styles.paymentDesc}>Paiement sécurisé par carte bancaire</p>
      </div>
    </div>

    <div
      className={`${styles.paymentMethod} ${
        paymentMethod === 'wave' ? styles.paymentMethodActive : ''
      }`}
      onClick={() => setPaymentMethod('wave')}
    >
      <div className={styles.paymentIcon}></div>
      <div className={styles.paymentInfo}>
        <h4 className={styles.paymentTitle}>Wave</h4>
        <p className={styles.paymentDesc}>Paiement via Wave (mobile money)</p>
      </div>
    </div>

    <div
      className={`${styles.paymentMethod} ${
        paymentMethod === 'orange' ? styles.paymentMethodActive : ''
      }`}
      onClick={() => setPaymentMethod('orange')}
    >
      <div className={styles.paymentIcon}>📱</div>
      <div className={styles.paymentInfo}>
        <h4 className={styles.paymentTitle}>Orange Money</h4>
        <p className={styles.paymentDesc}>Paiement via Orange Money</p>
      </div>
    </div>

    <div
      className={`${styles.paymentMethod} ${
        paymentMethod === 'arrival' ? styles.paymentMethodActive : ''
      }`}
      onClick={() => setPaymentMethod('arrival')}
    >
      <div className={styles.paymentIcon}>🚪</div>
      <div className={styles.paymentInfo}>
        <h4 className={styles.paymentTitle}>Payer à l'arrivée</h4>
        <p className={styles.paymentDesc}>Réservez maintenant et payez sur place</p>
      </div>
    </div>
  </div>
</div>

{/* Informations de paiement selon le moyen choisi */}
{paymentMethod === 'card' && (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>
      Informations de carte bancaire
    </h3>
    <div className={styles.field}>
      <label className={styles.label}>Numéro de carte</label>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          type="text"
          placeholder="0000 0000 0000 0000"
          required
        />
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label}>Date d'expiration</label>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="text"
            placeholder="MM/AA"
            required
          />
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>CVV</label>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="text"
            placeholder="123"
            required
          />
        </div>
      </div>
    </div>
  </div>
)}

{paymentMethod === 'wave' && (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>
      Numéro Wave
    </h3>
    <div className={styles.field}>
      <div className={styles.inputWrap}>
        <Phone size={15} className={styles.inputIcon} />
        <input
          className={styles.input}
          type="tel"
          placeholder="+221 77 000 00 00"
          required
        />
      </div>
    </div>
  </div>
)}

{paymentMethod === 'orange' && (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>
      Numéro Orange Money
    </h3>
    <div className={styles.field}>
      <div className={styles.inputWrap}>
        <Phone size={15} className={styles.inputIcon} />
        <input
          className={styles.input}
          type="tel"
          placeholder="+221 77 000 00 00"
          required
        />
      </div>
    </div>
  </div>
)}

{/* Actions */}
<div className={styles.actions}>
  <button type="submit" className={styles.btnReserve}>
    <Lock size={16} />
    Réserver maintenant — {fmt(total)} FCFA
  </button>
  <button
    type="button"
    className={styles.btnPayHotel}
    onClick={() => navigate('/reservation/confirmation')}
  >
    Payer à l'hôtel à l'arrivée
  </button>
  <p className={styles.secureNote}>
    <Lock size={12} /> Paiement sécurisé · Données chiffrées
  </p>
</div>
            </div>

            {/* ─── RIGHT COLUMN — Summary ─── */}
            <div className={styles.summaryCol}>
              <div className={styles.summaryCard}>
                <img
                  src={logement.images && logement.images.length > 0 ? (typeof logement.images[0] === 'string' ? logement.images[0] : (logement.images[0] as any).url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400') : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400'}
                  alt={logement.titre}
                  className={styles.summaryImg}
                />

                <div className={styles.summaryBody}>
                  <h3 className={styles.summaryVillaName}>{logement.titre}</h3>
                  <div className={styles.summaryMeta}>
                    <span className={styles.summaryRating}>
                      <Star size={12} fill="currentColor" /> {logement.note || 0}
                    </span>
                    <span>·</span>
                    <MapPin size={12} />
                    {logement.ville}, {logement.pays}
                  </div>

                  {/* Dates */}
                  <div className={styles.summaryDates}>
                    <div className={styles.summaryDateBlock}>
                      <span className={styles.summaryDateLbl}><CalendarDays size={10} style={{ display: 'inline', marginRight: 3 }} />Arrivée</span>
                      <span className={styles.summaryDateVal}>{dateArrivee}</span>
                    </div>
                    <div className={styles.summaryDateBlock}>
                      <span className={styles.summaryDateLbl}><CalendarDays size={10} style={{ display: 'inline', marginRight: 3 }} />Départ</span>
                      <span className={styles.summaryDateVal}>{dateDepart}</span>
                    </div>
                  </div>

                  <div className={styles.summaryGuestsRow}>
                    <Users size={13} />
                    {form.adultes} adulte{form.adultes > 1 ? 's' : ''}
                    {form.enfants > 0 && `, ${form.enfants} enfant${form.enfants > 1 ? 's' : ''}`}
                    &nbsp;·&nbsp;
                    {nuits} nuits
                  </div>

                  <hr className={styles.divider} />

                  {/* Tarif détaillé */}
                  <div className={styles.priceRow}>
                    <span>{fmt(logement.prixJour)} FCFA × {nuits} nuits</span>
                    <span>{fmt(prixBase)} FCFA</span>
                  </div>

                  {options.petitDej && (
                    <div className={styles.priceRow}>
                      <span className={styles.priceRowHighlight}>Petit-déjeuner × {nuits} nuits</span>
                      <span>+{fmt(prixPetitDej)} FCFA</span>
                    </div>
                  )}

                  {options.parking && (
                    <div className={styles.priceRow}>
                      <span className={styles.priceRowHighlight}>Parking × {nuits} nuits</span>
                      <span>+{fmt(prixParking)} FCFA</span>
                    </div>
                  )}

                  {options.transfert && (
                    <div className={styles.priceRow}>
                      <span className={styles.priceRowHighlight}>Transfert aéroport</span>
                      <span>+{fmt(prixTransfert)} FCFA</span>
                    </div>
                  )}

                  <div className={styles.priceRow}>
                    <span>Frais de service</span>
                    <span>{fmt(fraisService)} FCFA</span>
                  </div>

                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span className={styles.totalAmount}>{fmt(total)} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationPage;
