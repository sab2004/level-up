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

    // Gestion du bouton "Séance terminée"
    const completeWorkoutBtn = document.querySelector('.program-card .btn-primary');
    
    if (completeWorkoutBtn) {
        completeWorkoutBtn.addEventListener('click', () => {
            // Mettre à jour les statistiques
            const stats = JSON.parse(localStorage.getItem('levelup_stats') || '{}');
            stats.calories_burned = (stats.calories_burned || 0) + 450;
            stats.workouts_completed = (stats.workouts_completed || 0) + 1;
            localStorage.setItem('levelup_stats', JSON.stringify(stats));

            // Mettre à jour l'affichage des statistiques
            const caloriesElement = document.querySelector('.progress-stats .stat:last-child .stat-value');
            const sessionsElement = document.querySelector('.progress-stats .stat:nth-child(2) .stat-value');
            
            if (caloriesElement) {
                caloriesElement.textContent = `${stats.calories_burned} kcal`;
            }
            if (sessionsElement) {
                sessionsElement.textContent = `${stats.workouts_completed}`;
            }

            // Générer une nouvelle séance
            generateNextWorkout();

            // Afficher un message de félicitations
            alert('Félicitations ! Vous avez terminé votre séance. Une nouvelle séance a été générée.');
        });
    }

    const workoutModal = document.querySelector('.workout-modal');
    const startWorkoutBtn = document.querySelector('.start-workout');
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
    const form = document.getElementById('inscription-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
            e.preventDefault();
        console.log('Formulaire soumis');

        try {
            // Vérification des mots de passe
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            // Collecte des données du formulaire
            const formData = {
                informationsGenerales: {
                nom: document.getElementById('nom').value,
                    prenom: document.getElementById('prenom').value,
                    email: document.getElementById('email').value,
                    password: password, // Stockage sécurisé à implémenter
                age: parseInt(document.getElementById('age').value),
                    sexe: document.querySelector('input[name="sexe"]:checked').value,
                poids: parseFloat(document.getElementById('poids').value),
                    taille: parseInt(document.getElementById('taille').value),
                    antecedentsMedicaux: {
                        present: document.querySelector('input[name="antecedents"]:checked').value === 'oui',
                        details: document.getElementById('antecedents-details').value
                    }
                },
                objectifsFitness: {
                    objectifsPrincipaux: Array.from(document.querySelectorAll('input[name="objectifs"]:checked')).map(cb => cb.value),
                    autreObjectif: document.getElementById('autre-objectif').value,
                    experience: document.querySelector('input[name="experience"]:checked').value,
                    frequenceEntrainement: document.querySelector('input[name="frequence"]:checked').value,
                    typesEntrainement: Array.from(document.querySelectorAll('input[name="type-entrainement"]:checked')).map(cb => cb.value),
                    autreTypeEntrainement: document.getElementById('autre-type').value,
                    exercicesNonAimes: document.getElementById('exercices-non-aimes').value
                },
                regimeAlimentaire: {
                    type: document.querySelector('input[name="regime"]:checked').value,
                    autreRegime: document.getElementById('autre-regime').value,
                    allergies: {
                        present: document.querySelector('input[name="allergies"]:checked').value === 'oui',
                        details: document.getElementById('allergies-details').value
                    },
                    nombreRepas: document.querySelector('input[name="nb-repas"]:checked').value,
                    autreNombreRepas: document.getElementById('autre-nb-repas').value,
                    preferencesAlimentaires: document.getElementById('preferences-alimentaires').value,
                    objectifNutritionnel: document.querySelector('input[name="objectif-nutritionnel"]:checked').value,
                    autreObjectifNutritionnel: document.getElementById('autre-obj-nutri').value
                },
                habitudesVie: {
                    niveauActivite: document.querySelector('input[name="niveau-activite"]:checked').value,
                    horairesFlexibles: document.querySelector('input[name="horaires-flexibles"]:checked').value === 'oui',
                    contraintesHoraires: document.getElementById('contraintes-horaires').value
                },
                motivationSuivi: {
                    raisonInscription: document.querySelector('input[name="motivation"]:checked').value,
                    autreMotivation: document.getElementById('autre-motivation').value,
                    suiviProgres: {
                        souhaite: document.querySelector('input[name="suivi"]:checked').value === 'oui',
                        frequence: document.getElementById('frequence-suivi').value
                    },
                    conseilsSupplementaires: document.querySelector('input[name="conseils-supplementaires"]:checked').value === 'oui'
                },
                commentaires: {
                    attentes: document.getElementById('attentes').value
                },
                preferences: {
                    newsletter: document.getElementById('newsletter').checked
                }
            };

            console.log('Données du formulaire collectées:', formData);

            // Générer le plan personnalisé
            const planPersonnalise = genererPlanPersonnalise(formData);
            console.log('Plan personnalisé généré:', planPersonnalise);

            // Stocker les données dans le localStorage
            localStorage.setItem('levelup_profile', JSON.stringify(formData));
            localStorage.setItem('levelup_plan', JSON.stringify(planPersonnalise));
            
            // Rediriger vers le tableau de bord
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Erreur lors du traitement du formulaire:', error);
            alert('Une erreur est survenue lors de l\'inscription. Veuillez vérifier tous les champs obligatoires.');
    }
    });
});

