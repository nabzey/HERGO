import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { reclamationsApi } from '../../core/api/api';
import styles from './ReclamationsPage.module.css';

interface Reclamation {
  id: number;
  sujet: string;
  description: string;
  date: string;
  status: string;
  reponse?: string;
}

const ReclamationsPage = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ sujet: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const data = await reclamationsApi.getMyReclamations() as Reclamation[];
        setReclamations(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des réclamations');
      } finally {
        setLoading(false);
      }
    };
    fetchReclamations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const newReclamation = await reclamationsApi.create(formData) as Reclamation;
      setReclamations([newReclamation, ...reclamations]);
      setFormData({ sujet: '', description: '' });
      setShowForm(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la création de la réclamation');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en attente':
        return <Clock size={16} className={styles.statusPending} />;
      case 'traitée':
        return <CheckCircle size={16} className={styles.statusResolved} />;
      case 'rejetée':
        return <XCircle size={16} className={styles.statusRejected} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en attente':
        return 'En attente';
      case 'traitée':
        return 'Traitée';
      case 'rejetée':
        return 'Rejetée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <p>Chargement des réclamations...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link to="/" className={styles.backLink}>
            <ChevronLeft size={14} /> Retour à l'accueil
          </Link>
          <h1 className={styles.title}>Mes Réclamations</h1>
          <button 
            className={styles.newBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Annuler' : 'Nouvelle réclamation'}
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="sujet" className={styles.label}>Sujet</label>
              <input
                id="sujet"
                type="text"
                className={styles.input}
                value={formData.sujet}
                onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                required
                placeholder="Décrivez brièvement votre problème"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description</label>
              <textarea
                id="description"
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={5}
                placeholder="Décrivez votre problème en détail..."
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Envoi en cours...' : 'Envoyer la réclamation'}
            </button>
          </form>
        )}

        <div className={styles.list}>
          {reclamations.length === 0 ? (
            <div className={styles.empty}>
              <AlertCircle size={48} className={styles.emptyIcon} />
              <h3>Aucune réclamation</h3>
              <p>Vous n'avez pas encore soumis de réclamation.</p>
            </div>
          ) : (
            reclamations.map((rec) => (
              <div key={rec.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{rec.sujet}</h3>
                  <span className={`${styles.status} ${styles[`status${rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}`]}`}>
                    {getStatusIcon(rec.status)}
                    {getStatusLabel(rec.status)}
                  </span>
                </div>
                <p className={styles.cardDescription}>{rec.description}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{rec.date}</span>
                </div>
                {rec.reponse && (
                  <div className={styles.response}>
                    <strong>Réponse :</strong>
                    <p>{rec.reponse}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReclamationsPage;