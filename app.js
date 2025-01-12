// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fermer le menu mobile lors du clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Gestion du formulaire de connexion
const connexionForm = document.getElementById('connexion-form');
if (connexionForm) {
    connexionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Simuler une connexion réussie
        const userProfile = {
            email: email,
            lastLogin: new Date().toISOString()
        };
        
        // Stocker les informations de l'utilisateur
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Afficher un message de succès
        alert('Connexion réussie !');
        
        // Rediriger vers le tableau de bord
        window.location.href = 'dashboard.html';
    });
}

// Vérification de la connexion et redirection
document.addEventListener('DOMContentLoaded', function() {
    const isConnected = localStorage.getItem('levelup_profile') || localStorage.getItem('userProfile');
    
    // Si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard, rediriger vers connexion.html
    if (!isConnected && window.location.pathname.endsWith('dashboard.html')) {
        window.location.href = 'connexion.html';
        return;
    }

    // Ajouter l'onglet Tableau de bord si l'utilisateur est connecté
    if (isConnected && window.location.pathname.endsWith('index.html')) {
        const navLinks = document.querySelector('.nav-links');
        const connexionLink = document.querySelector('.btn-connexion').parentElement;
        if (navLinks && connexionLink) {
            const dashboardLi = document.createElement('li');
            const dashboardLink = document.createElement('a');
            dashboardLink.href = 'dashboard.html';
            dashboardLink.textContent = 'Tableau de Bord';
            dashboardLi.appendChild(dashboardLink);
            navLinks.insertBefore(dashboardLi, connexionLink);
        }
    }

    // Gestion du bouton de connexion/déconnexion
    const logoutButton = document.querySelector('.btn-connexion');
    if (logoutButton) {
        if (isConnected) {
            logoutButton.textContent = 'Déconnexion';
            logoutButton.href = '#';
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        } else {
            logoutButton.textContent = 'Connexion';
            logoutButton.href = 'connexion.html';
        }
    }
});

// Fonction de déconnexion
function handleLogout() {
    // Supprimer les données de l'utilisateur du localStorage
    localStorage.removeItem('levelup_profile');
    localStorage.removeItem('levelup_objectifs');
    localStorage.removeItem('levelup_stats');
    localStorage.removeItem('levelup_history');
    localStorage.removeItem('levelup_favorite_exercices');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('weightHistory');
    
    // Afficher un message de confirmation
    alert('Vous avez été déconnecté avec succès.');
    
    // Rediriger vers la page d'accueil
    window.location.href = 'index.html';
}

// Défilement fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Ne pas empêcher la navigation par défaut si nous sommes sur dashboard.html
        if (window.location.pathname.endsWith('dashboard.html') && !this.classList.contains('btn-connexion')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animation des statistiques
function animateStats() {
    const stats = document.querySelectorAll('.stat-card h3');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            stat.textContent = Math.round(current) + (stat.textContent.includes('%') ? '%' : '+');
        }, 30);
    });
}

// Observer pour déclencher l'animation des stats
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulation d'envoi du formulaire
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Message envoyé avec succès !');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Animation des cartes au scroll
const cards = document.querySelectorAll('.service-card, .programme-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    cardObserver.observe(card);
});