// Fonction pour générer un programme personnalisé basé sur l'IA
async function genererProgrammePersonnalise(profil) {
    // Analyse des données du profil
    const programme = {
        objectif_poids: calculerObjectifPoids(profil),
        calories_journalieres: calculerCaloriesJournalieres(profil),
        seances_hebdomadaires: determinerFrequenceEntrainement(profil),
        exercices_recommandes: selectionnerExercices(profil),
        progression_prevue: planifierProgression(profil),
        adaptations_specifiques: genererAdaptations(profil)
    };

    return programme;
}

// Fonctions d'analyse et de calcul pour le programme personnalisé
function calculerObjectifPoids(profil) {
    let objectifPoids = profil.poids;
    const imc = calculerIMC(profil.poids, profil.taille);
    
    if (profil.objectif_principal === 'prise_de_muscle') {
        // Calcul basé sur la structure corporelle et l'expérience
        const potentielMusculation = evaluerPotentielMusculation(profil);
        const imcCible = determinerIMCCible(profil, potentielMusculation);
        objectifPoids = Math.round((imcCible * (profil.taille/100) * (profil.taille/100)) * 10) / 10;
    } else if (profil.objectif_principal === 'perte_de_poids') {
        // Calcul progressif et sain de la perte de poids
        const tauxPertePoids = determinerTauxPertePoids(profil);
        objectifPoids = Math.max(
            calculerPoidsMinimumSain(profil),
            profil.poids * (1 - tauxPertePoids)
        );
    }

    return objectifPoids;
}

function calculerCaloriesJournalieres(profil) {
    const bmr = calculerBMR(profil.poids, profil.taille, profil.age, profil.sexe);
    const tdee = calculerTDEE(bmr, profil.niveau_activite);
    
    // Ajuster selon l'objectif
    let calories = tdee;
    if (profil.objectif_principal === 'prise_de_muscle') {
        calories += 300; // Surplus calorique pour la prise de muscle
    } else if (profil.objectif_principal === 'perte_de_poids') {
        calories -= 500; // Déficit calorique pour la perte de poids
    }
    
    return Math.round(calories);
}

function determinerFrequenceEntrainement(profil) {
    // Basé sur l'expérience, la disponibilité et l'objectif
    let frequenceBase = profil.frequence_entrainement;
    
    // Ajuster selon l'expérience
    if (profil.experience_musculation === 'debutant') {
        frequenceBase = Math.min(frequenceBase, 3);
    } else if (profil.experience_musculation === 'intermediaire') {
        frequenceBase = Math.min(frequenceBase, 4);
    }
    
    return frequenceBase;
}

function selectionnerExercices(profil) {
    const exercices = [];
    
    // Sélectionner les exercices en fonction du niveau et des limitations
    if (profil.limitations_physiques) {
        exercices.push(...selectionnerExercicesAdaptes(profil.limitations_physiques));
    }
    
    // Ajouter des exercices selon l'objectif et l'expérience
    exercices.push(...selectionnerExercicesParObjectif(profil));
    
    return exercices;
}

function planifierProgression(profil) {
    return {
        etapes: genererEtapesProgression(profil),
        duree_estimee: estimerDureeObjectif(profil),
        points_controle: definirPointsControle(profil)
    };
}

