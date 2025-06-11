/**
 * Script principal pour le site
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les composants
    initializeMobileMenu();
    initializeMessageClosers();
    
    // Détecter les préférences de thème sombre (pour une future implémentation)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Log pour le débogage
    console.log('Script principal initialisé');
});

/**
 * Initialise les fermetures de messages de notification
 */
function initializeMessageClosers() {
    const messages = document.querySelectorAll('.message');
    
    messages.forEach(message => {
        const closeButton = message.querySelector('.message-close');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                message.remove();
            });
            
            // Auto-fermeture après 5 secondes pour les messages de succès
            if (message.classList.contains('message--success')) {
                setTimeout(() => {
                    message.style.opacity = '0';
                    setTimeout(() => {
                        message.remove();
                    }, 300);
                }, 5000);
            }
        }
    });
}

/**
 * Initialise le menu mobile
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        // Fonction pour réinitialiser l'état du menu
        const resetMenuState = () => {
            const isMobile = window.innerWidth <= 767;
            
            if (!isMobile) {
                // En mode desktop, on réinitialise tout
                menuToggle.classList.remove('is-active');
                navList.classList.remove('is-active');
                navList.style.display = 'flex';
                document.body.style.overflow = '';
            } else {
                // En mode mobile, on cache le menu s'il n'est pas actif
                if (!navList.classList.contains('is-active')) {
                    navList.style.display = 'none';
                }
            }
        };
        
        // Écouter le redimensionnement de la fenêtre
        window.addEventListener('resize', resetMenuState);
        
        // Animation fluide du burger menu
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = menuToggle.classList.contains('is-active');
            
            // Animation du bouton hamburger
            if (!isActive) {
                menuToggle.classList.add('is-active');
            } else {
                menuToggle.classList.remove('is-active');
            }
            
            // Transition du menu
            if (!isActive) {
                // Ouverture du menu
                navList.style.display = 'flex';
                // Force reflow pour que la transition s'applique
                navList.offsetHeight;
                navList.classList.add('is-active');
                document.body.style.overflow = 'hidden';
            } else {
                // Fermeture du menu
                navList.classList.remove('is-active');
                document.body.style.overflow = '';
                
                // Attendre la fin de la transition avant de cacher le menu
                setTimeout(() => {
                    if (!navList.classList.contains('is-active')) {
                        navList.style.display = 'none';
                    }
                }, 300); // Durée correspondant à la transition CSS
            }
        });
        
        // Fermer le menu quand on clique sur un lien
        const navLinks = navList.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navList.classList.remove('is-active');
                document.body.style.overflow = '';
                
                // Attendre la fin de la transition avant de cacher le menu
                setTimeout(() => {
                    if (!navList.classList.contains('is-active')) {
                        navList.style.display = 'none';
                    }
                }, 300); // Durée correspondant à la transition CSS
            });
        });
        
        // Initialiser l'état du menu au chargement
        resetMenuState();
    }
}

/**
 * Utilitaire pour obtenir un cookie par son nom
 * Utilisé pour obtenir le token CSRF dans les requêtes AJAX
 */
function getCookie(name) {
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
}

/**
 * Effectuer une requête AJAX avec CSRF Token
 */
async function fetchWithCSRF(url, options = {}) {
    const csrftoken = getCookie('csrftoken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin'
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
} 