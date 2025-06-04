import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const LogoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simuler un appel API de déconnexion
      // En réalité, vous utiliseriez axios ici
      setTimeout(() => {
        // Redirigez vers la page d'accueil après la déconnexion
        navigate('/');
      }, 1500);
    } catch (error) {
      setError('Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Rediriger vers la page de profil
    navigate('/accounts/profile/');
  };

  return (
    <AuthLayout title="Déconnexion">
      <div className="auth-message warning">
        Êtes-vous sûr de vouloir vous déconnecter ?
      </div>
      
      {error && (
        <div className="auth-message error">
          {error}
        </div>
      )}
      
      <div className="btn-group">
        <button 
          className="btn-primary"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Déconnexion en cours...' : 'Oui, me déconnecter'}
        </button>
        
        <button 
          className="btn-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Annuler
        </button>
      </div>
    </AuthLayout>
  );
};

export default LogoutPage; 