function genererAdaptations(profil) {
    return {
        modifications_exercices: adapterExercicesSelonLimitations(profil),
        ajustements_intensite: calculerIntensiteOptimale(profil),
        recommandations_specifiques: genererRecommandationsPersonnalisees(profil)
    };
}

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
                
                // Calculer le poids perdu (différence entre le premier et le dernier poids)
                if (weightHistory.length > 1) {
                    const firstWeight = weightHistory[0].weight;
                    const weightLost = (firstWeight - weight).toFixed(1);
                    const weightLostElement = document.querySelector('.progress-stats [data-stat-type="weight-lost"] .stat-value');
                    if (weightLostElement) {
                        weightLostElement.textContent = `${weightLost} kg`;
                    }
                }
                
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
        <button type="button" class="btn-primary close-workout">Terminer</button>
    `;

    modal.querySelector('.close-workout').addEventListener('click', () => {
            // Mettre à jour les statistiques
            const stats = JSON.parse(localStorage.getItem('levelup_stats') || '{}');
            stats.calories_burned = (stats.calories_burned || 0) + 450;
            stats.workouts_completed = (stats.workouts_completed || 0) + 1;
            localStorage.setItem('levelup_stats', JSON.stringify(stats));

            // Mettre à jour l'affichage des statistiques
            const caloriesElement = document.querySelector('.progress-stats .stat:last-child .stat-value');
            const sessionsElement = document.querySelector('.progress-stats .stat:nth-child(2) .stat-value');
            
            if (caloriesElement) {
                caloriesElement.textContent = `${stats.calories_burned} kcal`;
            }
            if (sessionsElement) {
                sessionsElement.textContent = `${stats.workouts_completed}`;
            }

        // Fermer la modale
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);

            // Générer une nouvelle séance
            generateNextWorkout();

            // Afficher un message de félicitations
            alert('Félicitations ! Vous avez terminé votre séance. Une nouvelle séance a été générée.');
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
                <button type="button" class="btn-primary close-modal">Terminer</button>
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
document.addEventListener('DOMContentLoaded', () => {
    const exerciseHeaders = document.querySelectorAll('.exercise-header');
    
    exerciseHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const details = this.parentElement.querySelector('.exercise-details');
            
            // Fermer tous les autres détails
            document.querySelectorAll('.exercise-details').forEach(detail => {
                if (detail !== details) {
                    detail.classList.remove('visible');
                }
            });
            
            // Basculer la visibilité des détails actuels
            if (details) {
                details.classList.toggle('visible');
            }
        });
    });
});

// Fonction pour convertir un nom d'exercice en ID
function convertToId(name) {
    return name.toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[ùû]/g, 'u')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Fonction pour formater le nom de l'exercice
function formatExerciseName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Fonction pour générer une nouvelle séance
function generateNextWorkout() {
    const workoutTypes = [
        {
            type: 'HIIT',
            duration: 45,
            exercises: [
                {
                    name: 'Échauffement dynamique',
                    duration: 10,
                    details: [
                        { name: 'Marche rapide sur place', duration: '2 min' },
                        { name: 'Rotations des bras', duration: '1 min' },
                        { name: 'Jumping jacks légers', duration: '2 min' },
                        { name: 'Rotations du bassin', duration: '1 min' },
                        { name: 'Montées de genoux', duration: '2 min' },
                        { name: 'Étirements dynamiques', duration: '2 min' }
                    ]
                },
                {
                    name: 'Circuit HIIT #1',
                    duration: 15,
                    details: [
                        { name: 'Burpees', duration: '30 sec' },
                        { name: 'Mountain climbers', duration: '30 sec' },
                        { name: 'Squats sautés', duration: '30 sec' },
                        { name: 'Pompes', duration: '30 sec' },
                        { name: 'Jumping jacks', duration: '30 sec' },
                        { name: 'Planche', duration: '30 sec' }
                    ]
                },
                {
                    name: 'Circuit HIIT #2',
                    duration: 15,
                    details: [
                        { name: 'Fentes sautées alternées', duration: '30 sec' },
                        { name: 'Crunchs', duration: '30 sec' },
                        { name: 'High knees', duration: '30 sec' },
                        { name: 'Dips sur chaise', duration: '30 sec' },
                        { name: 'Jump rope', duration: '30 sec' },
                        { name: 'Superman', duration: '30 sec' }
                    ]
                },
                { 
                    name: 'Retour au calme',
                    duration: 5,
                    details: [
                        { name: 'Marche lente sur place', duration: '1 min' },
                        { name: 'Étirements des quadriceps', duration: '1 min' },
                        { name: 'Étirements des ischio-jambiers', duration: '1 min' },
                        { name: 'Étirements des épaules et du dos', duration: '1 min' },
                        { name: 'Respiration profonde et relaxation', duration: '1 min' }
                    ]
                }
            ]
        },
        {
            type: 'Cardio',
            duration: 45,
            exercises: [
                {
                    name: 'Échauffement progressif',
                    duration: 10,
                    details: [
                        { name: 'Marche rapide', duration: '3 min' },
                        { name: 'Jogging léger', duration: '3 min' },
                        { name: 'Course modérée', duration: '2 min' },
                        { name: 'Étirements dynamiques', duration: '2 min' }
                    ]
                },
                {
                    name: 'Cardio intensif',
                    duration: 30,
                    details: [
                        { name: 'Course intensive', duration: '5 min' },
                        { name: 'Marche récupération', duration: '2 min' },
                        { name: 'Course intensive', duration: '5 min' },
                        { name: 'Marche récupération', duration: '2 min' },
                        { name: 'Course intensive', duration: '5 min' },
                        { name: 'Marche récupération', duration: '2 min' },
                        { name: 'Course intensive', duration: '5 min' },
                        { name: 'Marche récupération', duration: '4 min' }
                    ]
                },
                {
                    name: 'Retour au calme',
                    duration: 5,
                    details: [
                        { name: 'Marche lente', duration: '2 min' },
                        { name: 'Étirements des mollets', duration: '1 min' },
                        { name: 'Étirements des quadriceps', duration: '1 min' },
                        { name: 'Respiration et relaxation', duration: '1 min' }
                    ]
                }
            ]
        },
        {
            type: 'Yoga Fitness',
            duration: 45,
            exercises: [
                {
                    name: 'Échauffement et respiration',
                    duration: 10,
                    details: [
                        { name: 'Respiration profonde en position assise', duration: '2 min' },
                        { name: 'Salutation au soleil modifiée', duration: '3 min' },
                        { name: 'Étirements du cou et des épaules', duration: '2 min' },
                        { name: 'Rotations douces de la colonne', duration: '3 min' }
                    ]
                },
                {
                    name: 'Renforcement du corps',
                    duration: 15,
                    details: [
                        { name: 'Posture du guerrier 1', duration: '2 min' },
                        { name: 'Chien tête en bas', duration: '2 min' },
                        { name: 'Planche et variations', duration: '3 min' },
                        { name: 'Posture de la chaise', duration: '2 min' },
                        { name: 'Équilibre sur une jambe', duration: '3 min' },
                        { name: 'Posture du cobra', duration: '3 min' }
                    ]
                },
                {
                    name: 'Flow dynamique',
                    duration: 15,
                    details: [
                        { name: 'Enchaînement de postures debout', duration: '3 min' },
                        { name: 'Séquence de force abdominale', duration: '3 min' },
                        { name: 'Flow vinyasa modifié', duration: '3 min' },
                        { name: 'Équilibres et torsions', duration: '3 min' },
                        { name: 'Postures d\'ouverture des hanches', duration: '3 min' }
                    ]
                },
                {
                    name: 'Relaxation finale',
                    duration: 5,
                    details: [
                        { name: 'Étirements profonds', duration: '2 min' },
                        { name: 'Posture de l\'enfant', duration: '1 min' },
                        { name: 'Savasana avec respiration guidée', duration: '2 min' }
                    ]
                }
            ]
        }
    ];

    // Récupérer la dernière séance effectuée
    const lastWorkout = localStorage.getItem('last_workout_type') || 'Yoga Fitness';
    
    // Définir l'ordre de rotation des séances
    const workoutOrder = ['HIIT', 'Cardio', 'Yoga Fitness'];
    const currentIndex = workoutOrder.indexOf(lastWorkout);
    const nextIndex = (currentIndex + 1) % workoutOrder.length;
    const nextWorkoutType = workoutOrder[nextIndex];
    
    // Sélectionner la prochaine séance
    const nextWorkout = workoutTypes.find(workout => workout.type === nextWorkoutType);
    
    // Sauvegarder le type de la nouvelle séance
    localStorage.setItem('last_workout_type', nextWorkout.type);
    
    // Mettre à jour l'affichage
    const workoutTypeElement = document.querySelector('.workout-type span');
    workoutTypeElement.textContent = `${nextWorkout.type} - ${nextWorkout.duration} minutes`;
    
    // Mettre à jour la liste des exercices
    const exerciseList = document.querySelector('.exercise-list');
    exerciseList.innerHTML = nextWorkout.exercises.map(exercise => `
        <li class="exercise-item" data-exercise="${exercise.name.toLowerCase()}">
            <div class="exercise-header">
                <span class="exercise-name">${exercise.name}</span>
                <span class="exercise-duration">${exercise.duration} min</span>
            </div>
            <div class="exercise-details">
                <h3>${exercise.name}</h3>
                <div class="exercise-description">
                    <p>Durée : ${exercise.duration} minutes</p>
                </div>
                <ul class="exercise-steps">
                    ${exercise.details.map(step => `
                        <li>
                            <div class="step-name">${step.name}</div>
                            <div class="step-duration">${step.duration}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </li>
    `).join('');

    // Ajouter les gestionnaires d'événements pour les exercices
    document.querySelectorAll('.exercise-item').forEach(item => {
        const header = item.querySelector('.exercise-header');
        const details = item.querySelector('.exercise-details');
        
        if (header) {
            header.addEventListener('click', () => {
                // Fermer tous les autres détails d'exercice
                document.querySelectorAll('.exercise-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherDetails = otherItem.querySelector('.exercise-details');
                        if (otherDetails) {
                            otherDetails.classList.remove('visible');
                        }
                    }
                });
                
                // Basculer la visibilité des détails de l'exercice cliqué
                if (details) {
                    details.classList.toggle('visible');
                }
            });
        }
    });
}

