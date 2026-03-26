import { LayoutGrid, MapPin, Mail, Phone } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Colonne Brand */}
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}>
                <LayoutGrid size={20} color="white" />
              </div>
              <span className={styles.logoText}>HERGO</span>
            </div>
            <p className={styles.tagline}>
              La plateforme de réservation d'hébergements de référence en Afrique de l'Ouest.
            </p>
          </div>

          {/* Liens rapides */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Liens rapides</h4>
            <ul className={styles.linkList}>
              {['À propos', 'Comment ça marche', 'Devenir hôte', 'Blog', 'Carrières'].map((l) => (
                <li key={l}><a href="#" className={styles.link}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <ul className={styles.linkList}>
              {[
                "Centre d'aide",
                'Politique de confidentialité',
                "Conditions d'utilisation",
                'Remboursements',
              ].map((l) => (
                <li key={l}><a href="#" className={styles.link}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <div className={styles.linkList}>
              <div className={styles.contactItem}>
                <MapPin size={14} className={styles.contactIcon} />
                <span>SENEGAL, Dakar, Plateau</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <span>contact@hergo.sn</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <span>+221 33 800 00 00</span>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          <span>© 2026 HERGO. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
