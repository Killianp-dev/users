/**
 * Auth Pages Scripts
 * Scripts spécifiques pour les pages d'authentification
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les composants spécifiques à l'authentification
    enhancePasswordValidation();
    handleTermsAgreement();
    setupLoginRemember();
    initResendVerification();
});

/**
 * Améliore la validation des mots de passe avec des indicateurs visuels en temps réel
 */
function enhancePasswordValidation() {
    const passwordField = document.getElementById('id_password1');
    if (!passwordField) return;
    
    const requirements = document.querySelectorAll('.requirement');
    if (requirements.length === 0) return;
    
    // Stocker les règles de validation
    const validationRules = [
        { id: 'length-requirement', regex: /.{8,}/, message: 'Au moins 8 caractères' },
        { id: 'letter-requirement', regex: /[a-zA-Z]/, message: 'Au moins une lettre' },
        { id: 'number-requirement', regex: /\d/, message: 'Au moins un chiffre' },
        { id: 'special-requirement', regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'Au moins un caractère spécial' }
    ];
    
    // Mettre à jour l'état des exigences en temps réel
    passwordField.addEventListener('input', function() {
        const password = this.value;
        
        validationRules.forEach(rule => {
            const element = document.getElementById(rule.id);
            if (!element) return;
            
            if (rule.regex.test(password)) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        });
        
        // Vérifier si toutes les exigences sont satisfaites
        const allValid = validationRules.every(rule => {
            const element = document.getElementById(rule.id);
            return !element || rule.regex.test(password);
        });
        
        // Mettre à jour visuellement le champ
        if (password && allValid) {
            passwordField.classList.remove('is-invalid');
            passwordField.classList.add('is-valid');
        } else if (password) {
            passwordField.classList.remove('is-valid');
            passwordField.classList.add('is-invalid');
        } else {
            passwordField.classList.remove('is-valid', 'is-invalid');
        }
    });
}

/**
 * Gère la case à cocher d'acceptation des conditions
 */
function handleTermsAgreement() {
    const termsCheckbox = document.getElementById('id_terms_agreement');
    if (!termsCheckbox) return;
    
    const signupButton = document.querySelector('button[type="submit"]');
    if (!signupButton) return;
    
    // Vérifier l'état initial
    updateButtonState();
    
    // Mettre à jour le bouton quand la case change d'état
    termsCheckbox.addEventListener('change', updateButtonState);
    
    function updateButtonState() {
        if (termsCheckbox.checked) {
            signupButton.removeAttribute('disabled');
        } else {
            signupButton.setAttribute('disabled', true);
        }
    }
    
    // Ajouter un effet visuel lorsqu'on clique sur le bouton d'inscription sans avoir coché
    signupButton.addEventListener('click', function(e) {
        if (!termsCheckbox.checked) {
            e.preventDefault();
            termsCheckbox.classList.add('is-invalid');
            
            // Animer la case à cocher pour attirer l'attention
            termsCheckbox.parentElement.classList.add('shake');
            setTimeout(() => {
                termsCheckbox.parentElement.classList.remove('shake');
            }, 500);
        }
    });
    
    // Enlever l'état d'erreur quand on coche la case
    termsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            this.classList.remove('is-invalid');
        }
    });
}

/**
 * Gère la case "Se souvenir de moi" sur la page de connexion
 */
function setupLoginRemember() {
    const rememberCheckbox = document.getElementById('id_remember');
    if (!rememberCheckbox) return;
    
    // Vérifier si un cookie de session existe déjà
    const hasSessionCookie = document.cookie.split(';').some(item => item.trim().startsWith('sessionid='));
    
    // Si un cookie existe, cocher la case par défaut
    if (hasSessionCookie) {
        rememberCheckbox.checked = true;
    }
}

/**
 * Initialise le bouton de renvoi d'email de vérification
 */
function initResendVerification() {
    const resendButton = document.querySelector('.resend-button');
    if (!resendButton) return;
    
    resendButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = this.dataset.email;
        if (!email) return;
        
        try {
            // Désactiver le bouton pendant la requête
            this.setAttribute('disabled', true);
            this.innerHTML = 'Envoi en cours...';
            
            // Récupérer le token CSRF
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Faire la requête pour renvoyer l'email
            const response = await fetch('/accounts/resend-verification/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ email }),
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                // Afficher un message de succès
                this.innerHTML = 'Email envoyé !';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                
                // Désactiver le bouton pendant 3 minutes
                const cooldownTime = 3 * 60; // 3 minutes en secondes
                startCooldown(this, cooldownTime);
            } else {
                // Afficher un message d'erreur
                this.innerHTML = 'Erreur, réessayez';
                this.removeAttribute('disabled');
            }
        } catch (error) {
            console.error('Erreur lors du renvoi de l\'email:', error);
            this.innerHTML = 'Erreur, réessayez';
            this.removeAttribute('disabled');
        }
    });
    
    function startCooldown(button, seconds) {
        let remainingTime = seconds;
        
        const interval = setInterval(() => {
            remainingTime--;
            
            const minutes = Math.floor(remainingTime / 60);
            const secs = remainingTime % 60;
            
            button.innerHTML = `Renvoyer (${minutes}:${secs < 10 ? '0' : ''}${secs})`;
            
            if (remainingTime <= 0) {
                clearInterval(interval);
                button.innerHTML = 'Renvoyer l\'email';
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
                button.removeAttribute('disabled');
            }
        }, 1000);
    }
} 