// Calcul et affichage des analyses du profil
function updateProfileAnalysis() {
    // Récupérer les données du profil
    const profile = JSON.parse(localStorage.getItem('levelup_profile') || '{}');
    
    if (!profile.poids || !profile.taille) {
        return; // Sortir si les données essentielles ne sont pas disponibles
    }

    // Calculer l'IMC
    const imc = calculateBMI(profile.poids, profile.taille);
    document.getElementById('bmi-value').textContent = imc.toFixed(1);
    
    // Interpréter l'IMC
    const interpretation = interpretBMI(imc);
    document.getElementById('bmi-interpretation').textContent = interpretation;
    
    // Calculer le métabolisme de base (formule de Mifflin-St Jeor)
    const bmr = calculateBMR(profile.poids, profile.taille, profile.age, profile.sexe);
    document.getElementById('bmr-value').textContent = Math.round(bmr);
    
    // Calculer les besoins caloriques journaliers
    const tdee = calculateTDEE(bmr, profile.niveau_activite);
    document.getElementById('tdee-value').textContent = Math.round(tdee);
    
    // Calculer l'objectif de poids en fonction de l'IMC et de l'objectif
    let objectifPoids = profile.poids; // Par défaut, maintien du poids actuel
    let message = "";

    if (profile.objectif_principal === 'prise_de_muscle') {
        // Pour la prise de muscle, on vise un IMC entre 22 et 25 selon la taille
        const imcCible = 23.5; // IMC idéal pour un physique athlétique
        objectifPoids = Math.round((imcCible * (profile.taille/100) * (profile.taille/100)) * 10) / 10;
        message = "Poids à gagner";
    } else if (profile.objectif_principal === 'perte_de_poids') {
        if (imc > 25) {
            // Pour les personnes en surpoids, viser un IMC de 24
            objectifPoids = Math.round((24 * (profile.taille/100) * (profile.taille/100)) * 10) / 10;
            message = "Poids à perdre";
        } else if (imc > 18.5) {
            // Pour les personnes de poids normal, viser -2kg
            objectifPoids = Math.round((profile.poids - 2) * 10) / 10;
            message = "Poids à perdre";
        }
    }

    // Afficher l'objectif de poids
    document.getElementById('target-weight').textContent = objectifPoids;
    const difference = Math.abs(profile.poids - objectifPoids);
    document.getElementById('weight-to-lose').innerHTML = 
        `<span>${message} : ${difference.toFixed(1)} kg</span>`;
    
    // Générer les recommandations
    const recommendations = generateRecommendations(profile, imc, tdee);
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

// Calcul de l'IMC
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// Interprétation de l'IMC
function interpretBMI(bmi) {
    if (bmi < 18.5) return "Poids insuffisant";
    if (bmi < 25) return "Poids normal";
    if (bmi < 30) return "Surpoids";
    return "Obésité";
}

// Calcul du métabolisme de base
function calculateBMR(weight, height, age, gender) {
    if (gender === 'homme') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

// Calcul des besoins caloriques journaliers
function calculateTDEE(bmr, activityLevel) {
    const activityFactors = {
        sedentaire: 1.2,
        leger: 1.375,
        modere: 1.55,
        actif: 1.725,
        tres_actif: 1.9
    };
    return bmr * (activityFactors[activityLevel] || 1.2);
}

// Génération des recommandations personnalisées
function generateRecommendations(profile, imc, tdee) {
    const recommendations = [];
    
    // Recommandations basées sur l'IMC
    if (imc < 18.5) {
        recommendations.push("Augmentez progressivement votre apport calorique quotidien");
        recommendations.push("Concentrez-vous sur des aliments riches en protéines et en nutriments");
    } else if (imc >= 25) {
        recommendations.push("Créez un déficit calorique modéré de 500 kcal par jour");
        recommendations.push("Privilégiez les aliments peu caloriques et riches en fibres");
    }
    
    // Recommandations basées sur le niveau d'activité
    if (profile.niveau_activite === 'sedentaire') {
        recommendations.push("Augmentez progressivement votre activité physique quotidienne");
        recommendations.push("Commencez par 15-30 minutes de marche par jour");
    }
    
    // Recommandations générales
    recommendations.push("Buvez au moins 2L d'eau par jour");
    recommendations.push("Visez 7-8 heures de sommeil par nuit");
    
    return recommendations;
}

// Mettre à jour l'analyse du profil au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('dashboard.html')) {
        updateProfileAnalysis();
    }
});

