import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  // Function to get CSRF token from cookies
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
  
  // Récupérer le CSRF token au chargement de l'application
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await axios.get('/api/csrf/', {
          withCredentials: true,
        });
        console.log('CSRF Token récupéré:', getCookie('csrftoken'));
      } catch (error) {
        console.error('Erreur lors de la récupération du CSRF token:', error);
      }
    };
    
    fetchCsrfToken();
  }, []);
  
  // Vérifier les conditions du mot de passe à chaque modification
  useEffect(() => {
    if (!isLogin) {
      const password = formData.password;
      setPasswordChecks({
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      });
    }
  }, [formData.password, isLogin]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      // Vérifier si le mot de passe remplit toutes les conditions
      const allChecksValid = Object.values(passwordChecks).every(check => check);
      
      if (!allChecksValid) {
        newErrors.password = 'Le mot de passe ne remplit pas toutes les conditions requises';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const endpoint = isLogin ? '/api/login/' : '/api/signup/';
      const dataToSend = {
        email: formData.email,
        password: formData.password
      };
      
      // Ajouter confirmPassword pour la création de compte
      if (!isLogin) {
        dataToSend.confirmPassword = formData.confirmPassword;
      }
      
      const csrftoken = getCookie('csrftoken');
      const response = await axios({
        method: 'post',
        url: endpoint,
        data: dataToSend,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        withCredentials: true,
      });
      
      const data = response.data;
      
      if (response.status === 200 || response.status === 201) {
        console.log('Success:', data);
        // Redirect to profile page or dashboard
        window.location.href = '/accounts/profile/';
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle API errors
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ api: error.response.data.error });
      } else {
        setErrors({ api: 'Erreur de connexion au serveur' });
      }
    }
  };

  return (
    <div className="auth-container">
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L2 7L16 12L30 7L16 2Z" fill="#4F46E5" />
              <path d="M16 12L2 7V17L16 22L30 17V7L16 12Z" fill="#818CF8" />
              <path d="M16 22L2 17V27L16 32L30 27V17L16 22Z" fill="#C7D2FE" />
            </svg>
            <h1>AuthFlow</h1>
          </div>
          
          <h2>{isLogin ? 'Se connecter' : 'Créer un compte'}</h2>
          
          {errors.api && <div className="error-message">{errors.api}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
              
              {!isLogin && (
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
              )}
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
            )}
            
            <button type="submit" className="btn-primary">
              {isLogin ? 'Connexion' : 'Inscription'}
            </button>
          </form>
          
          <div className="auth-toggle">
            <p>
              {isLogin 
                ? "Vous n'avez pas de compte ?" 
                : "Vous avez déjà un compte ?"}
            </p>
            <button 
              className="btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
