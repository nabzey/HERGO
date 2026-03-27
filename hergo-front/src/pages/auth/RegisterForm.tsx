import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Building2, UserCheck, CheckCircle, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../core/api/api';
import styles from './AuthPage.module.css';

type Role = 'client' | 'hote';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [role, setRole] = useState<Role>('client');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [telephone, setTelephone] = useState('');
  const [pieceIdentite, setPieceIdentite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptCgu) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const userRole = role === 'client' ? 'Voyageur' : 'Hôte';
      const response = await authApi.register({
        name: `${prenom} ${nom}`,
        email,
        password,
        role: userRole,
      });
      
      // Sauvegarder l'utilisateur et le token
      localStorage.setItem('hergoUser', JSON.stringify(response.user));
      localStorage.setItem('hergoToken', response.token);
      
      // Rediriger vers la page correspondant au rôle
      if (userRole === 'Voyageur') {
        navigate('/profil');
      } else if (userRole === 'Hôte') {
        navigate('/hote/dashboard');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
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
      <h2 className={styles.formTitle}>Créer un compte</h2>
      <p className={styles.formSubtitle}>
        Rejoignez des milliers de voyageurs sur HERGO
      </p>

      {/* ---- Sélecteur de rôle ---- */}
      <div className={styles.roleSection}>
        <span className={styles.roleLabel}>Je suis un…</span>
        <div className={styles.roleGrid}>
          {/* Client */}
          <div
            className={`${styles.roleCard} ${role === 'client' ? styles.roleCardActive : ''}`}
            onClick={() => setRole('client')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setRole('client')}
            aria-pressed={role === 'client'}
          >
            <div className={styles.roleIconWrapper}>
              <User
                size={24}
                color={role === 'client' ? 'var(--color-primary)' : 'var(--color-text-gray)'}
              />
            </div>
            <span className={styles.roleName}>Client</span>
            <span className={styles.roleDesc}>Je cherche un hébergement</span>
            {role === 'client' && (
              <CheckCircle
                size={18}
                color="var(--color-primary)"
                style={{ position: 'absolute', top: 8, right: 8 }}
              />
            )}
          </div>

          {/* Hôte */}
          <div
            className={`${styles.roleCard} ${role === 'hote' ? styles.roleCardActive : ''}`}
            onClick={() => setRole('hote')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setRole('hote')}
            aria-pressed={role === 'hote'}
            style={{ position: 'relative' }}
          >
            <div className={styles.roleIconWrapper}>
              <Building2
                size={24}
                color={role === 'hote' ? 'var(--color-primary)' : 'var(--color-text-gray)'}
              />
            </div>
            <span className={styles.roleName}>Hôte</span>
            <span className={styles.roleDesc}>Je propose mon logement</span>
            {role === 'hote' && (
              <CheckCircle
                size={18}
                color="var(--color-primary)"
                style={{ position: 'absolute', top: 8, right: 8 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ---- Prénom / Nom ---- */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-prenom">Prénom</label>
          <div className={styles.inputWrapper}>
            <User size={15} className={styles.inputIcon} />
            <input
              id="reg-prenom"
              type="text"
              className={styles.input}
              placeholder="Jean"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-nom">Nom</label>
          <div className={styles.inputWrapper}>
            <User size={15} className={styles.inputIcon} />
            <input
              id="reg-nom"
              type="text"
              className={styles.input}
              placeholder="Koné"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>
        </div>
      </div>

      {/* ---- Email ---- */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-email">Adresse e-mail</label>
        <div className={styles.inputWrapper}>
          <Mail size={16} className={styles.inputIcon} />
          <input
            id="reg-email"
            type="email"
            className={styles.input}
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* ---- Mot de passe ---- */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-password">Mot de passe</label>
        <div className={styles.inputWrapper}>
          <Lock size={16} className={styles.inputIcon} />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            className={styles.input}
            placeholder="Min. 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* ---- Confirmer mot de passe ---- */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-confirm">Confirmer le mot de passe</label>
        <div className={styles.inputWrapper}>
          <Lock size={16} className={styles.inputIcon} />
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            className={styles.input}
            placeholder="Répétez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? 'Masquer' : 'Afficher'}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* ---- Champs spécifiques aux hôtes ---- */}
      {role === 'hote' && (
        <>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-telephone">Numéro de téléphone</label>
            <div className={styles.inputWrapper}>
              <Phone size={16} className={styles.inputIcon} />
              <input
                id="reg-telephone"
                type="tel"
                className={styles.input}
                placeholder="+221 77 123 45 67"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-piece">Pièce d'identité</label>
            <div className={styles.inputWrapper}>
              <FileText size={16} className={styles.inputIcon} />
              <input
                id="reg-piece"
                type="text"
                className={styles.input}
                placeholder="Numéro de carte nationale ou passeport"
                value={pieceIdentite}
                onChange={(e) => setPieceIdentite(e.target.value)}
                required
              />
            </div>
          </div>
        </>
      )}

      {/* ---- CGU ---- */}
      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={acceptCgu}
          onChange={(e) => setAcceptCgu(e.target.checked)}
        />
        <span className={styles.checkboxLabel}>
          J'accepte les{' '}
          <a href="#">conditions d'utilisation</a> et la{' '}
          <a href="#">politique de confidentialité</a> de HERGO
        </span>
      </label>

      {/* ---- Bouton submit ---- */}
      <button type="submit" className={styles.submitBtn} disabled={loading}>
        <UserCheck size={18} />
        {loading ? 'Création en cours...' : `Créer mon compte ${role === 'hote' ? 'Hôte' : 'Client'}`}
      </button>

      {/* ---- Lien vers connexion ---- */}
     {/* ---- Boutons de connexion sociale ---- */}
     <div className={styles.socialLogin}>
       <div className={styles.divider}>
         <span className={styles.dividerText}>Ou s'inscrire avec</span>
       </div>
       <button type="button" className={styles.socialBtn}>
         <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
           <path d="M12.152 6.896c-.948 0-2.415-.164-3.96-.164-3.18 0-5.544 2.38-5.544 5.312 0 2.96 2.364 5.328 5.544 5.328 1.632 0 2.94-.428 3.864-.948l.36.36c.48.48 1.104.744 1.784.744.632 0 1.224-.24 1.68-.672.48-.432.744-1.024.744-1.68 0-.64-.264-1.264-.72-1.712l-1.344-1.344c.368-.72.584-1.584.584-2.512 0-2.24-1.808-4.048-4.048-4.048zm-8.152 8.512c0-2.264 1.816-4.128 4.048-4.128.768 0 1.48.248 2.08.656l.848-.848c-.84-.632-1.88-.992-3.008-.992-2.608 0-4.72 2.16-4.72 4.8 0 2.632 2.112 4.8 4.72 4.8 3.6 0 5.208-2.784 5.208-5.232 0-.264-.016-.496-.04-.752-.016-.2-.04-.384-.04-.576 0-.736.08-1.44.248-2.112.208-.864.512-1.664 1.008-2.352.528-.728 1.24-1.344 2.136-1.824.912-.488 1.952-.736 3.136-.736 1.312 0 2.576.464 3.6.912 1.04.448 1.856.944 2.552 1.464.664.5.144 1.216.224 1.968.08.752.08 1.552.08 2.4 0 3.328-2.704 5.984-6.048 5.984-1.632 0-3.136-.592-4.288-1.776l-2.24 2.24c-.24.24-.552.36-.888.36-.368 0-.712-.12-.984-.36-.272-.24-.424-.608-.424-1.008 0-.424.168-.768.432-1.032l1.016-1.016z"/>
         </svg>
         Continuer avec Apple
       </button>
     </div>

     {/* ---- Lien vers connexion ---- */}
     <p className={styles.switchLink}>
       Déjà un compte ?{' '}
       <button type="button" className={styles.switchBtn} onClick={onSwitchToLogin}>
         Se connecter
       </button>
     </p>
   </form>
 );
};

export default RegisterForm;