// Fonction pour calculer l'IMC
function calculerIMC(poids, taille) {
    const tailleEnMetres = taille / 100;
    return poids / (tailleEnMetres * tailleEnMetres);
}

// Fonction pour interpréter l'IMC
function interpreterIMC(imc) {
    if (imc < 18.5) return "Insuffisance pondérale";
    if (imc < 25) return "Corpulence normale";
    if (imc < 30) return "Surpoids";
    if (imc < 35) return "Obésité modérée";
    if (imc < 40) return "Obésité sévère";
    return "Obésité morbide";
}

// Fonction pour calculer le métabolisme de base (formule de Mifflin-St Jeor)
function calculerMetabolismeBase(poids, taille, age, genre) {
    if (genre === 'homme') {
        return (10 * poids) + (6.25 * taille) - (5 * age) + 5;
    } else {
        return (10 * poids) + (6.25 * taille) - (5 * age) - 161;
    }
}

// Fonction pour calculer les besoins caloriques journaliers
function calculerBesoinsCaloriques(metabolismeBase, niveauActivite) {
    const coefficients = {
        'sedentaire': 1.2,
        'leger': 1.375,
        'modere': 1.55,
        'actif': 1.725,
        'tres_actif': 1.9
    };
    return Math.round(metabolismeBase * coefficients[niveauActivite]);
}

// Fonction pour calculer l'objectif de poids
function calculerObjectifPoids(taille, poids, objectifPrincipal) {
    const imc = calculerIMC(poids, taille);
    let poidsIdeal = 0;
    let message = '';

    if (objectifPrincipal === 'prise_de_muscle') {
        // Pour la prise de muscle, on vise un IMC de 23.5 comme minimum
        const imcCible = 23.5;
        poidsIdeal = Math.round((imcCible * (taille/100) * (taille/100)) * 10) / 10;
        
        if (poids < poidsIdeal) {
            message = `Pour optimiser votre prise de muscle, vous devriez gagner ${(poidsIdeal - poids).toFixed(1)} kg`;
        } else {
            message = "Votre poids actuel est adapté pour la prise de muscle";
        }
    } else if (objectifPrincipal === 'perte_de_poids') {
        // Pour la perte de poids, on vise un IMC de 22 comme maximum
        const imcCible = 22;
        poidsIdeal = Math.round((imcCible * (taille/100) * (taille/100)) * 10) / 10;
        
        if (poids > poidsIdeal) {
            message = `Pour atteindre un poids santé, vous devriez perdre ${(poids - poidsIdeal).toFixed(1)} kg`;
        } else {
            message = "Votre poids actuel est déjà dans la zone santé";
        }
    } else {
        // Pour le maintien ou l'endurance
        const imcCible = 21.7;
        poidsIdeal = Math.round((imcCible * (taille/100) * (taille/100)) * 10) / 10;
        
        if (Math.abs(poids - poidsIdeal) > 2) {
            message = poids > poidsIdeal 
                ? `Pour optimiser vos performances, vous pourriez perdre ${(poids - poidsIdeal).toFixed(1)} kg`
                : `Pour optimiser vos performances, vous pourriez gagner ${(poidsIdeal - poids).toFixed(1)} kg`;
        } else {
            message = "Votre poids actuel est optimal pour votre objectif";
        }
    }

    return {
        poidsIdeal: poidsIdeal,
        message: message
    };
}

// Fonction pour générer des recommandations personnalisées
function genererRecommandations(donnees) {
    const recommandations = [];
    
    // Recommandations basées sur l'IMC
    const imc = calculerIMC(donnees.poids, donnees.taille);
    if (imc < 18.5) {
        recommandations.push("Augmentez progressivement votre apport calorique");
        recommandations.push("Privilégiez les protéines et les glucides complexes");
    } else if (imc > 25) {
        recommandations.push("Créez un déficit calorique modéré");
        recommandations.push("Augmentez votre activité physique quotidienne");
    }

    // Recommandations basées sur l'objectif
    switch (donnees.objectifPrincipal) {
        case 'prise_de_muscle':
            recommandations.push("Concentrez-vous sur les exercices de force");
            recommandations.push("Assurez un apport protéique suffisant (1.6-2.2g/kg)");
            break;
        case 'perte_de_poids':
            recommandations.push("Combinez cardio et musculation");
            recommandations.push("Surveillez votre alimentation sans restrictions excessives");
            break;
        case 'endurance':
            recommandations.push("Développez progressivement votre endurance cardiovasculaire");
            recommandations.push("Hydratez-vous bien pendant l'effort");
            break;
    }

    // Recommandations basées sur le niveau d'activité
    if (donnees.niveauActivite === 'sedentaire') {
        recommandations.push("Augmentez progressivement votre niveau d'activité");
        recommandations.push("Commencez par des exercices de faible intensité");
    }

    // Recommandations basées sur l'expérience
    if (donnees.experienceMusculation === 'debutant') {
        recommandations.push("Concentrez-vous sur la technique avant la charge");
        recommandations.push("Commencez par des exercices basiques composés");
    }

    return recommandations;
}

