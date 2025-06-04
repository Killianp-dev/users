import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const EmailPage = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Simuler le chargement des emails depuis le backend
    // Dans une implémentation réelle, vous feriez un appel API ici
    setTimeout(() => {
      setEmails([
        { id: 1, email: 'utilisateur@exemple.com', primary: true, verified: true },
        { id: 2, email: 'secondaire@exemple.com', primary: false, verified: false }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddEmail = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      setMessage({ type: 'warning', text: 'Veuillez entrer une adresse email.' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simuler un appel API
      // En réalité, vous utiliseriez axios ici
      setTimeout(() => {
        const newId = emails.length + 1;
        setEmails([...emails, { id: newId, email: newEmail, primary: false, verified: false }]);
        setNewEmail('');
        setMessage({ type: 'success', text: 'Email ajouté avec succès. Un email de vérification a été envoyé.' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'ajout de l\'email.' });
      setLoading(false);
    }
  };

  const handleMakePrimary = async (id) => {
    setLoading(true);
    
    try {
      // Simuler un appel API
      setTimeout(() => {
        const updatedEmails = emails.map(email => ({
          ...email,
          primary: email.id === id
        }));
        setEmails(updatedEmails);
        setMessage({ type: 'success', text: 'Email principal mis à jour avec succès.' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour de l\'email principal.' });
      setLoading(false);
    }
  };

  const handleRemoveEmail = async (id) => {
    if (emails.find(email => email.id === id)?.primary) {
      setMessage({ type: 'warning', text: 'Vous ne pouvez pas supprimer votre email principal.' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simuler un appel API
      setTimeout(() => {
        const updatedEmails = emails.filter(email => email.id !== id);
        setEmails(updatedEmails);
        setMessage({ type: 'success', text: 'Email supprimé avec succès.' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression de l\'email.' });
      setLoading(false);
    }
  };

  const handleResendVerification = async (id) => {
    setLoading(true);
    
    try {
      // Simuler un appel API
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Email de vérification envoyé avec succès.' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi de l\'email de vérification.' });
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Gérer vos adresses email">
      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="email-list">
        <h3>Vos adresses email</h3>
        
        {loading ? (
          <p>Chargement...</p>
        ) : (
          emails.map(email => (
            <div key={email.id} className={`email-item ${email.primary ? 'primary' : ''}`}>
              <div>
                {email.email} 
                {email.primary && <span> (principale)</span>}
                {!email.verified && <span> (non vérifiée)</span>}
              </div>
              <div className="email-item-actions">
                {!email.primary && (
                  <button 
                    onClick={() => handleMakePrimary(email.id)}
                    className="btn-link"
                  >
                    Définir comme principale
                  </button>
                )}
                
                {!email.verified && (
                  <button 
                    onClick={() => handleResendVerification(email.id)}
                    className="btn-link"
                  >
                    Renvoyer la vérification
                  </button>
                )}
                
                {!email.primary && (
                  <button 
                    onClick={() => handleRemoveEmail(email.id)}
                    className="btn-link"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleAddEmail}>
        <div className="form-group">
          <label htmlFor="newEmail">Ajouter une adresse email</label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="nouvelle@email.com"
            required
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'En cours...' : 'Ajouter'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default EmailPage; 