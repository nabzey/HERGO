import { useState } from 'react';
import { Mail, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../core/api/api';
import styles from './AuthPage.module.css';

const ForgotPasswordFlow = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.verifyOtp(email, otp);
      setStep('newPassword');
    } catch (err: any) {
      setError(err.message || "Code invalide");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setStep('success');
    } catch (err: any) {
      setError(err.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className={styles.forgotStep}>
        <div className={styles.successIcon}>
          <CheckCircle2 size={48} color="#16a34a" />
        </div>
        <h2 className={styles.formTitle}>C'est fait !</h2>
        <p className={styles.formSubtitle}>Votre mot de passe a été réinitialisé avec succès.</p>
        <button className={styles.submitBtn} onClick={onBackToLogin}>Se connecter maintenant</button>
      </div>
    );
  }

  return (
    <div className={styles.forgotStep}>
      <h2 className={styles.formTitle}>
        {step === 'email' && 'Mot de passe oublié ?'}
        {step === 'otp' && 'Vérification'}
        {step === 'newPassword' && 'Nouveau mot de passe'}
      </h2>
      <p className={styles.formSubtitle}>
        {step === 'email' && 'Entrez votre email pour recevoir un code de vérification.'}
        {step === 'otp' && `Nous avons envoyé un code à 6 chiffres à ${email}`}
        {step === 'newPassword' && 'Choisissez un nouveau mot de passe sécurisé.'}
      </p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {step === 'email' && (
        <form onSubmit={handleSendOtp}>
          <div className={styles.field}>
            <label className={styles.label}>Adresse e-mail</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input 
                type="email" 
                className={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="votre@email.com"
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le code'} <ArrowRight size={18} />
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <div className={styles.field}>
            <label className={styles.label}>Code OTP</label>
            <div className={styles.inputWrapper}>
              <ShieldCheck size={16} className={styles.inputIcon} />
              <input 
                type="text" 
                className={styles.input} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                placeholder="123456"
                maxLength={6}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Vérification...' : 'Vérifier le code'}
          </button>
        </form>
      )}

      {step === 'newPassword' && (
        <form onSubmit={handleResetPassword}>
          <div className={styles.field}>
            <label className={styles.label}>Nouveau mot de passe</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input 
                type="password" 
                className={styles.input} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                placeholder="8 caractères minimum"
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Changer le mot de passe'}
          </button>
        </form>
      )}

      <button type="button" className={styles.switchBtn} onClick={onBackToLogin} style={{ marginTop: '1rem', width: '100%' }}>
        Retour à la connexion
      </button>
    </div>
  );
};

export default ForgotPasswordFlow;
