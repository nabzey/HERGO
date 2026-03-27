import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../core/api/api';
import styles from './AuthPage.module.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      const user = response.user as { role: string };
      
      // Sauvegarder l'utilisateur et le token
      localStorage.setItem('hergoUser', JSON.stringify(response.user));
      localStorage.setItem('hergoToken', response.token);
      
      // Rediriger vers la page correspondant au rôle de l'utilisateur
      if (user.role === 'Voyageur') {
        navigate('/profil');
      } else if (user.role === 'Hôte') {
        navigate('/hote/dashboard');
      } else if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la connexion');
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
      <h2 className={styles.formTitle}>Bon retour ! 👋</h2>
      <p className={styles.formSubtitle}>
        Connectez-vous pour accéder à votre compte HERGO
      </p>

      {/* Email */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">
          Adresse e-mail
        </label>
        <div className={styles.inputWrapper}>
          <Mail size={16} className={styles.inputIcon} />
          <input
            id="login-email"
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

      {/* Mot de passe */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          Mot de passe
        </label>
        <div className={styles.inputWrapper}>
          <Lock size={16} className={styles.inputIcon} />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            className={styles.input}
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Mot de passe oublié */}
      <div className={styles.forgotLink}>
        <button type="button" className={styles.forgotBtn}>
          Mot de passe oublié ?
        </button>
      </div>

      {/* Bouton de connexion */}
      <button type="submit" className={styles.submitBtn}>
        <LogIn size={18} />
        Se connecter
      </button>

      {/* ---- Boutons de connexion sociale ---- */}
      <div className={styles.socialLogin}>
        <div className={styles.divider}>
          <span className={styles.dividerText}>Ou se connecter avec</span>
        </div>
        <button type="button" className={styles.socialBtn}>
          <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-.164-3.96-.164-3.18 0-5.544 2.38-5.544 5.312 0 2.96 2.364 5.328 5.544 5.328 1.632 0 2.94-.428 3.864-.948l.36.36c.48.48 1.104.744 1.784.744.632 0 1.224-.24 1.68-.672.48-.432.744-1.024.744-1.68 0-.64-.264-1.264-.72-1.712l-1.344-1.344c.368-.72.584-1.584.584-2.512 0-2.24-1.808-4.048-4.048-4.048zm-8.152 8.512c0-2.264 1.816-4.128 4.048-4.128.768 0 1.48.248 2.08.656l.848-.848c-.84-.632-1.88-.992-3.008-.992-2.608 0-4.72 2.16-4.72 4.8 0 2.632 2.112 4.8 4.72 4.8 3.6 0 5.208-2.784 5.208-5.232 0-.264-.016-.496-.04-.752-.016-.2-.04-.384-.04-.576 0-.736.08-1.44.248-2.112.208-.864.512-1.664 1.008-2.352.528-.728 1.24-1.344 2.136-1.824.912-.488 1.952-.736 3.136-.736 1.312 0 2.576.464 3.6.912 1.04.448 1.856.944 2.552 1.464.664.5.144 1.216.224 1.968.08.752.08 1.552.08 2.4 0 3.328-2.704 5.984-6.048 5.984-1.632 0-3.136-.592-4.288-1.776l-2.24 2.24c-.24.24-.552.36-.888.36-.368 0-.712-.12-.984-.36-.272-.24-.424-.608-.424-1.008 0-.424.168-.768.432-1.032l1.016-1.016z"/>
          </svg>
          Continuer avec Apple
        </button>
      </div>

      {/* Lien vers inscription */}
      <p className={styles.switchLink}>
        Pas encore de compte ?{' '}
        <button type="button" className={styles.switchBtn} onClick={onSwitchToRegister}>
          S'inscrire gratuitement
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