// Gestion du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function() {
    const inscriptionForm = document.getElementById('inscription-form');
    if (inscriptionForm) {
        inscriptionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Début du processus d\'inscription');
            
            // Désactiver le bouton pendant le traitement
            const submitBtn = inscriptionForm.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Inscription en cours...';
            
            // Récupération des valeurs du formulaire
            const formData = {
                prenom: document.getElementById('prenom').value,
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                objectif: document.getElementById('objectif-principal').value,
                niveau: document.getElementById('niveau').value,
                age: document.getElementById('age').value,
                taille: document.getElementById('taille').value,
                poids: document.getElementById('poids').value,
                genre: document.querySelector('input[name="genre"]:checked').value,
                frequence: document.getElementById('frequence').value,
                duree: document.getElementById('duree').value,
                newsletter: document.getElementById('newsletter').checked
            };
            
            console.log('Données du formulaire:', formData);

            // Validation du mot de passe
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Créer mon profil';
                return;
            }

            try {
                console.log('Tentative d\'envoi d\'email via EmailJS...');
                // Envoi de l'email de confirmation
                const emailResponse = await emailjs.send(
                    'service_e540cuj',
                    'template_ixwwp55',
                    {
                        to_name: formData.prenom,
                        to_email: formData.email,
                        objectif: formData.objectif,
                        niveau: formData.niveau
                    }
                );
                console.log('Réponse EmailJS:', emailResponse);

                // Affichage du message de succès
                alert('Inscription réussie ! Un email de confirmation a été envoyé.');
                
                // Stocker les données utilisateur (simulation)
                localStorage.setItem('userProfile', JSON.stringify(formData));
                console.log('Données utilisateur stockées dans localStorage');
                
                // Redirection vers le tableau de bord
                console.log('Tentative de redirection vers dashboard.html');
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                console.error('Erreur détaillée:', error);
                alert('Une erreur est survenue lors de l\'envoi de l\'email de confirmation. Veuillez réessayer.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Créer mon profil';
            }
        });
    }
});

// Gestion du poids
document.addEventListener('DOMContentLoaded', function() {
    const weightForm = document.getElementById('weight-form');
    const connectScaleBtn = document.getElementById('connect-scale');
    const weightDisplay = document.querySelector('.summary-card .value');
    const weightTrend = document.querySelector('.summary-card .trend');
    
    // Charger l'historique des poids depuis le localStorage
    let weightHistory = JSON.parse(localStorage.getItem('weightHistory')) || [];
    
    if (weightForm) {
        weightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const weightInput = document.getElementById('weight');
            const weight = parseFloat(weightInput.value);
            
            if (weight && weight >= 30 && weight <= 250) {
                // Ajouter le nouveau poids à l'historique
                const weightEntry = {
                    weight: weight,
                    date: new Date().toISOString()
                };
                weightHistory.push(weightEntry);
                localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
                
                // Mettre à jour l'affichage
                updateWeightDisplay(weight);
                weightInput.value = '';
                
                // Afficher un message de succès
                alert('Poids enregistré avec succès !');
            } else {
                alert('Veuillez entrer un poids valide (entre 30 et 250 kg)');
            }
        });
    }
    
    if (connectScaleBtn) {
        connectScaleBtn.addEventListener('click', function() {
            // Simuler la connexion à une balance
            alert('Recherche des balances connectées...\nCette fonctionnalité sera bientôt disponible !');
        });
    }
    
    // Fonction pour mettre à jour l'affichage du poids
    function updateWeightDisplay(weight) {
        if (weightDisplay) {
            weightDisplay.textContent = `${weight} kg`;
        }
        if (weightTrend) {
            if (weightHistory.length > 1) {
                const previousWeight = weightHistory[weightHistory.length - 2].weight;
                const difference = (weight - previousWeight).toFixed(1);
                const trend = difference > 0 ? `+${difference}` : difference;
                weightTrend.textContent = `${trend} kg depuis la dernière mesure`;
                weightTrend.className = `trend ${difference < 0 ? 'positive' : 'negative'}`;
            } else {
                weightTrend.textContent = 'Première mesure enregistrée';
            }
        }
    }
    
    // Afficher le dernier poids enregistré au chargement
    if (weightHistory.length > 0) {
        const lastWeight = weightHistory[weightHistory.length - 1].weight;
        updateWeightDisplay(lastWeight);
    }
}); 

// Gestion des liens de navigation dans le tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('dashboard.html')) {
        document.querySelectorAll('.nav-links a[href^="index.html#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                window.location.href = href;
            });
        });
    }
}); 