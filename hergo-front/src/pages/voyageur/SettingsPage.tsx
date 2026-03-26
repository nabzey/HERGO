import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, Bell, Globe, Moon, Shield, HelpCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './SettingsPage.module.css';

type TabType = 'notifications' | 'language' | 'theme' | 'security' | 'about';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notifications');

  const NOTIFICATION_OPTIONS = [
    { id: 'reservation', label: 'Notifications de réservation', defaultOn: true },
    { id: 'reminder', label: 'Rappels de réservation', defaultOn: true },
    { id: 'price_alerts', label: 'Alertes de prix', defaultOn: false },
    { id: 'promotions', label: 'Promotions et offres', defaultOn: true },
    { id: 'reviews', label: 'Avis des autres voyageurs', defaultOn: false },
    { id: 'newsletter', label: 'Newsletter mensuelle', defaultOn: false },
  ];

  const LANGUAGES = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.inner}>
        <div className={styles.header}>
          <Link to="/profil" className={styles.backLink}>
            <ChevronLeft size={14} /> Retour à mon profil
          </Link>
          <h1 className={styles.title}>Paramètres</h1>
        </div>

        <div className={styles.contentLayout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <button
                className={`${styles.navItem} ${activeTab === 'notifications' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={16} />
                Notifications
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'language' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('language')}
              >
                <Globe size={16} />
                Langue
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'theme' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('theme')}
              >
                <Moon size={16} />
                Apparence
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'security' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={16} />
                Sécurité
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'about' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <HelpCircle size={16} />
                À propos
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Notifications</h2>
                <p className={styles.sectionSubtitle}>
                  Gérez les notifications que vous recevez sur l'application.
                </p>
                
                <div className={styles.settingsList}>
                  {NOTIFICATION_OPTIONS.map((option) => (
                    <div key={option.id} className={styles.settingItem}>
                      <span className={styles.settingLabel}>{option.label}</span>
                      <label className={styles.toggle}>
                        <input type="checkbox" defaultChecked={option.defaultOn} className={styles.toggleInput} />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language */}
            {activeTab === 'language' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Langue de l'application</h2>
                <p className={styles.sectionSubtitle}>
                  Choisissez la langue dans laquelle vous voulez utiliser l'application.
                </p>
                
                <div className={styles.languageList}>
                  {LANGUAGES.map((lang) => (
                    <label key={lang.code} className={styles.languageOption}>
                      <input
                        type="radio"
                        name="language"
                        value={lang.code}
                        defaultChecked={lang.code === 'fr'}
                        className={styles.languageInput}
                      />
                      <span className={styles.languageLabel}>{lang.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Theme */}
            {activeTab === 'theme' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Apparence</h2>
                <p className={styles.sectionSubtitle}>
                  Choisissez l'apparence de l'application.
                </p>
                
                <div className={styles.themeList}>
                  <label className={styles.themeOption}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      defaultChecked
                      className={styles.themeInput}
                    />
                    <span className={styles.themeLabel}>Clair</span>
                  </label>
                  <label className={styles.themeOption}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      className={styles.themeInput}
                    />
                    <span className={styles.themeLabel}>Sombre</span>
                  </label>
                  <label className={styles.themeOption}>
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      className={styles.themeInput}
                    />
                    <span className={styles.themeLabel}>Auto (système)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Sécurité</h2>
                <p className={styles.sectionSubtitle}>
                  Gérez la sécurité de votre compte.
                </p>
                
                <div className={styles.securityList}>
                  <div className={styles.securityItem}>
                    <span className={styles.securityLabel}>Changer le mot de passe</span>
                    <button className={styles.securityBtn}>Modifier</button>
                  </div>
                  <div className={styles.securityItem}>
                    <span className={styles.securityLabel}>Authentification à deux facteurs</span>
                    <button className={styles.securityBtn}>Activer</button>
                  </div>
                  <div className={styles.securityItem}>
                    <span className={styles.securityLabel}>Sessions actives</span>
                    <button className={styles.securityBtn}>Voir</button>
                  </div>
                </div>
              </div>
            )}

            {/* About */}
            {activeTab === 'about' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>À propos de Hergo</h2>
                <p className={styles.sectionSubtitle}>
                  Découvrez plus sur l'application Hergo.
                </p>
                
                <div className={styles.aboutInfo}>
                  <div className={styles.aboutItem}>
                    <span className={styles.aboutLabel}>Version</span>
                    <span className={styles.aboutValue}>1.0.0</span>
                  </div>
                  <div className={styles.aboutItem}>
                    <span className={styles.aboutLabel}>Date de mise à jour</span>
                    <span className={styles.aboutValue}>05 Mar 2026</span>
                  </div>
                  <div className={styles.aboutItem}>
                    <span className={styles.aboutLabel}>Aide & Support</span>
                    <button className={styles.aboutBtn}>Contactez-nous</button>
                  </div>
                </div>

                <div className={styles.legalLinks}>
                  <a href="#" className={styles.legalLink}>Conditions d'utilisation</a>
                  <a href="#" className={styles.legalLink}>Politique de confidentialité</a>
                  <a href="#" className={styles.legalLink}>Politique de cookies</a>
                  <a href="#" className={styles.legalLink}>Licences</a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;