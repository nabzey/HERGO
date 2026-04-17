import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, Bell, Globe, Moon, Shield, HelpCircle
} from 'lucide-react';
import VoyageurLayout from '../../components/VoyageurLayout';
import { settingsApi, usersApi } from '../../core/api/api';
import styles from './SettingsPage.module.css';

type TabType = 'notifications' | 'language' | 'theme' | 'security' | 'about';
type ThemeMode = 'light' | 'dark' | 'auto';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notifications');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reservationNotifications: true,
    departureReminders: false,
    monthlyNewsletter: false,
    language: 'fr',
    currency: 'FCFA',
    theme: 'auto' as ThemeMode,
  });

  const LANGUAGES = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.get() as typeof settings;
        setSettings((prev) => ({
          ...prev,
          ...response,
          theme: (response.theme as ThemeMode) || 'auto',
        }));
      } catch (err) {
        const typedError = err as Error;
        setError(typedError.message || 'Impossible de charger les paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const theme = settings.theme;

    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else if (theme === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else {
      delete document.documentElement.dataset.theme;
    }

    localStorage.setItem('hergoTheme', theme);
    localStorage.setItem('hergoLanguage', settings.language);
  }, [settings.theme, settings.language]);

  const savePreferences = async () => {
    setError('');
    setSuccess('');

    try {
      await settingsApi.update(settings);
      setSuccess('Paramètres enregistrés avec succès.');
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || 'Erreur lors de la sauvegarde des paramètres');
    }
  };

  const savePassword = async () => {
    setError('');
    setSuccess('');

    if (passwordForm.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await usersApi.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Mot de passe mis à jour avec succès.');
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || 'Erreur lors du changement du mot de passe');
    }
  };

  const renderSaveButton = (onClick: () => void, label = 'Enregistrer') => (
    <button
      type="button"
      onClick={onClick}
      className={styles.securityBtn}
      style={{ marginTop: '1rem', minWidth: '160px' }}
    >
      {label}
    </button>
  );

  return (
    <VoyageurLayout>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link to="/profil" className={styles.backLink}>
            <ChevronLeft size={14} /> Retour à mon profil
          </Link>
          <h1 className={styles.title}>Paramètres</h1>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '10px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginBottom: '1rem', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '10px' }}>
            {success}
          </div>
        )}

        <div className={styles.contentLayout}>
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <button className={`${styles.navItem} ${activeTab === 'notifications' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('notifications')}>
                <Bell size={16} />
                Notifications
              </button>
              <button className={`${styles.navItem} ${activeTab === 'language' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('language')}>
                <Globe size={16} />
                Langue
              </button>
              <button className={`${styles.navItem} ${activeTab === 'theme' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('theme')}>
                <Moon size={16} />
                Apparence
              </button>
              <button className={`${styles.navItem} ${activeTab === 'security' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('security')}>
                <Shield size={16} />
                Sécurité
              </button>
              <button className={`${styles.navItem} ${activeTab === 'about' ? styles.navItemActive : ''}`} onClick={() => setActiveTab('about')}>
                <HelpCircle size={16} />
                À propos
              </button>
            </nav>
          </aside>

          <main className={styles.mainContent}>
            {loading ? (
              <div className={styles.section}>
                <p className={styles.sectionSubtitle}>Chargement des paramètres…</p>
              </div>
            ) : null}

            {!loading && activeTab === 'notifications' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Notifications</h2>
                <p className={styles.sectionSubtitle}>
                  Gérez les notifications que vous recevez sur l&apos;application.
                </p>

                <div className={styles.settingsList}>
                  {[
                    ['emailNotifications', 'Notifications e-mail'],
                    ['reservationNotifications', 'Notifications de réservation'],
                    ['departureReminders', 'Rappels de départ'],
                    ['monthlyNewsletter', 'Newsletter mensuelle'],
                  ].map(([key, label]) => (
                    <div key={key} className={styles.settingItem}>
                      <span className={styles.settingLabel}>{label}</span>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={Boolean(settings[key as keyof typeof settings])}
                          onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.checked }))}
                          className={styles.toggleInput}
                        />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                  ))}
                </div>

                {renderSaveButton(savePreferences)}
              </div>
            )}

            {!loading && activeTab === 'language' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Langue de l&apos;application</h2>
                <p className={styles.sectionSubtitle}>
                  Choisissez la langue dans laquelle vous voulez utiliser l&apos;application.
                </p>

                <div className={styles.languageList}>
                  {LANGUAGES.map((lang) => (
                    <label key={lang.code} className={styles.languageOption}>
                      <input
                        type="radio"
                        name="language"
                        value={lang.code}
                        checked={settings.language === lang.code}
                        onChange={() => setSettings((prev) => ({ ...prev, language: lang.code }))}
                        className={styles.languageInput}
                      />
                      <span className={styles.languageLabel}>{lang.name}</span>
                    </label>
                  ))}
                </div>

                {renderSaveButton(savePreferences)}
              </div>
            )}

            {!loading && activeTab === 'theme' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Apparence</h2>
                <p className={styles.sectionSubtitle}>
                  Choisissez l&apos;apparence de l&apos;application.
                </p>

                <div className={styles.themeList}>
                  {[
                    ['light', 'Clair'],
                    ['dark', 'Sombre'],
                    ['auto', 'Auto (système)'],
                  ].map(([value, label]) => (
                    <label key={value} className={styles.themeOption}>
                      <input
                        type="radio"
                        name="theme"
                        value={value}
                        checked={settings.theme === value}
                        onChange={() => setSettings((prev) => ({ ...prev, theme: value as ThemeMode }))}
                        className={styles.themeInput}
                      />
                      <span className={styles.themeLabel}>{label}</span>
                    </label>
                  ))}
                </div>

                {renderSaveButton(savePreferences)}
              </div>
            )}

            {!loading && activeTab === 'security' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Sécurité</h2>
                <p className={styles.sectionSubtitle}>
                  Modifiez votre mot de passe et gardez votre compte protégé.
                </p>

                <div className={styles.securityList}>
                  <div className={styles.securityItem} style={{ display: 'block' }}>
                    <span className={styles.securityLabel}>Mot de passe actuel</span>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className={styles.themeLabel}
                      style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(201, 165, 112, 0.2)', background: 'rgba(28, 25, 22, 0.6)', color: 'inherit' }}
                    />
                  </div>
                  <div className={styles.securityItem} style={{ display: 'block' }}>
                    <span className={styles.securityLabel}>Nouveau mot de passe</span>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className={styles.themeLabel}
                      style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(201, 165, 112, 0.2)', background: 'rgba(28, 25, 22, 0.6)', color: 'inherit' }}
                    />
                  </div>
                  <div className={styles.securityItem} style={{ display: 'block' }}>
                    <span className={styles.securityLabel}>Confirmer le nouveau mot de passe</span>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className={styles.themeLabel}
                      style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(201, 165, 112, 0.2)', background: 'rgba(28, 25, 22, 0.6)', color: 'inherit' }}
                    />
                  </div>
                </div>

                {renderSaveButton(savePassword, 'Changer le mot de passe')}
              </div>
            )}

            {!loading && activeTab === 'about' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>À propos de Hergo</h2>
                <p className={styles.sectionSubtitle}>
                  Vos préférences de langue, d&apos;apparence et de sécurité sont maintenant accessibles ici.
                </p>

                <div className={styles.aboutInfo}>
                  <div className={styles.aboutItem}>
                    <span className={styles.aboutLabel}>Version</span>
                    <span className={styles.aboutValue}>1.0.0</span>
                  </div>
                  <div className={styles.aboutItem}>
                    <span className={styles.aboutLabel}>Langue active</span>
                    <span className={styles.aboutValue}>{settings.language.toUpperCase()}</span>
                  </div>
                  <div className={styles.aboutItem}>
                    <span className={styles.aboutLabel}>Thème actif</span>
                    <span className={styles.aboutValue}>{settings.theme}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </VoyageurLayout>
  );
};

export default SettingsPage;
