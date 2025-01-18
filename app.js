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
    console.log('État de connexion:', isConnected);
    
    // Si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard, rediriger vers connexion.html
    if (!isConnected && window.location.pathname.endsWith('dashboard.html')) {
        window.location.href = 'connexion.html';
        return;
    }

    // Ajouter l'onglet Tableau de bord si l'utilisateur est connecté
    if (isConnected && window.location.pathname.includes('index.html')) {
        console.log('Tentative d\'ajout de l\'onglet Tableau de bord');
        const navLinks = document.querySelector('.nav-links');
        const connexionLink = document.querySelector('.btn-connexion').parentElement;
        console.log('Navigation trouvée:', !!navLinks, 'Bouton connexion trouvé:', !!connexionLink);
        
        if (navLinks && connexionLink) {
            const dashboardLi = document.createElement('li');
            const dashboardLink = document.createElement('a');
            dashboardLink.href = 'dashboard.html';
            dashboardLink.textContent = 'Tableau de Bord';
            dashboardLi.appendChild(dashboardLink);
            navLinks.insertBefore(dashboardLi, connexionLink);
            console.log('Onglet Tableau de bord ajouté');
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
    const weightDisplay = document.querySelector('.summary-card[data-type="weight"] .value');
    const weightTrend = document.querySelector('.summary-card[data-type="weight"] .trend');
    const resetWeightHistoryBtn = document.getElementById('reset-weight-history');
    
    // Charger l'historique des poids depuis le localStorage
    let weightHistory = JSON.parse(localStorage.getItem('weightHistory')) || [];
    let weightChart = null;
    
    // Initialiser le graphique
    function initWeightChart() {
        const ctx = document.getElementById('weightChart');
        if (!ctx) return;

        weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weightHistory.map(entry => new Date(entry.date).toLocaleDateString()),
                datasets: [{
                    label: 'Poids (kg)',
                    data: weightHistory.map(entry => entry.weight),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} kg`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return `${value} kg`;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Mettre à jour le graphique
    function updateWeightChart() {
        if (!weightChart) return;

        weightChart.data.labels = weightHistory.map(entry => new Date(entry.date).toLocaleDateString());
        weightChart.data.datasets[0].data = weightHistory.map(entry => entry.weight);
        weightChart.update();
    }
    
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
                updateWeightChart();
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

    if (resetWeightHistoryBtn) {
        resetWeightHistoryBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser l\'historique des poids ? Cette action est irréversible.')) {
                weightHistory = [];
                localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
                updateWeightDisplay(null);
                updateWeightChart();
                alert('Historique des poids réinitialisé avec succès !');
            }
        });
    }
    
    // Fonction pour mettre à jour l'affichage du poids
    function updateWeightDisplay(weight) {
        if (weightDisplay) {
            weightDisplay.textContent = weight ? `${weight} kg` : '-- kg';
        }
        if (weightTrend) {
            if (weight && weightHistory.length > 1) {
                const previousWeight = weightHistory[weightHistory.length - 2].weight;
                const difference = (weight - previousWeight).toFixed(1);
                const trend = difference > 0 ? `+${difference}` : difference;
                weightTrend.textContent = `${trend} kg depuis la dernière mesure`;
                weightTrend.className = `trend ${difference < 0 ? 'positive' : 'negative'}`;
            } else if (weight) {
                weightTrend.textContent = 'Première mesure enregistrée';
                weightTrend.className = 'trend';
            } else {
                weightTrend.textContent = 'Ajoutez votre poids';
                weightTrend.className = 'trend';
            }
        }
    }
    
    // Afficher le dernier poids enregistré au chargement
    if (weightHistory.length > 0) {
        const lastWeight = weightHistory[weightHistory.length - 1].weight;
        updateWeightDisplay(lastWeight);
    }

    // Initialiser le graphique au chargement
    initWeightChart();
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

// Gestion du programme de perte de poids
document.addEventListener('DOMContentLoaded', function() {
    const startWorkoutBtn = document.querySelector('.start-workout');
    const weightLossChart = document.getElementById('weightLossChart');
    
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function() {
            // Simuler le démarrage d'une séance
            const workoutDetails = {
                type: 'HIIT',
                duration: 45,
                exercises: [
                    { name: 'Échauffement dynamique', duration: 10 },
                    { name: 'Circuit HIIT #1', duration: 15 },
                    { name: 'Circuit HIIT #2', duration: 15 },
                    { name: 'Retour au calme', duration: 5 }
                ]
            };
            
            startWorkout(workoutDetails);
        });
    }
    
    if (weightLossChart) {
        initWeightLossChart();
    }
});

// Démarrer une séance d'entraînement
function startWorkout(workoutDetails) {
    // Créer une modale pour la séance
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${workoutDetails.type} - ${workoutDetails.duration} minutes</h3>
            <div class="workout-progress">
                <div class="current-exercise">
                    <h4>Exercice en cours</h4>
                    <p class="exercise-name">Échauffement dynamique</p>
                    <div class="timer">10:00</div>
                </div>
                <div class="exercise-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
            <div class="workout-controls">
                <button class="btn-secondary pause-workout">
                    <i class="fas fa-pause"></i> Pause
                </button>
                <button class="btn-danger stop-workout">
                    <i class="fas fa-stop"></i> Arrêter
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    let currentExerciseIndex = 0;
    let timeLeft = workoutDetails.exercises[0].duration * 60;
    let isPaused = false;

    const timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateWorkoutUI(modal, timeLeft, currentExerciseIndex, workoutDetails.exercises);

            if (timeLeft <= 0) {
                currentExerciseIndex++;
                if (currentExerciseIndex < workoutDetails.exercises.length) {
                    timeLeft = workoutDetails.exercises[currentExerciseIndex].duration * 60;
                } else {
                    clearInterval(timer);
                    completeWorkout(modal);
                }
            }
        }
    }, 1000);

    // Gestionnaires d'événements pour les boutons
    modal.querySelector('.pause-workout').addEventListener('click', () => {
        isPaused = !isPaused;
        const btn = modal.querySelector('.pause-workout');
        btn.innerHTML = isPaused ? 
            '<i class="fas fa-play"></i> Reprendre' : 
            '<i class="fas fa-pause"></i> Pause';
    });

    modal.querySelector('.stop-workout').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir arrêter la séance ?')) {
            clearInterval(timer);
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Mettre à jour l'interface de la séance
function updateWorkoutUI(modal, timeLeft, currentExerciseIndex, exercises) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timer = modal.querySelector('.timer');
    const exerciseName = modal.querySelector('.exercise-name');
    const progressFill = modal.querySelector('.progress-fill');

    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    exerciseName.textContent = exercises[currentExerciseIndex].name;

    const totalDuration = exercises[currentExerciseIndex].duration * 60;
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
    progressFill.style.width = `${progress}%`;
}

// Terminer une séance
function completeWorkout(modal) {
    modal.querySelector('.workout-progress').innerHTML = `
        <div class="workout-complete">
            <i class="fas fa-check-circle"></i>
            <h4>Séance terminée !</h4>
            <p>Félicitations, vous avez terminé votre séance d'aujourd'hui.</p>
            <div class="workout-stats">
                <div class="stat">
                    <span class="stat-value">450</span>
                    <span class="stat-label">Calories brûlées</span>
                </div>
                <div class="stat">
                    <span class="stat-value">45</span>
                    <span class="stat-label">Minutes d'exercice</span>
                </div>
            </div>
        </div>
    `;

    modal.querySelector('.workout-controls').innerHTML = `
        <button class="btn-primary close-workout">Terminer</button>
    `;

    modal.querySelector('.close-workout').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
        updateWorkoutStats();
    });
}

// Initialiser le graphique de progression
function initWeightLossChart() {
    const ctx = document.getElementById('weightLossChart').getContext('2d');
    const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weightHistory.map(entry => new Date(entry.date).toLocaleDateString()),
            datasets: [{
                label: 'Poids (kg)',
                data: weightHistory.map(entry => entry.weight),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Mettre à jour les statistiques après une séance
function updateWorkoutStats() {
    const stats = JSON.parse(localStorage.getItem('levelup_stats') || '{}');
    stats.calories_burned = (stats.calories_burned || 0) + 450;
    stats.workouts_completed = (stats.workouts_completed || 0) + 1;
    localStorage.setItem('levelup_stats', JSON.stringify(stats));

    // Ajouter à l'historique
    addToHistory('workout_completed', 'Séance HIIT terminée', {
        calories: 450,
        duration: 45,
        type: 'HIIT'
    });
}

// Gestion de la séance d'entraînement
document.addEventListener('DOMContentLoaded', () => {
    const workoutModal = document.querySelector('.workout-modal');
    const startWorkoutBtn = document.querySelector('.start-workout');
    const pauseWorkoutBtn = document.querySelector('.pause-workout');
    const stopWorkoutBtn = document.querySelector('.stop-workout');
    const timerDisplay = document.querySelector('.timer');
    const progressFill = document.querySelector('.progress-fill');
    const exerciseNameDisplay = document.querySelector('.exercise-name');

    let workoutTimer;
    let seconds = 0;
    let isPaused = false;
    let currentExerciseIndex = 0;

    const exercises = [
        { name: "Échauffement dynamique", duration: 600 }, // 10 minutes
        { name: "Circuit HIIT #1", duration: 900 }, // 15 minutes
        { name: "Circuit HIIT #2", duration: 900 }, // 15 minutes
        { name: "Retour au calme", duration: 300 } // 5 minutes
    ];

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateTimer() {
        if (!isPaused) {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
            
            const currentExercise = exercises[currentExerciseIndex];
            const progress = (seconds % currentExercise.duration) / currentExercise.duration * 100;
            progressFill.style.width = `${progress}%`;

            if (seconds % currentExercise.duration === 0) {
                currentExerciseIndex++;
                if (currentExerciseIndex < exercises.length) {
                    exerciseNameDisplay.textContent = exercises[currentExerciseIndex].name;
                    seconds = 0;
                } else {
                    completeWorkout();
                }
            }
        }
    }

    function startWorkout() {
        workoutModal.classList.add('visible');
        currentExerciseIndex = 0;
        seconds = 0;
        exerciseNameDisplay.textContent = exercises[currentExerciseIndex].name;
        workoutTimer = setInterval(updateTimer, 1000);
    }

    function pauseWorkout() {
        isPaused = !isPaused;
        pauseWorkoutBtn.innerHTML = isPaused ? 
            '<i class="fas fa-play"></i> Reprendre' : 
            '<i class="fas fa-pause"></i> Pause';
    }

    function stopWorkout() {
        clearInterval(workoutTimer);
        workoutModal.classList.remove('visible');
        seconds = 0;
        isPaused = false;
        currentExerciseIndex = 0;
        progressFill.style.width = '0%';
    }

    function completeWorkout() {
        clearInterval(workoutTimer);
        const modalContent = workoutModal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="workout-complete">
                <i class="fas fa-check-circle"></i>
                <h4>Séance terminée !</h4>
                <p>Félicitations, vous avez terminé votre séance d'entraînement.</p>
                <div class="workout-stats">
                    <div class="stat">
                        <span class="stat-label">Durée totale</span>
                        <span class="stat-value">45:00</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Calories brûlées</span>
                        <span class="stat-value">450</span>
                    </div>
                </div>
                <button class="btn-primary close-modal">Terminer</button>
            </div>
        `;

        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            workoutModal.classList.remove('visible');
            location.reload(); // Recharge la page pour réinitialiser l'interface
        });
    }

    startWorkoutBtn.addEventListener('click', startWorkout);
    pauseWorkoutBtn.addEventListener('click', pauseWorkout);
    stopWorkoutBtn.addEventListener('click', stopWorkout);
}); 

