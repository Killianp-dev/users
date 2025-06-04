import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthLayout = ({ children, title }) => {
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
          
          <h2>{title}</h2>
          
          {children}
          
          <div className="auth-links">
            <Link to="/" className="btn-link">Accueil</Link>
            <Link to="/accounts/profile/" className="btn-link">Profil</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default AuthLayout; 