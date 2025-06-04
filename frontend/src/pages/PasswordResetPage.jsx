import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'warning', text: 'Veuillez entrer votre adresse email.' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simuler un appel API
      // En réalité, vous utiliseriez axios ici
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: 'Si cette adresse email est associée à un compte, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.' 
        });
        setSubmitted(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Réinitialiser votre mot de passe">
      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {!submitted ? (
        <>
          <div className="auth-message info">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>
        </>
      ) : (
        <div className="btn-group">
          <Link to="/" className="btn-primary">
            Retour à l'accueil
          </Link>
          <button 
            className="btn-secondary"
            onClick={() => {
              setEmail('');
              setSubmitted(false);
              setMessage({ type: '', text: '' });
            }}
          >
            Demander à nouveau
          </button>
        </div>
      )}
    </AuthLayout>
  );
};

export default PasswordResetPage; 