// Gestion des détails des exercices
document.addEventListener('DOMContentLoaded', function() {
    const exerciseHeaders = document.querySelectorAll('.exercise-header');
    
    exerciseHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Empêcher la propagation si on clique sur le bouton vidéo
            if (e.target.closest('.show-video')) {
                e.stopPropagation();
                return;
            }
            
            // Trouver les détails associés à cet exercice
            const details = this.previousElementSibling;
            
            // Fermer tous les autres détails
            document.querySelectorAll('.exercise-details').forEach(detail => {
                if (detail !== details) {
                    detail.classList.remove('visible');
                }
            });
            
            // Basculer la visibilité des détails actuels
            details.classList.toggle('visible');
        });
    });
    
    // Empêcher la fermeture des détails lors du clic sur le bouton vidéo
    const videoButtons = document.querySelectorAll('.show-video');
    videoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Logique pour afficher la vidéo...
        });
    });
});

// Configuration de la modale vidéo
const videoModal = document.createElement('div');
videoModal.className = 'modal video-modal';

// Base de données des vidéos de démonstration
const exerciseVideos = {
    'warmup': {
        'marche-rapide': 'https://www.youtube.com/embed/HiruV6NOxZw',
        'rotations-bras': 'https://www.youtube.com/embed/139pV9pXqqk',
        'jumping-jacks': 'https://www.youtube.com/embed/c4DAnQ6DtF8',
        'rotations-bassin': 'https://www.youtube.com/embed/66RJz0PXwVk',
        'montees-genoux': 'https://www.youtube.com/embed/8opcm4D0QJc',
        'etirements-dynamiques': 'https://www.youtube.com/embed/nPHfEnZD1Wk'
    },
    'hiit1': {
        'burpees': 'https://www.youtube.com/embed/TU8QYVW0gDU',
        'mountain-climbers': 'https://www.youtube.com/embed/nmwgirgXLYM',
        'squats-sautes': 'https://www.youtube.com/embed/72BSZupb-1I',
        'pompes': 'https://www.youtube.com/embed/IODxDxX7oi4',
        'jumping-jacks': 'https://www.youtube.com/embed/c4DAnQ6DtF8',
        'planche': 'https://www.youtube.com/embed/ASdvN_XEl_c'
    },
    'hiit2': {
        'fentes-sautees': 'https://www.youtube.com/embed/DrI8CfEO4H0',
        'crunchs': 'https://www.youtube.com/embed/Xyd_fa5zoEU',
        'high-knees': 'https://www.youtube.com/embed/ZZZoCNMU48U',
        'dips': 'https://www.youtube.com/embed/2z8JmcrW-As',
        'jump-rope': 'https://www.youtube.com/embed/u3zgHI8QnqE',
        'superman': 'https://www.youtube.com/embed/z6PJMT2y8GQ'
    },
    'cooldown': {
        'marche-lente': 'https://www.youtube.com/embed/HiruV6NOxZw',
        'etirements-quadriceps': 'https://www.youtube.com/embed/6jVJi7qwpfY',
        'etirements-ischio': 'https://www.youtube.com/embed/FDwpEdxZ4H4',
        'etirements-epaules': 'https://www.youtube.com/embed/bP2XL6ebUeM',
        'relaxation': 'https://www.youtube.com/embed/0H2L4KNGRqI'
    }
};

