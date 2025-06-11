/**
 * Forms component
 * Gère la validation et l'interactivité des formulaires
 */
document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggles();
    initPasswordValidation();
    initFormValidation();
});

/**
 * Initialise les boutons pour afficher/masquer les mots de passe
 */
function initPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.closest('.password-input-wrapper').querySelector('input');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.setAttribute('aria-label', 'Masquer le mot de passe');
            } else {
                passwordInput.type = 'password';
                this.setAttribute('aria-label', 'Afficher le mot de passe');
            }
        });
    });
}

/**
 * Initialise la validation en temps réel des mots de passe
 */
function initPasswordValidation() {
    const passwordField = document.getElementById('id_password1');
    if (!passwordField) return;
    
    const lengthRequirement = document.getElementById('length-requirement');
    const letterRequirement = document.getElementById('letter-requirement');
    const numberRequirement = document.getElementById('number-requirement');
    const specialRequirement = document.getElementById('special-requirement');
    const confirmPasswordField = document.getElementById('id_password2');
    
    passwordField.addEventListener('input', function() {
        const password = this.value;
        
        // Vérifier la longueur minimale
        if (lengthRequirement) {
            if (password.length >= 8) {
                lengthRequirement.classList.add('valid');
            } else {
                lengthRequirement.classList.remove('valid');
            }
        }
        
        // Vérifier la présence de lettres
        if (letterRequirement) {
            if (/[a-zA-Z]/.test(password)) {
                letterRequirement.classList.add('valid');
            } else {
                letterRequirement.classList.remove('valid');
            }
        }
        
        // Vérifier la présence de chiffres
        if (numberRequirement) {
            if (/\d/.test(password)) {
                numberRequirement.classList.add('valid');
            } else {
                numberRequirement.classList.remove('valid');
            }
        }
        
        // Vérifier la présence de caractères spéciaux
        if (specialRequirement) {
            if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                specialRequirement.classList.add('valid');
            } else {
                specialRequirement.classList.remove('valid');
            }
        }
        
        // Vérifier la correspondance avec le champ de confirmation
        if (confirmPasswordField && confirmPasswordField.value) {
            validatePasswordMatch();
        }
    });
    
    // Vérifier la correspondance des mots de passe
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', validatePasswordMatch);
    }
    
    function validatePasswordMatch() {
        if (!passwordField || !confirmPasswordField) return;
        
        if (passwordField.value === confirmPasswordField.value) {
            confirmPasswordField.classList.remove('is-invalid');
        } else {
            confirmPasswordField.classList.add('is-invalid');
        }
    }
}

/**
 * Initialise la validation des formulaires avant soumission
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Vérifier les champs requis
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Vérifier les emails
            const emailFields = form.querySelectorAll('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            emailFields.forEach(field => {
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                }
            });
            
            // Vérifier la correspondance des mots de passe
            const password1 = form.querySelector('#id_password1');
            const password2 = form.querySelector('#id_password2');
            
            if (password1 && password2 && password1.value !== password2.value) {
                isValid = false;
                password2.classList.add('is-invalid');
            }
            
            // Empêcher la soumission si le formulaire n'est pas valide
            if (!isValid) {
                event.preventDefault();
                
                // Faire défiler jusqu'au premier champ invalide
                const firstInvalidField = form.querySelector('.is-invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Retirer la classe is-invalid lors de la saisie
        const formFields = form.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    });
} 