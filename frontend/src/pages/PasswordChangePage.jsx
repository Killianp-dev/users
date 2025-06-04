import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const PasswordChangePage = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

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
    const password = formData.newPassword;
    setPasswordChecks({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  }, [formData.newPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    // Vérifier que tous les champs sont remplis
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'warning', text: 'Tous les champs doivent être remplis.' });
      return false;
    }
    
    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (formData.oldPassword === formData.newPassword) {
      setMessage({ type: 'warning', text: 'Le nouveau mot de passe doit être différent de l\'ancien.' });
      return false;
    }
    
    // Vérifier que le mot de passe remplit toutes les conditions
    const allChecksValid = Object.values(passwordChecks).every(check => check);
    if (!allChecksValid) {
      setMessage({ type: 'warning', text: 'Le nouveau mot de passe ne remplit pas toutes les conditions requises.' });
      return false;
    }
    
    // Vérifier que les mots de passe correspondent
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'warning', text: 'Les mots de passe ne correspondent pas.' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simuler un appel API
      // En réalité, vous utiliseriez axios ici
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Votre mot de passe a été modifié avec succès.' });
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe.' });
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Changer votre mot de passe">
      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Mot de passe actuel</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          
          <div className="password-checklist">
            <p>Votre mot de passe doit contenir :</p>
            <ul>
              <li className={passwordChecks.minLength ? 'valid' : 'invalid'}>
                Au moins 8 caractères
              </li>
              <li className={passwordChecks.hasUpperCase ? 'valid' : 'invalid'}>
                Au moins une majuscule
              </li>
              <li className={passwordChecks.hasLowerCase ? 'valid' : 'invalid'}>
                Au moins une minuscule
              </li>
              <li className={passwordChecks.hasNumber ? 'valid' : 'invalid'}>
                Au moins un chiffre
              </li>
              <li className={passwordChecks.hasSpecialChar ? 'valid' : 'invalid'}>
                Au moins un caractère spécial
              </li>
            </ul>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
        </button>
      </form>
      
      <div className="auth-links">
        <Link to="/accounts/password/reset/" className="btn-link">
          Mot de passe oublié ?
        </Link>
      </div>
    </AuthLayout>
  );
};

export default PasswordChangePage; 