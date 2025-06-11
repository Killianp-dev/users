/**
 * Navigation component
 * Gère le menu de navigation responsive et les interactions associées
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initScrollNavigation();
    initActiveLinks();
});

/**
 * Initialise la navigation mobile
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    // Toggle du menu mobile
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('is-active');
        
        // Empêcher le scroll du body lorsque le menu est ouvert
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('is-active');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu lorsque l'utilisateur redimensionne la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && navList.classList.contains('is-active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Initialise les effets de navigation au scroll
 * Change l'apparence du header lors du défilement
 */
function initScrollNavigation() {
    const header = document.querySelector('.main-header');
    if (!header) return;
    
    const scrollThreshold = 50;
    
    // Vérifier la position initiale
    checkScroll();
    
    // Écouter l'événement de défilement
    window.addEventListener('scroll', function() {
        checkScroll();
    });
    
    function checkScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }
}

/**
 * Met en évidence le lien actif dans la navigation
 */
function initActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Gérer les liens relatifs et absolus
        if ((href === '/' && currentPath === '/') || 
            (href !== '/' && currentPath.includes(href))) {
            link.classList.add('active');
        }
    });
}

/**
 * Défilement fluide pour les ancres (à décommenter si nécessaire)
 */
/*
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}
*/ 