import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import VoyageurLayout from '../../components/VoyageurLayout';
import { favorisApi } from '../../core/api/api';
import styles from './FavorisPage.module.css';

interface Favori {
  id: number;
  idLogement: number;
  logementId: number;
  titre: string;
  ville: string;
  pays: string;
  prixJour: number;
  imageUrl: string;
}

const FavorisPage = () => {
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const data = await favorisApi.getAll() as Favori[];
        setFavoris(data || []);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des favoris');
      } finally {
        setLoading(false);
      }
    };
    fetchFavoris();
  }, []);

  const handleRemove = async (idLogement: number) => {
    try {
      await favorisApi.remove(idLogement);
      setFavoris(favoris.filter(f => f.idLogement !== idLogement));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <VoyageurLayout>
        <div className={styles.inner}>
          <p>Chargement des favoris...</p>
        </div>
      </VoyageurLayout>
    );
  }

  return (
    <VoyageurLayout>
      <div className={styles.inner}>
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
        
        <div className={styles.header}>
          <Link to="/dashboard" className={styles.backLink}>
            ← Retour au dashboard
          </Link>
          <h1 className={styles.title}>Mes Favoris</h1>
          <p className={styles.subtitle}>
            {favoris.length} logement{favoris.length !== 1 ? 's' : ''} sauvegardé{favoris.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favoris.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Aucun favori pour le moment</p>
            <Link to="/logements" className={styles.emptyBtn}>
              Découvrir les hébergements
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favoris.map((fav) => (
              <div key={fav.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <img 
                    src={fav.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400'} 
                    alt={fav.titre} 
                    className={styles.img}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{fav.titre}</h3>
                  <p className={styles.cardLocation}>
                    <MapPin size={14} /> {fav.ville}, {fav.pays}
                  </p>
                  <p className={styles.cardPrice}>
                    {fav.prixJour?.toLocaleString('fr-FR')} FCFA / nuit
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <Link to={`/logements/${fav.idLogement}`} className={styles.viewBtn}>
                    Voir
                  </Link>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => handleRemove(fav.idLogement)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VoyageurLayout>
  );
};

export default FavorisPage;
