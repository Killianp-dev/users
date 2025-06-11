/**
 * Home Page Scripts
 * Scripts spécifiques pour la page d'accueil
 */
document.addEventListener('DOMContentLoaded', function() {
    initFeatureCards();
    initHeroAnimation();
    initScrollAnimations();
});

/**
 * Initialise les effets d'animation pour les cartes de fonctionnalités
 */
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length === 0) return;
    
    // Ajouter des effets d'animation au survol
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
    
    // Animation au scroll (optionnelle)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        featureCards.forEach(card => {
            card.classList.add('feature-card-hidden');
            observer.observe(card);
        });
    }
}

/**
 * Initialise l'animation de la section héro
 */
function initHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroContent || !heroImage) return;
    
    // Ajouter des classes pour l'animation au chargement
    heroContent.classList.add('animate-fade-in-right');
    heroImage.classList.add('animate-fade-in-left');
    
    // Animation parallaxe au défilement (optionnelle)
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 0 && scrollTop < 600) {
            const direction = scrollTop > lastScrollTop ? 1 : -1;
            const scrollSpeed = 0.15;
            
            if (heroImage.querySelector('img')) {
                heroImage.querySelector('img').style.transform = `translateY(${scrollTop * scrollSpeed * direction}px)`;
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Effet d'animation au défilement pour les éléments de la page
 */
function initScrollAnimations() {
    // Vérifier si l'API IntersectionObserver est disponible
    if (!('IntersectionObserver' in window)) return;
    
    const sections = document.querySelectorAll('.features, .cta-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

// Styles CSS d'animation à ajouter dans home.css
/*
.feature-card-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.animate-fade-in-right {
    animation: fadeInRight 1s ease-out forwards;
}

.animate-fade-in-left {
    animation: fadeInLeft 1s ease-out forwards;
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.section-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.section-visible {
    opacity: 1;
    transform: translateY(0);
}
*/ 