// Gestionnaire du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscription-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Formulaire soumis');

        try {
        // Collecte des données du formulaire
            const formData = {
                informationsGenerales: {
            nom: document.getElementById('nom').value,
                    prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
                    password: document.getElementById('password').value, // Stockage sécurisé à implémenter
            age: parseInt(document.getElementById('age').value),
                    sexe: document.querySelector('input[name="sexe"]:checked').value,
            poids: parseFloat(document.getElementById('poids').value),
                    taille: parseInt(document.getElementById('taille').value),
                    antecedentsMedicaux: {
                        present: document.querySelector('input[name="antecedents"]:checked').value === 'oui',
                        details: document.getElementById('antecedents-details').value
                    }
                },
                objectifsFitness: {
                    objectifsPrincipaux: Array.from(document.querySelectorAll('input[name="objectifs"]:checked')).map(cb => cb.value),
                    autreObjectif: document.getElementById('autre-objectif').value,
                    experience: document.querySelector('input[name="experience"]:checked').value,
                    frequenceEntrainement: document.querySelector('input[name="frequence"]:checked').value,
                    typesEntrainement: Array.from(document.querySelectorAll('input[name="type-entrainement"]:checked')).map(cb => cb.value),
                    autreTypeEntrainement: document.getElementById('autre-type').value,
                    exercicesNonAimes: document.getElementById('exercices-non-aimes').value
                },
                regimeAlimentaire: {
                    type: document.querySelector('input[name="regime"]:checked').value,
                    autreRegime: document.getElementById('autre-regime').value,
                    allergies: {
                        present: document.querySelector('input[name="allergies"]:checked').value === 'oui',
                        details: document.getElementById('allergies-details').value
                    },
                    nombreRepas: document.querySelector('input[name="nb-repas"]:checked').value,
                    autreNombreRepas: document.getElementById('autre-nb-repas').value,
                    preferencesAlimentaires: document.getElementById('preferences-alimentaires').value,
                    objectifNutritionnel: document.querySelector('input[name="objectif-nutritionnel"]:checked').value,
                    autreObjectifNutritionnel: document.getElementById('autre-obj-nutri').value
                },
                habitudesVie: {
                    niveauActivite: document.querySelector('input[name="niveau-activite"]:checked').value,
                    horairesFlexibles: document.querySelector('input[name="horaires-flexibles"]:checked').value === 'oui',
                    contraintesHoraires: document.getElementById('contraintes-horaires').value
                },
                motivationSuivi: {
                    raisonInscription: document.querySelector('input[name="motivation"]:checked').value,
                    autreMotivation: document.getElementById('autre-motivation').value,
                    suiviProgres: {
                        souhaite: document.querySelector('input[name="suivi"]:checked').value === 'oui',
                        frequence: document.getElementById('frequence-suivi').value
                    },
                    conseilsSupplementaires: document.querySelector('input[name="conseils-supplementaires"]:checked').value === 'oui'
                },
                commentaires: {
                    attentes: document.getElementById('attentes').value
                },
                preferences: {
                    newsletter: document.getElementById('newsletter').checked
                }
            };

            console.log('Données du formulaire collectées:', formData);

            // Générer le plan personnalisé
            const planPersonnalise = genererPlanPersonnalise(formData);
            console.log('Plan personnalisé généré:', planPersonnalise);

            // Stocker les données dans le localStorage
            localStorage.setItem('levelup_profile', JSON.stringify(formData));
            localStorage.setItem('levelup_plan', JSON.stringify(planPersonnalise));

            // Rediriger vers le tableau de bord
        window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Erreur lors du traitement du formulaire:', error);
            alert('Une erreur est survenue lors de l\'inscription. Veuillez vérifier tous les champs obligatoires.');
        }
    });
});

