import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Lock, Camera, Check, Eye, EyeOff, FileText, LayoutGrid, Home, Plus, ClipboardList } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { usersApi, logementsApi, reservationsApi } from '../../core/api/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import styles from '../voyageur/ProfilPage.module.css';
import dStyles from '../../components/DashboardLayout.module.css';

type TabType = 'infos' | 'securite' | 'preferences';

const HOTE_LINKS = [
  { label: 'Tableau de bord', href: '/hote/dashboard', icon: <LayoutGrid size={16} /> },
  { label: 'Mon profil', href: '/hote/profil', icon: <User size={16} /> },
  { label: 'Mes logements', href: '/hote/mes-logements', icon: <Home size={16} /> },
  { label: 'Ajouter un logement', href: '/hote/ajouter', icon: <Plus size={16} /> },
  { label: 'Réservations reçues', href: '/hote/reservations', icon: <ClipboardList size={16} /> },
];

const HoteProfilPage = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('infos');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    avatar: '',
  });
  const [logementCount, setLogementCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await usersApi.getProfile() as { user: {
          firstName?: string; lastName?: string; email?: string; phone?: string;
          ville?: string; pays?: string; bio?: string; avatar?: string;
        }};
        const u = response.user;
        setForm({
          prenom: u.firstName || '',
          nom: u.lastName || '',
          email: u.email || '',
          telephone: u.phone || '',
          ville: u.ville || '',
          pays: u.pays || '',
          bio: u.bio || '',
          avatar: u.avatar || '',
        });
      } catch (err: unknown) {
        toast.error((err as Error).message || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const [logements, reservations] = await Promise.all([
          logementsApi.getAll(),
          reservationsApi.getAll(),
        ]);
        setLogementCount(logements.length);
        setReservationCount(reservations.length);
      } catch { /* non critique */ }
    };

    fetchProfile();
    fetchStats();
  }, []);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 5 Mo)');
      return;
    }
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const result = await usersApi.uploadAvatar(formData);
      setForm(prev => ({ ...prev, avatar: result.avatarUrl }));
      toast.success('Photo de profil mise à jour !');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erreur lors du téléversement');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === 'securite') {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }
        if (passwordForm.newPassword.length < 8) {
          toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
          return;
        }
        await usersApi.updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Mot de passe mis à jour !');
      } else if (activeTab === 'infos') {
        await usersApi.updateProfile({
          firstName: form.prenom,
          lastName: form.nom,
          email: form.email,
          phone: form.telephone,
          ville: form.ville,
          pays: form.pays,
          bio: form.bio,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        toast.success('Profil mis à jour !');
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const userName = authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Hôte';
  const avatarSrc = form.avatar || authUser?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.prenom + ' ' + form.nom)}&background=c9a570&color=fff&size=120`;

  if (loading) {
    return (
      <DashboardLayout links={HOTE_LINKS} role="hote" userName={userName}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--color-text-gray)' }}>
          Chargement du profil...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={HOTE_LINKS} role="hote" userName={userName} userAvatar={avatarSrc}>
      <div className={dStyles.pageHeader}>
        <h1 className={dStyles.pageTitle}>Mon Profil</h1>
        <p className={dStyles.pageSubtitle}>Gérez vos informations en tant qu'hôte</p>
      </div>

      <div className={styles.layout}>
        {/* Left: Avatar card */}
        <aside className={styles.avatarCard}>
          <div className={styles.avatarWrapper}>
            <img
              src={avatarSrc}
              alt="Avatar"
              className={styles.avatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.prenom)}&background=c9a570&color=fff`;
              }}
            />
            <button
              className={styles.avatarEdit}
              title="Changer la photo"
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <span style={{ fontSize: '10px' }}>…</span> : <Camera size={14} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <p className={styles.avatarName}>{form.prenom} {form.nom}</p>
          <p className={styles.avatarEmail}>{form.email}</p>
          {(form.ville || form.pays) && (
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-gray)', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <MapPin size={12} />
              {[form.ville, form.pays].filter(Boolean).join(', ')}
            </p>
          )}

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{logementCount}</span>
              <span className={styles.statLbl}>Logements</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{reservationCount}</span>
              <span className={styles.statLbl}>Réservations</span>
            </div>
          </div>
        </aside>

        {/* Right: Tabs + form */}
        <div className={styles.formSection}>
          <div className={styles.tabs}>
            {([
              ['infos', t('profil.infos')],
              ['securite', t('profil.securite')],
              ['preferences', t('profil.preferences')],
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
                    <label className={styles.label}>{t('profil.prenom')}</label>
                    <div className={styles.inputWrap}>
                      <User size={15} className={styles.inputIcon} />
                      <input className={styles.input} value={form.prenom} onChange={(e) => handleChange('prenom', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>{t('profil.nom')}</label>
                    <div className={styles.inputWrap}>
                      <User size={15} className={styles.inputIcon} />
                      <input className={styles.input} value={form.nom} onChange={(e) => handleChange('nom', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{t('profil.email')}</label>
                  <div className={styles.inputWrap}>
                    <Mail size={15} className={styles.inputIcon} />
                    <input className={styles.input} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{t('profil.telephone')}</label>
                  <div className={styles.inputWrap}>
                    <Phone size={15} className={styles.inputIcon} />
                    <input className={styles.input} value={form.telephone} onChange={(e) => handleChange('telephone', e.target.value)} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>{t('profil.ville')}</label>
                    <div className={styles.inputWrap}>
                      <MapPin size={15} className={styles.inputIcon} />
                      <input className={styles.input} value={form.ville} onChange={(e) => handleChange('ville', e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>{t('profil.pays')}</label>
                    <div className={styles.inputWrap}>
                      <MapPin size={15} className={styles.inputIcon} />
                      <input className={styles.input} value={form.pays} onChange={(e) => handleChange('pays', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{t('profil.bio')}</label>
                  <div className={styles.inputWrap} style={{ alignItems: 'flex-start' }}>
                    <FileText size={15} className={styles.inputIcon} style={{ marginTop: '3px' }} />
                    <textarea
                      className={styles.textarea}
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={3}
                      style={{ paddingLeft: 0 }}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'securite' && (
              <>
                <p className={styles.secHint}>{t('profil.hint_securite')}</p>
                {[
                  { key: 'current', label: t('profil.mot_passe_actuel'), field: 'currentPassword' },
                  { key: 'new', label: t('profil.nouveau_mot_passe'), field: 'newPassword' },
                  { key: 'confirm', label: t('profil.confirmer_mot_passe'), field: 'confirmPassword' },
                ].map(({ key, label, field }) => (
                  <div className={styles.field} key={key}>
                    <label className={styles.label}>{label}</label>
                    <div className={styles.inputWrap}>
                      <Lock size={15} className={styles.inputIcon} />
                      <input
                        type={showPasswords[key as keyof typeof showPasswords] ? 'text' : 'password'}
                        className={styles.input}
                        value={passwordForm[field as keyof typeof passwordForm]}
                        onChange={(e) => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPasswords(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                      >
                        {showPasswords[key as keyof typeof showPasswords] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'preferences' && (
              <div className={styles.prefList}>
                {[
                  { label: 'Notifications de nouvelle réservation', defaultOn: true },
                  { label: 'Rappels de check-in', defaultOn: true },
                  { label: 'Rapports hebdomadaires', defaultOn: false },
                  { label: 'Newsletter hôte', defaultOn: false },
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
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saved ? <><Check size={15} /> {t('profil.enregistre')}</> : saving ? 'Sauvegarde...' : t('profil.sauvegarder')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HoteProfilPage;