videoModal.innerHTML = `
    <div class="modal-content">
        <h3>Démonstrations des exercices</h3>
        <div class="video-container">
            <div class="video-list"></div>
        </div>
        <button class="btn-primary close-video">Fermer</button>
    </div>
`;
document.body.appendChild(videoModal);

// Gestionnaire pour les boutons de vidéo
document.querySelectorAll('.show-video').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const exerciseType = button.closest('.exercise-item').dataset.exercise;
        const videos = exerciseVideos[exerciseType];
        const videoList = videoModal.querySelector('.video-list');
        
        // Vide la liste des vidéos précédentes
        videoList.innerHTML = '';
        
        // Ajoute les vidéos pour cet exercice
        Object.entries(videos).forEach(([name, url]) => {
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-item';
            videoWrapper.innerHTML = `
                <h4>${formatExerciseName(name)}</h4>
                <div class="video-frame">
                    <iframe 
                        width="100%" 
                        height="200" 
                        src="${url}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            videoList.appendChild(videoWrapper);
        });
        
        videoModal.classList.add('visible');
    });
});

// Fonction pour formater le nom de l'exercice
function formatExerciseName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Fermeture de la modale vidéo
const closeVideoBtn = videoModal.querySelector('.close-video');
closeVideoBtn.addEventListener('click', () => {
    videoModal.classList.remove('visible');
    // Arrête toutes les vidéos en cours
    videoModal.querySelectorAll('iframe').forEach(iframe => {
        iframe.src = iframe.src;
    });
}); 

// Gestion du bouton "Séance terminée"
document.addEventListener('DOMContentLoaded', function() {
    const completeWorkoutButton = document.querySelector('.workout-list + .btn-primary');
    if (completeWorkoutButton) {
        completeWorkoutButton.addEventListener('click', function() {
            const message = `Confirmez-vous avoir terminé votre séance d'aujourd'hui ?
            
• Échauffement dynamique - 10 min
• Circuit HIIT #1 - 15 min
• Circuit HIIT #2 - 15 min
• Retour au calme - 5 min

Cela validera votre séance et mettra à jour vos statistiques.`;

            if (confirm(message)) {
                // Mise à jour des statistiques
                const statsElement = document.querySelector('.stat-value:nth-child(2)');
                if (statsElement) {
                    const [completed, total] = statsElement.textContent.split('/');
                    const newCompleted = parseInt(completed) + 1;
                    statsElement.textContent = `${newCompleted}/${total}`;
                }

                // Mise à jour des calories
                const caloriesElement = document.querySelector('.stat-value:last-child');
                if (caloriesElement) {
                    const currentCalories = parseInt(caloriesElement.textContent.replace(',', ''));
                    const newCalories = currentCalories + 400; // 400 calories estimées pour la séance HIIT
                    caloriesElement.textContent = newCalories.toLocaleString();
                }

                // Ajout de l'activité dans la liste des activités récentes
                const activityList = document.querySelector('.activity-list');
                if (activityList) {
                    const newActivity = document.createElement('div');
                    newActivity.className = 'activity-item';
                    newActivity.innerHTML = `
                        <div class="activity-icon workout">
                            <i class="fas fa-dumbbell"></i>
                        </div>
                        <div class="activity-details">
                            <h3>HIIT Training</h3>
                            <p>45min • Séance complétée</p>
                            <span class="activity-time">Aujourd'hui ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</span>
                        </div>
                        <div class="activity-stats">
                            <span><i class="fas fa-fire"></i> 400 kcal</span>
                        </div>
                    `;
                    activityList.insertBefore(newActivity, activityList.firstChild);
                }

                // Désactivation du bouton
                completeWorkoutButton.disabled = true;
                completeWorkoutButton.style.opacity = '0.5';
                completeWorkoutButton.innerHTML = '<i class="fas fa-check"></i> Séance terminée !';

                // Message de félicitations
                alert('Félicitations ! Vous avez terminé votre séance d\'entraînement. 💪');
            }
        });
    }
}); 