function genererExercicesPersonnalises(objectifs, experience, typesEntrainement) {
    const exercices = {
        debutant: {
            musculation: [
                { nom: 'Pompes sur genoux', series: '3', repetitions: '10-12' },
                { nom: 'Squats simples', series: '3', repetitions: '12-15' },
                { nom: 'Fentes statiques', series: '2', repetitions: '10 par jambe' },
                { nom: 'Crunchs', series: '3', repetitions: '15' }
            ],
            cardio: [
                { nom: 'Marche rapide', duree: '20-30 minutes', intensite: 'modérée' },
                { nom: 'Vélo stationnaire', duree: '15-20 minutes', intensite: 'faible à modérée' }
            ],
            hiit: [
                { nom: 'Jumping jacks', duree: '30 secondes', repos: '30 secondes' },
                { nom: 'Mountain climbers', duree: '30 secondes', repos: '30 secondes' }
            ]
        },
        intermediaire: {
            musculation: [
                { nom: 'Pompes classiques', series: '4', repetitions: '12-15' },
                { nom: 'Squats avec haltères', series: '4', repetitions: '10-12' },
                { nom: 'Soulevé de terre roumain', series: '3', repetitions: '12' },
                { nom: 'Développé épaules', series: '3', repetitions: '12' }
            ],
            cardio: [
                { nom: 'Course à pied', duree: '30-40 minutes', intensite: 'modérée à élevée' },
                { nom: 'Rameur', duree: '20-25 minutes', intensite: 'modérée' }
            ],
            hiit: [
                { nom: 'Burpees', duree: '40 secondes', repos: '20 secondes' },
                { nom: 'Sprint sur place', duree: '40 secondes', repos: '20 secondes' }
            ]
        },
        avance: {
            musculation: [
                { nom: 'Pompes diamant', series: '4', repetitions: '15-20' },
                { nom: 'Squats sautés', series: '4', repetitions: '15' },
                { nom: 'Tractions', series: '4', repetitions: '8-10' },
                { nom: 'Dips', series: '4', repetitions: '12-15' }
            ],
            cardio: [
                { nom: 'Intervals sprint', duree: '30-40 minutes', intensite: 'élevée' },
                { nom: 'Circuit training', duree: '45 minutes', intensite: 'très élevée' }
            ],
            hiit: [
                { nom: 'Burpees avec pompe', duree: '45 secondes', repos: '15 secondes' },
                { nom: 'Box jumps', duree: '45 secondes', repos: '15 secondes' }
            ]
        }
    };

    const planExercices = [];
    const niveau = experience;
    
    if (objectifs.includes('gain_muscle')) {
        planExercices.push(...exercices[niveau].musculation);
        if (typesEntrainement.includes('cardio')) {
            planExercices.push(exercices[niveau].cardio[0]);
        }
    } else if (objectifs.includes('perte_poids')) {
        if (typesEntrainement.includes('hiit')) {
            planExercices.push(...exercices[niveau].hiit);
        }
        planExercices.push(...exercices[niveau].cardio.slice(0, 2));
        planExercices.push(...exercices[niveau].musculation.slice(0, 2));
    } else {
        // Pour l'amélioration de la condition physique générale
        planExercices.push(...exercices[niveau].musculation.slice(0, 2));
        planExercices.push(exercices[niveau].cardio[0]);
        if (typesEntrainement.includes('hiit')) {
            planExercices.push(exercices[niveau].hiit[0]);
        }
    }

    return planExercices;
}

// Mise à jour de la fonction genererPlanPersonnalise
function genererPlanPersonnalise(formData) {
    const plan = {
        sportif: {
            frequence: '',
            typesEntrainement: [],
            exercices: [],
            dureeSeances: '',
            intensite: '',
            recommandations: []
        },
        nutritionnel: {
            nombreRepas: '',
            repartitionMacros: {},
            alimentsRecommandes: [],
            alimentsAEviter: [],
            apportCalorique: '',
            recommandations: []
        }
    };

    // Analyse de l'objectif principal
    const objectifs = formData.objectifsFitness.objectifsPrincipaux;
    const experience = formData.objectifsFitness.experience;
    const niveauActivite = formData.habitudesVie.niveauActivite;
    
    // Détermination de la fréquence d'entraînement
    switch(formData.objectifsFitness.frequenceEntrainement) {
        case '1-2':
            plan.sportif.frequence = 'Programme adapté pour 2 séances par semaine';
            plan.sportif.dureeSeances = '45-60 minutes';
            break;
        case '3-4':
            plan.sportif.frequence = 'Programme optimisé pour 3-4 séances par semaine';
            plan.sportif.dureeSeances = '60-75 minutes';
            break;
        case '5-6':
            plan.sportif.frequence = 'Programme intensif sur 5-6 jours';
            plan.sportif.dureeSeances = '45-60 minutes';
            break;
        case '7':
            plan.sportif.frequence = 'Programme quotidien avec alternance intensité';
            plan.sportif.dureeSeances = '30-45 minutes';
            break;
    }

    // Adaptation de l'intensité selon l'expérience
    if (experience === 'debutant') {
        plan.sportif.intensite = 'Faible à modérée';
        plan.sportif.recommandations.push('Commencer progressivement', 'Focus sur la technique');
    } else if (experience === 'intermediaire') {
        plan.sportif.intensite = 'Modérée à élevée';
        plan.sportif.recommandations.push('Augmentation progressive des charges', 'Variation des exercices');
    } else {
        plan.sportif.intensite = 'Élevée à très élevée';
        plan.sportif.recommandations.push('Périodisation avancée', 'Techniques d\'intensification');
    }

    // Calcul des besoins caloriques
    const poids = parseFloat(formData.informationsGenerales.poids);
    const taille = parseFloat(formData.informationsGenerales.taille) / 100;
    const age = parseInt(formData.informationsGenerales.age);
    const sexe = formData.informationsGenerales.sexe;
    
    // Calcul du métabolisme de base (formule de Mifflin-St Jeor)
    let MB = sexe === 'homme' 
        ? (10 * poids) + (6.25 * taille * 100) - (5 * age) + 5
        : (10 * poids) + (6.25 * taille * 100) - (5 * age) - 161;

    // Facteur d'activité
    let facteurActivite = niveauActivite === 'sedentaire' ? 1.2 
        : niveauActivite === 'actif' ? 1.5 
        : 1.7;

    let caloriesJournalieres = Math.round(MB * facteurActivite);

    // Ajustement selon l'objectif
    if (objectifs.includes('perte_poids')) {
        caloriesJournalieres = Math.round(caloriesJournalieres * 0.8);
        plan.nutritionnel.repartitionMacros = {
            proteines: '30%',
            glucides: '40%',
            lipides: '30%'
        };
    } else if (objectifs.includes('gain_muscle')) {
        caloriesJournalieres = Math.round(caloriesJournalieres * 1.1);
        plan.nutritionnel.repartitionMacros = {
            proteines: '25%',
            glucides: '55%',
            lipides: '20%'
        };
    } else {
        plan.nutritionnel.repartitionMacros = {
            proteines: '20%',
            glucides: '50%',
            lipides: '30%'
        };
    }

    plan.nutritionnel.apportCalorique = `${caloriesJournalieres} kcal/jour`;

    // Recommandations nutritionnelles selon le régime
    const regime = formData.regimeAlimentaire.type;
    if (regime === 'vegetarien') {
        plan.nutritionnel.alimentsRecommandes = [
            'Légumineuses', 'Œufs', 'Produits laitiers', 
            'Tofu', 'Quinoa', 'Fruits secs'
        ];
    } else if (regime === 'vegan') {
        plan.nutritionnel.alimentsRecommandes = [
            'Légumineuses', 'Tofu', 'Seitan', 
            'Graines de chia', 'Quinoa', 'Fruits secs'
        ];
    } else {
        plan.nutritionnel.alimentsRecommandes = [
            'Viandes maigres', 'Poissons', 'Œufs',
            'Légumineuses', 'Fruits et légumes', 'Céréales complètes'
        ];
    }

    // Génération des exercices personnalisés
    plan.sportif.exercices = genererExercicesPersonnalises(
        objectifs,
        experience,
        formData.objectifsFitness.typesEntrainement
    );

    // Ajout des recommandations nutritionnelles détaillées
    plan.nutritionnel.recommandations = genererRecommandationsNutritionnelles(formData, caloriesJournalieres);

    return plan;
}

