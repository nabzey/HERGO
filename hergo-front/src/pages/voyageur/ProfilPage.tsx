import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Camera, Check, Eye, EyeOff } from 'lucide-react';
import VoyageurLayout from '../../components/VoyageurLayout';
import { usersApi } from '../../core/api/api';
import styles from './ProfilPage.module.css';

type TabType = 'infos' | 'securite' | 'preferences';

const ProfilPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('infos');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
    pays: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await usersApi.getProfile() as unknown as { user: {
          firstName?: string;
          lastName?: string;
          email?: string;
          phone?: string;
          ville?: string;
          pays?: string;
          bio?: string;
        }};
        const user = response.user;
        setForm({
          prenom: user.firstName || '',
          nom: user.lastName || '',
          email: user.email || '',
          telephone: user.phone || '',
          ville: user.ville || '',
          pays: user.pays || '',
          bio: user.bio || '',
        });
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setError('');
    try {
      if (activeTab === 'securite') {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }
        if (passwordForm.newPassword.length < 8) {
          setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
          return;
        }
        await usersApi.updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        await usersApi.updateProfile({
          firstName: form.prenom,
          lastName: form.nom,
          email: form.email,
          phone: form.telephone,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return (
      <VoyageurLayout>
        <div className={styles.inner}>
          <p>Chargement du profil...</p>
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
        <h1 className={styles.pageTitle}>Mon Profil</h1>
        <p className={styles.pageSubtitle}>Gérez vos informations personnelles et vos préférences</p>

        <div className={styles.layout}>
          {/* Left: Avatar card */}
          <aside className={styles.avatarCard}>
            <div className={styles.avatarWrapper}>
              <img
                src="https://i.pravatar.cc/120?u=amadou"
                alt="Avatar"
                className={styles.avatar}
              />
              <button className={styles.avatarEdit} title="Changer la photo">
                <Camera size={14} />
              </button>
            </div>
            <p className={styles.avatarName}>{form.prenom} {form.nom}</p>
            <p className={styles.avatarEmail}>{form.email}</p>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>5</span>
                <span className={styles.statLbl}>Réservations</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>3</span>
                <span className={styles.statLbl}>Avis laissés</span>
              </div>
            </div>
          </aside>

          {/* Right: Tabs + form */}
          <div className={styles.formSection}>
            <div className={styles.tabs}>
              {([
                ['infos', 'Informations'],
                ['securite', 'Sécurité'],
                ['preferences', 'Préférences'],
              ] as [TabType, string][]).map(([key, label]) => (
                <button
                  key={key}
                  className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.formBody}>
              {activeTab === 'infos' && (
                <>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Prénom</label>
                      <div className={styles.inputWrap}>
                        <User size={15} className={styles.inputIcon} />
                        <input className={styles.input} value={form.prenom} onChange={(e) => handleChange('prenom', e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Nom</label>
                      <div className={styles.inputWrap}>
                        <User size={15} className={styles.inputIcon} />
                        <input className={styles.input} value={form.nom} onChange={(e) => handleChange('nom', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Adresse e-mail</label>
                    <div className={styles.inputWrap}>
                      <Mail size={15} className={styles.inputIcon} />
                      <input className={styles.input} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Téléphone</label>
                    <div className={styles.inputWrap}>
                      <Phone size={15} className={styles.inputIcon} />
                      <input className={styles.input} value={form.telephone} onChange={(e) => handleChange('telephone', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Ville</label>
                      <div className={styles.inputWrap}>
                        <MapPin size={15} className={styles.inputIcon} />
                        <input className={styles.input} value={form.ville} onChange={(e) => handleChange('ville', e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Pays</label>
                      <div className={styles.inputWrap}>
                        <MapPin size={15} className={styles.inputIcon} />
                        <input className={styles.input} value={form.pays} onChange={(e) => handleChange('pays', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Biographie</label>
                    <textarea className={styles.textarea} value={form.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={3} />
                  </div>
                </>
              )}

              {activeTab === 'securite' && (
                <>
                  <p className={styles.secHint}>Pour changer votre mot de passe, renseignez l'ancien puis le nouveau.</p>
                  <div className={styles.field}>
                    <label className={styles.label}>Mot de passe actuel</label>
                    <div className={styles.inputWrap}>
                      <Lock size={15} className={styles.inputIcon} />
                      <input 
                        type={showPasswords.current ? 'text' : 'password'} 
                        className={styles.input} 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                      >
                        {showPasswords.current ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Nouveau mot de passe</label>
                    <div className={styles.inputWrap}>
                      <Lock size={15} className={styles.inputIcon} />
                      <input 
                        type={showPasswords.new ? 'text' : 'password'} 
                        className={styles.input} 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                      >
                        {showPasswords.new ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Confirmer le mot de passe</label>
                    <div className={styles.inputWrap}>
                      <Lock size={15} className={styles.inputIcon} />
                      <input 
                        type={showPasswords.confirm ? 'text' : 'password'} 
                        className={styles.input} 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'preferences' && (
                <div className={styles.prefList}>
                  {[
                    { label: 'Recevoir les offres par e-mail', defaultOn: true },
                    { label: 'Notifications de réservation', defaultOn: true },
                    { label: 'Rappels de départ', defaultOn: false },
                    { label: 'Newsletter mensuelle', defaultOn: false },
                  ].map(({ label, defaultOn }) => (
                    <div key={label} className={styles.prefItem}>
                      <span className={styles.prefLabel}>{label}</span>
                      <label className={styles.toggle}>
                        <input type="checkbox" defaultChecked={defaultOn} className={styles.toggleInput} />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.formActions}>
                <button className={styles.saveBtn} onClick={handleSave}>
                  {saved ? <><Check size={15} /> Enregistré !</> : 'Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VoyageurLayout>
  );
};

export default ProfilPage;