function genererRecommandationsNutritionnelles(formData, caloriesJournalieres) {
    const recommandations = [];
    const objectifs = formData.objectifsFitness.objectifsPrincipaux;
    const regime = formData.regimeAlimentaire.type;
    const nbRepas = formData.regimeAlimentaire.nombreRepas;

    // Répartition des calories par repas
    const repartitionCalories = {
        '1-2': [
            { repas: 'Repas 1', pourcentage: 60 },
            { repas: 'Repas 2', pourcentage: 40 }
        ],
        '3': [
            { repas: 'Petit-déjeuner', pourcentage: 30 },
            { repas: 'Déjeuner', pourcentage: 40 },
            { repas: 'Dîner', pourcentage: 30 }
        ],
        '4-5': [
            { repas: 'Petit-déjeuner', pourcentage: 25 },
            { repas: 'Collation matin', pourcentage: 15 },
            { repas: 'Déjeuner', pourcentage: 30 },
            { repas: 'Collation après-midi', pourcentage: 10 },
            { repas: 'Dîner', pourcentage: 20 }
        ]
    };

    // Calcul des calories par repas
    const caloriesParRepas = repartitionCalories[nbRepas].map(repas => ({
        ...repas,
        calories: Math.round((caloriesJournalieres * repas.pourcentage) / 100)
    }));

    recommandations.push({
        titre: 'Répartition des calories',
        details: caloriesParRepas
    });

    // Recommandations spécifiques selon l'objectif
    if (objectifs.includes('perte_poids')) {
        recommandations.push({
            titre: 'Conseils pour la perte de poids',
            points: [
                'Privilégier les aliments à faible densité calorique',
                'Éviter les sucres raffinés et les graisses saturées',
                'Boire beaucoup d\'eau (2L minimum par jour)',
                'Manger lentement et mastiquer longuement',
                'Éviter de manger 3h avant le coucher'
            ]
        });
    } else if (objectifs.includes('gain_muscle')) {
        recommandations.push({
            titre: 'Conseils pour la prise de masse',
            points: [
                'Augmenter progressivement l\'apport calorique',
                'Consommer des protéines à chaque repas',
                'Privilégier les glucides complexes',
                'Manger dans l\'heure qui suit l\'entraînement',
                'Ne pas négliger les bonnes graisses'
            ]
        });
    }

    // Recommandations selon le régime alimentaire
    const recommandationsRegime = {
        vegetarien: {
            titre: 'Conseils pour régime végétarien',
            points: [
                'Combiner les sources de protéines végétales',
                'Surveiller l\'apport en vitamine B12',
                'Consommer des légumineuses quotidiennement',
                'Inclure des œufs et produits laitiers pour les protéines'
            ]
        },
        vegan: {
            titre: 'Conseils pour régime vegan',
            points: [
                'Supplémenter en vitamine B12',
                'Varier les sources de protéines végétales',
                'Consommer des aliments enrichis en calcium',
                'Inclure des graines de chia et de lin pour les oméga-3'
            ]
        }
    };

    if (recommandationsRegime[regime]) {
        recommandations.push(recommandationsRegime[regime]);
    }

    // Timing des repas selon l'activité
    const timingRepas = {
        titre: 'Timing des repas',
        points: [
            'Petit-déjeuner : Dans l\'heure suivant le réveil',
            'Pré-entraînement : 2-3h avant la séance',
            'Post-entraînement : Dans les 30-60 minutes après',
            'Dernier repas : 2-3h avant le coucher'
        ]
    };
    recommandations.push(timingRepas);

    return recommandations;
} 