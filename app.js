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
    if (isConnected && window.location.pathname.includes('index.html')) {
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

            if (password.length < 8) {
                alert('Le mot de passe doit contenir au moins 8 caractères.');
                return;
            }

            // Collecte des données du formulaire
            const formData = {
                informationsGenerales: {
                    nom: document.getElementById('nom').value,
                    prenom: document.getElementById('prenom').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    age: parseInt(document.getElementById('age').value),
                    sexe: document.querySelector('input[name="sexe"]:checked')?.value,
                    poids: parseFloat(document.getElementById('poids').value),
                    taille: parseInt(document.getElementById('taille').value),
                    antecedentsMedicaux: {
                        present: document.querySelector('input[name="antecedents"]:checked')?.value === 'oui',
                        details: document.getElementById('antecedents-details').value
                    }
                },
                objectifsFitness: {
                    objectifsPrincipaux: Array.from(document.querySelectorAll('input[name="objectifs"]:checked')).map(cb => cb.value),
                    autreObjectif: document.getElementById('autre-objectif').value,
                    experience: document.querySelector('input[name="experience"]:checked')?.value,
                    frequenceEntrainement: document.querySelector('input[name="frequence"]:checked')?.value,
                    typesEntrainement: Array.from(document.querySelectorAll('input[name="type-entrainement"]:checked')).map(cb => cb.value),
                    autreTypeEntrainement: document.getElementById('autre-type').value,
                    exercicesNonAimes: document.getElementById('exercices-non-aimes').value
                },
                regimeAlimentaire: {
                    type: document.querySelector('input[name="regime"]:checked')?.value,
                    autreRegime: document.getElementById('autre-regime').value,
                    allergies: {
                        present: document.querySelector('input[name="allergies"]:checked')?.value === 'oui',
                        details: document.getElementById('allergies-details').value
                    },
                    nombreRepas: document.querySelector('input[name="nb-repas"]:checked')?.value,
                    autreNombreRepas: document.getElementById('autre-nb-repas').value,
                    preferencesAlimentaires: document.getElementById('preferences-alimentaires').value,
                    objectifNutritionnel: document.querySelector('input[name="objectif-nutritionnel"]:checked')?.value,
                    autreObjectifNutritionnel: document.getElementById('autre-obj-nutri').value
                },
                habitudesVie: {
                    niveauActivite: document.querySelector('input[name="niveau-activite"]:checked')?.value,
                    horairesFlexibles: document.querySelector('input[name="horaires-flexibles"]:checked')?.value === 'oui',
                    contraintesHoraires: document.getElementById('contraintes-horaires').value
                },
                motivationSuivi: {
                    raisonInscription: document.querySelector('input[name="motivation"]:checked')?.value,
                    autreMotivation: document.getElementById('autre-motivation').value,
                    suiviProgres: {
                        souhaite: document.querySelector('input[name="suivi"]:checked')?.value === 'oui',
                        frequence: document.getElementById('frequence-suivi').value
                    },
                    conseilsSupplementaires: document.querySelector('input[name="conseils-supplementaires"]:checked')?.value === 'oui'
                },
                commentaires: {
                    attentes: document.getElementById('attentes').value
                },
                preferences: {
                    newsletter: document.getElementById('newsletter').checked
                }
            };

            // Vérification des champs requis
            if (!formData.informationsGenerales.sexe || 
                !formData.objectifsFitness.experience || 
                !formData.objectifsFitness.frequenceEntrainement || 
                !formData.regimeAlimentaire.type || 
                !formData.regimeAlimentaire.nombreRepas || 
                !formData.regimeAlimentaire.objectifNutritionnel || 
                !formData.habitudesVie.niveauActivite) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            console.log('Données du formulaire collectées:', formData);

            try {
                // Générer le plan personnalisé
                const planPersonnalise = genererPlanPersonnalise(formData);
                console.log('Plan personnalisé généré:', planPersonnalise);

                // Stocker les données dans le localStorage
                try {
                    localStorage.setItem('levelup_profile', JSON.stringify(formData));
                    localStorage.setItem('levelup_plan', JSON.stringify(planPersonnalise));
                    
                    console.log('Données stockées avec succès dans le localStorage');
                    console.log('Profile:', localStorage.getItem('levelup_profile'));
                    console.log('Plan:', localStorage.getItem('levelup_plan'));
                    
                    // Vérifier que les données sont bien stockées
                    if (!localStorage.getItem('levelup_profile') || !localStorage.getItem('levelup_plan')) {
                        throw new Error('Les données n\'ont pas été correctement stockées dans le localStorage');
                    }
                    
                    // Redirection vers le tableau de bord
                    console.log('Tentative de redirection vers le tableau de bord...');
                    const dashboardUrl = new URL('dashboard.html', window.location.href).href;
                    console.log('URL de redirection:', dashboardUrl);
                    
                    // Utiliser une promesse pour la redirection
                    new Promise((resolve, reject) => {
                        try {
                            window.location.href = dashboardUrl;
                            console.log('Redirection initiée');
                            setTimeout(resolve, 100);
                        } catch (error) {
                            reject(error);
                        }
                    }).catch(error => {
                        console.error('Erreur lors de la redirection:', error);
                        alert('Erreur lors de la redirection. Veuillez réessayer ou cliquer sur le lien du tableau de bord manuellement.');
                    });
                    
                } catch (error) {
                    console.error('Erreur lors du stockage des données:', error);
                    alert('Une erreur est survenue lors de la sauvegarde de vos données. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur lors de la génération du plan:', error);
                alert('Une erreur est survenue lors de la génération de votre plan personnalisé. Veuillez réessayer.');
            }
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

// Gestionnaire du formulaire d'inscription
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

            if (password.length < 8) {
                alert('Le mot de passe doit contenir au moins 8 caractères.');
                return;
            }

            // Collecte des données du formulaire
            const formData = {
                informationsGenerales: {
                    nom: document.getElementById('nom').value,
                    prenom: document.getElementById('prenom').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    age: parseInt(document.getElementById('age').value),
                    sexe: document.querySelector('input[name="sexe"]:checked')?.value,
                    poids: parseFloat(document.getElementById('poids').value),
                    taille: parseInt(document.getElementById('taille').value),
                    antecedentsMedicaux: {
                        present: document.querySelector('input[name="antecedents"]:checked')?.value === 'oui',
                        details: document.getElementById('antecedents-details').value
                    }
                },
                objectifsFitness: {
                    objectifsPrincipaux: Array.from(document.querySelectorAll('input[name="objectifs"]:checked')).map(cb => cb.value),
                    autreObjectif: document.getElementById('autre-objectif').value,
                    experience: document.querySelector('input[name="experience"]:checked')?.value,
                    frequenceEntrainement: document.querySelector('input[name="frequence"]:checked')?.value,
                    typesEntrainement: Array.from(document.querySelectorAll('input[name="type-entrainement"]:checked')).map(cb => cb.value),
                    autreTypeEntrainement: document.getElementById('autre-type').value,
                    exercicesNonAimes: document.getElementById('exercices-non-aimes').value
                },
                regimeAlimentaire: {
                    type: document.querySelector('input[name="regime"]:checked')?.value,
                    autreRegime: document.getElementById('autre-regime').value,
                    allergies: {
                        present: document.querySelector('input[name="allergies"]:checked')?.value === 'oui',
                        details: document.getElementById('allergies-details').value
                    },
                    nombreRepas: document.querySelector('input[name="nb-repas"]:checked')?.value,
                    autreNombreRepas: document.getElementById('autre-nb-repas').value,
                    preferencesAlimentaires: document.getElementById('preferences-alimentaires').value,
                    objectifNutritionnel: document.querySelector('input[name="objectif-nutritionnel"]:checked')?.value,
                    autreObjectifNutritionnel: document.getElementById('autre-obj-nutri').value
                },
                habitudesVie: {
                    niveauActivite: document.querySelector('input[name="niveau-activite"]:checked')?.value,
                    horairesFlexibles: document.querySelector('input[name="horaires-flexibles"]:checked')?.value === 'oui',
                    contraintesHoraires: document.getElementById('contraintes-horaires').value
                },
                motivationSuivi: {
                    raisonInscription: document.querySelector('input[name="motivation"]:checked')?.value,
                    autreMotivation: document.getElementById('autre-motivation').value,
                    suiviProgres: {
                        souhaite: document.querySelector('input[name="suivi"]:checked')?.value === 'oui',
                        frequence: document.getElementById('frequence-suivi').value
                    },
                    conseilsSupplementaires: document.querySelector('input[name="conseils-supplementaires"]:checked')?.value === 'oui'
                },
                commentaires: {
                    attentes: document.getElementById('attentes').value
                },
                preferences: {
                    newsletter: document.getElementById('newsletter').checked
                }
            };

            // Vérification des champs requis
            if (!formData.informationsGenerales.sexe || 
                !formData.objectifsFitness.experience || 
                !formData.objectifsFitness.frequenceEntrainement || 
                !formData.regimeAlimentaire.type || 
                !formData.regimeAlimentaire.nombreRepas || 
                !formData.regimeAlimentaire.objectifNutritionnel || 
                !formData.habitudesVie.niveauActivite) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            console.log('Données du formulaire collectées:', formData);

            try {
                // Générer le plan personnalisé
                const planPersonnalise = genererPlanPersonnalise(formData);
                console.log('Plan personnalisé généré:', planPersonnalise);

                // Stocker les données dans le localStorage
                try {
                    localStorage.setItem('levelup_profile', JSON.stringify(formData));
                    localStorage.setItem('levelup_plan', JSON.stringify(planPersonnalise));
                    
                    console.log('Données stockées avec succès dans le localStorage');
                    console.log('Profile:', localStorage.getItem('levelup_profile'));
                    console.log('Plan:', localStorage.getItem('levelup_plan'));
                    
                    // Vérifier que les données sont bien stockées
                    if (!localStorage.getItem('levelup_profile') || !localStorage.getItem('levelup_plan')) {
                        throw new Error('Les données n\'ont pas été correctement stockées dans le localStorage');
                    }
                    
                    // Redirection vers le tableau de bord
                    console.log('Tentative de redirection vers le tableau de bord...');
                    const dashboardUrl = new URL('dashboard.html', window.location.href).href;
                    console.log('URL de redirection:', dashboardUrl);
                    
                    // Utiliser une promesse pour la redirection
                    new Promise((resolve, reject) => {
                        try {
                            window.location.href = dashboardUrl;
                            console.log('Redirection initiée');
                            setTimeout(resolve, 100);
                        } catch (error) {
                            reject(error);
                        }
                    }).catch(error => {
                        console.error('Erreur lors de la redirection:', error);
                        alert('Erreur lors de la redirection. Veuillez réessayer ou cliquer sur le lien du tableau de bord manuellement.');
                    });
                    
                } catch (error) {
                    console.error('Erreur lors du stockage des données:', error);
                    alert('Une erreur est survenue lors de la sauvegarde de vos données. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur lors de la génération du plan:', error);
                alert('Une erreur est survenue lors de la génération de votre plan personnalisé. Veuillez réessayer.');
            }
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
                "Boire beaucoup d'eau (2L minimum par jour)",
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

    return recommandations;
} 

// Initialisation du tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du tableau de bord...');
    
    // Vérifier si nous sommes sur la page du tableau de bord
    if (document.querySelector('.dashboard-content')) {
        console.log('Page du tableau de bord détectée');
        
        // Vérifier si les données du profil existent
        const profileData = localStorage.getItem('levelup_profile');
        const planData = localStorage.getItem('levelup_plan');
        
        console.log('Données du profil:', profileData);
        console.log('Données du plan:', planData);
        
        if (profileData && planData) {
            console.log('Données trouvées, mise à jour du tableau de bord');
            updateProfileAnalysis();
        } else {
            console.log('Aucune donnée trouvée');
            // Rediriger vers la page d'inscription si aucune donnée n'est trouvée
            window.location.href = 'inscription.html';
        }
    }
});

// Gestionnaire du bouton "Créer mon profil"
document.addEventListener('DOMContentLoaded', function() {
    const btnCreerProfil = document.getElementById('creer-profil-btn');
    if (btnCreerProfil) {
        btnCreerProfil.addEventListener('click', function(e) {
            e.preventDefault(); // Empêcher la soumission par défaut
            console.log('Clic sur le bouton Créer mon profil');
            
            // Vérifier si le formulaire est valide
            const form = document.getElementById('inscription-form');
            if (form && form.checkValidity()) {
                // Simuler la soumission du formulaire
                form.dispatchEvent(new Event('submit'));
                
                // Redirection directe après un court délai
                setTimeout(() => {
                    const dashboardUrl = new URL('dashboard.html', window.location.href).href;
                    console.log('Redirection forcée vers:', dashboardUrl);
                    window.location.href = dashboardUrl;
                }, 500);
            } else {
                console.log('Formulaire invalide');
                form.reportValidity();
            }
        });
    }
});

function updateDashboard() {
    console.log('Mise à jour du tableau de bord...');
    updateProfileAnalysis();
    updateNutritionPlan();
}

function updateNutritionPlan() {
    const profile = JSON.parse(localStorage.getItem('levelup_profile') || '{}');
    if (!profile.informationsGenerales) {
        console.log('Aucun profil trouvé');
        return;
    }

    const {
        poids,
        taille,
        age,
        sexe
    } = profile.informationsGenerales;

    // Calcul des besoins caloriques
    const bmr = calculateBMR(poids, taille, age, sexe);
    const tdee = calculateTDEE(bmr, profile.habitudesVie.niveauActivite);
    
    // Vérifier les objectifs de l'utilisateur
    const userGoals = profile.objectifsFitness?.objectifsPrincipaux || [];
    const wantsWeightLoss = userGoals.includes('perte_poids');
    const wantsMuscleGain = userGoals.includes('gain_muscle');
    
    // Ajustement des calories selon l'objectif de l'utilisateur
    let caloriesJournalieres = tdee;
    let objectifPoids = '';
    let objectifTexte = '';

    if (wantsWeightLoss) {
        caloriesJournalieres = tdee - 500; // Déficit calorique pour la perte de poids
        objectifPoids = '-0.5 à -1 kg/semaine';
        objectifTexte = 'Perte de poids';
    } else if (wantsMuscleGain) {
        caloriesJournalieres = tdee + 300; // Surplus calorique pour la prise de masse
        objectifPoids = '+0.25 à +0.5 kg/semaine';
        objectifTexte = 'Prise de masse musculaire';
    } else {
        // Si aucun objectif spécifique, utiliser l'IMC comme guide
        const imc = calculateBMI(poids, taille);
        if (imc < 18.5) {
            caloriesJournalieres = tdee + 300;
            objectifPoids = '+0.25 à +0.5 kg/semaine';
            objectifTexte = 'Prise de poids santé';
        } else if (imc >= 25) {
            caloriesJournalieres = tdee - 500;
            objectifPoids = '-0.5 à -1 kg/semaine';
            objectifTexte = 'Perte de poids santé';
        } else {
            objectifPoids = 'Maintien';
            objectifTexte = 'Maintien du poids';
        }
    }

    // Mise à jour des éléments d'affichage du résumé
    const objectifElement = document.querySelector('.nutrition-summary .summary-card:first-child p');
    const caloriesElement = document.querySelector('.nutrition-summary .summary-card:nth-child(2) p');
    const poidsElement = document.querySelector('.nutrition-summary .summary-card:last-child p');

    if (objectifElement) objectifElement.textContent = objectifTexte;
    if (caloriesElement) caloriesElement.textContent = `${Math.round(caloriesJournalieres)} kcal`;
    if (poidsElement) poidsElement.textContent = objectifPoids;

    // Mettre à jour le titre de la page
    const nutritionHeader = document.querySelector('.nutrition-header p');
    if (nutritionHeader) {
        nutritionHeader.textContent = `Votre programme alimentaire personnalisé pour ${objectifTexte.toLowerCase()}`;
    }

    // Générer les suggestions de menus adaptés à l'objectif
    const suggestionsMenus = genererSuggestionsMenus(profile, caloriesJournalieres);
    
    // Afficher le menu type
    const menuSuggestionsElement = document.getElementById('menu-suggestions');
    if (menuSuggestionsElement && suggestionsMenus.menuType) {
        menuSuggestionsElement.innerHTML = Object.entries(suggestionsMenus.menuType)
            .map(([repas, details]) => `
                <li class="menu-repas">
                    <div class="menu-repas-titre">${repas}</div>
                    <div class="menu-repas-details">${details.base}</div>
                    <div class="menu-repas-details">${details.details}</div>
                    <div class="menu-repas-macros">${details.macros}</div>
                </li>
            `).join('');
    }

    // Afficher les alternatives si nécessaire
    const menuAlternativesElement = document.getElementById('menu-alternatives');
    const menuAlternativesContainer = document.querySelector('.menu-alternatives');
    
    if (profile.regimeAlimentaire?.type && 
        profile.regimeAlimentaire.type !== 'standard' && 
        menuAlternativesElement && 
        menuAlternativesContainer && 
        suggestionsMenus.alternatives) {
        
        menuAlternativesContainer.style.display = 'block';
        menuAlternativesElement.innerHTML = Object.entries(suggestionsMenus.alternatives)
            .map(([repas, details]) => `
                <li class="menu-repas">
                    <div class="menu-repas-titre">${repas}</div>
                    <div class="menu-repas-details">${details.base}</div>
                    <div class="menu-repas-details">${details.details}</div>
                    <div class="menu-repas-macros">${details.macros}</div>
                </li>
            `).join('');
    } else if (menuAlternativesContainer) {
        menuAlternativesContainer.style.display = 'none';
    }
}

// Modifier l'initialisation du tableau de bord pour utiliser la nouvelle fonction
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du tableau de bord...');
    
    if (document.querySelector('.dashboard-content')) {
        console.log('Page du tableau de bord détectée');
        
        const profileData = localStorage.getItem('levelup_profile');
        const planData = localStorage.getItem('levelup_plan');
        
        console.log('Données du profil:', profileData);
        console.log('Données du plan:', planData);
        
        if (profileData && planData) {
            console.log('Données trouvées, mise à jour du tableau de bord');
            updateDashboard();
        } else {
            console.log('Aucune donnée trouvée');
            window.location.href = 'inscription.html';
        }
    }
});

function genererSuggestionsMenus(profile, caloriesJournalieres) {
    const objectifs = profile.objectifsFitness.objectifsPrincipaux;
    const regime = profile.regimeAlimentaire.type;
    const wantsWeightLoss = objectifs.includes('perte_poids');
    const wantsMuscleGain = objectifs.includes('gain_muscle');
    
    // Menus de base selon l'objectif
    const menus = {
        perte_poids: {
            "Petit-déjeuner": {
                base: "Petit-déjeuner protéiné et fibres",
                details: "40g de flocons d'avoine, 200ml de lait écrémé, 1 scoop de protéine whey, fruits rouges",
                macros: "Calories: 300, Protéines: 25g, Glucides: 35g, Lipides: 5g"
            },
            "Collation Matin": {
                base: "Collation protéinée",
                details: "150g de yaourt grec 0%, pomme, cannelle",
                macros: "Calories: 120, Protéines: 15g, Glucides: 15g, Lipides: 0g"
            },
            "Déjeuner": {
                base: "Repas riche en protéines et légumes",
                details: "180g de blanc de poulet, 150g de légumes vapeur, 100g de quinoa cuit",
                macros: "Calories: 400, Protéines: 45g, Glucides: 35g, Lipides: 8g"
            },
            "Collation Après-midi": {
                base: "Collation équilibrée",
                details: "30g d'amandes, 1 fruit de saison",
                macros: "Calories: 200, Protéines: 6g, Glucides: 15g, Lipides: 15g"
            },
            "Dîner": {
                base: "Dîner léger protéiné",
                details: "200g de poisson blanc, 200g de légumes verts, 1 cuillère d'huile d'olive",
                macros: "Calories: 300, Protéines: 35g, Glucides: 15g, Lipides: 12g"
            }
        },
        gain_muscle: {
            "Petit-déjeuner": {
                base: "Petit-déjeuner hypercalorique",
                details: "80g de flocons d'avoine, 300ml de lait entier, 2 œufs entiers, 1 banane, 30g de beurre de cacahuète",
                macros: "Calories: 800, Protéines: 35g, Glucides: 90g, Lipides: 35g"
            },
            "Collation Matin": {
                base: "Shake protéiné gain de masse",
                details: "40g de whey, 1 banane, 40g d'avoine, 30g d'amandes",
                macros: "Calories: 450, Protéines: 35g, Glucides: 45g, Lipides: 20g"
            },
            "Déjeuner": {
                base: "Repas riche en protéines et glucides",
                details: "220g de poulet, 150g de riz complet, légumes, 2 cuillères d'huile d'olive",
                macros: "Calories: 750, Protéines: 55g, Glucides: 80g, Lipides: 25g"
            },
            "Collation Après-midi": {
                base: "Collation gain de masse",
                details: "200g de yaourt grec, 40g de granola, 20g de miel",
                macros: "Calories: 400, Protéines: 20g, Glucides: 50g, Lipides: 15g"
            },
            "Dîner": {
                base: "Dîner riche en protéines",
                details: "200g de bœuf, 200g de patates douces, légumes verts, huile d'olive",
                macros: "Calories: 650, Protéines: 45g, Glucides: 60g, Lipides: 25g"
            }
        },
        maintien: {
            "Petit-déjeuner": {
                base: "Petit-déjeuner équilibré",
                details: "60g de flocons d'avoine, 200ml de lait demi-écrémé, 1 œuf, fruits frais",
                macros: "Calories: 400, Protéines: 20g, Glucides: 55g, Lipides: 12g"
            },
            "Collation Matin": {
                base: "Collation saine",
                details: "150g de yaourt grec, 1 fruit, 20g d'amandes",
                macros: "Calories: 250, Protéines: 15g, Glucides: 25g, Lipides: 12g"
            },
            "Déjeuner": {
                base: "Repas équilibré",
                details: "150g de poulet, 120g de riz complet, légumes variés, huile d'olive",
                macros: "Calories: 500, Protéines: 35g, Glucides: 60g, Lipides: 15g"
            },
            "Collation Après-midi": {
                base: "Collation énergétique",
                details: "1 fruit, 30g de noix",
                macros: "Calories: 200, Protéines: 5g, Glucides: 20g, Lipides: 15g"
            },
            "Dîner": {
                base: "Dîner léger",
                details: "180g de poisson, légumes variés, 100g de quinoa",
                macros: "Calories: 450, Protéines: 35g, Glucides: 45g, Lipides: 15g"
            }
        }
    };

    // Alternatives végétariennes/vegans
    const alternatives = {
        vegetarien: {
            "Petit-déjeuner": {
                base: "Bowl protéiné végétarien",
                details: "Yaourt grec, granola protéiné, graines de chia, fruits frais",
                macros: "Calories: 400, Protéines: 20g, Glucides: 45g, Lipides: 15g"
            },
            "Collation": {
                base: "Smoothie protéiné",
                details: "Protéine whey végétale, banane, épinards, graines de lin",
                macros: "Calories: 250, Protéines: 20g, Glucides: 30g, Lipides: 8g"
            },
            "Déjeuner": {
                base: "Buddha bowl protéiné",
                details: "Quinoa, lentilles, pois chiches, avocat, légumes grillés",
                macros: "Calories: 550, Protéines: 25g, Glucides: 65g, Lipides: 20g"
            },
            "Dîner": {
                base: "Assiette végétarienne complète",
                details: "Galette de légumineuses, légumes rôtis, houmous",
                macros: "Calories: 450, Protéines: 20g, Glucides: 50g, Lipides: 18g"
            }
        },
        vegan: {
            "Petit-déjeuner": {
                base: "Smoothie bowl protéiné vegan",
                details: "Protéine de pois, banane, fruits rouges, graines, lait d'amande",
                macros: "Calories: 350, Protéines: 20g, Glucides: 45g, Lipides: 12g"
            },
            "Collation": {
                base: "Encas protéiné vegan",
                details: "Barre protéinée vegan, fruit sec, noix",
                macros: "Calories: 300, Protéines: 15g, Glucides: 35g, Lipides: 15g"
            },
            "Déjeuner": {
                base: "Bowl protéiné vegan",
                details: "Tofu grillé, quinoa, légumes, sauce tahini",
                macros: "Calories: 500, Protéines: 25g, Glucides: 55g, Lipides: 22g"
            },
            "Dîner": {
                base: "Dîner vegan complet",
                details: "Tempeh mariné, patate douce, légumes verts, noix",
                macros: "Calories: 450, Protéines: 22g, Glucides: 50g, Lipides: 20g"
            }
        }
    };

    // Sélectionner le menu approprié selon l'objectif
    let menuType;
    if (wantsWeightLoss) {
        menuType = menus.perte_poids;
    } else if (wantsMuscleGain) {
        menuType = menus.gain_muscle;
    } else {
        menuType = menus.maintien;
    }

    // Sélectionner les alternatives si nécessaire
    let menuAlternatif = null;
    if (regime && regime !== 'standard') {
        menuAlternatif = alternatives[regime] || null;
    }

    return {
        menuType: menuType,
        alternatives: menuAlternatif
    };
}

// Gestion de la navigation
document.addEventListener('DOMContentLoaded', function() {
    const nutritionLink = document.querySelector('a[href="#nutrition"]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (nutritionLink) {
        nutritionLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Ajouter la classe active au lien Nutrition
            this.classList.add('active');
            
            // Afficher la section nutrition et masquer les autres sections
            document.querySelectorAll('.dashboard-content > section').forEach(section => {
                section.style.display = 'none';
            });
            
            document.querySelector('#plan-nutritionnel').parentElement.style.display = 'block';
            
            // Mettre à jour le plan nutritionnel
            updateNutritionPlan();
        });
    }
});

// Gestion du menu nutritionnel
document.addEventListener('DOMContentLoaded', function() {
    const generateMenuBtn = document.getElementById('generate-menu');
    if (generateMenuBtn) {
        generateMenuBtn.addEventListener('click', generateNewMenu);
    }
});

function generateNewMenu() {
    const button = document.getElementById('generate-menu');
    const mealPlans = document.querySelector('.meal-plans');
    
    // Récupérer le profil utilisateur
    const profile = JSON.parse(localStorage.getItem('levelup_profile') || '{}');
    if (!profile.informationsGenerales) {
        console.log('Aucun profil trouvé');
        return;
    }

    // Ajouter la classe loading
    button.classList.add('loading');
    
    // Calculer les besoins caloriques
    const {
        poids,
        taille,
        age,
        sexe
    } = profile.informationsGenerales;

    const bmr = calculateBMR(poids, taille, age, sexe);
    const tdee = calculateTDEE(bmr, profile.habitudesVie.niveauActivite);
    
    // Ajuster les calories selon l'objectif et l'IMC
    let caloriesJournalieres = tdee;
    
    // Calculer l'IMC
    const imc = calculateBMI(poids, taille);
    
    // Déterminer l'objectif en fonction de l'IMC et des préférences utilisateur
    if (imc < 18.5 || (profile.objectifsFitness && profile.objectifsFitness.objectifsPrincipaux.includes('gain_muscle'))) {
        caloriesJournalieres = tdee + 300; // Surplus calorique pour la prise de masse
    } else if (imc >= 25 || (profile.objectifsFitness && profile.objectifsFitness.objectifsPrincipaux.includes('perte_poids'))) {
        caloriesJournalieres = tdee - 500; // Déficit calorique pour la perte de poids
    }

    // Générer et afficher les suggestions de menus
    const suggestionsMenus = genererSuggestionsMenus(profile, caloriesJournalieres);
    
    // Mettre à jour l'affichage avec le menu adapté
    if (suggestionsMenus.menuType) {
        mealPlans.innerHTML = Object.entries(suggestionsMenus.menuType)
            .map(([repas, details]) => `
                <div class="meal-time">
                    <h4>${repas}</h4>
                    <ul>
                        <li>${details.base}</li>
                        <li>${details.details}</li>
                        <li class="macros">${details.macros}</li>
                    </ul>
                </div>
            `).join('');

        // Ajouter les alternatives si nécessaire
        if (suggestionsMenus.alternatives) {
            Object.entries(suggestionsMenus.alternatives).forEach(([repas, details]) => {
                const mealSection = mealPlans.querySelector(`div.meal-time:has(h4:contains("${repas}"))`);
                if (mealSection) {
                    const alternativeHtml = `
                        <div class="alternative">
                            <h5>Alternative ${profile.regimeAlimentaire.type}</h5>
                            <ul>
                                <li>${details.base}</li>
                                <li>${details.details}</li>
                                <li class="macros">${details.macros}</li>
                            </ul>
                        </div>
                    `;
                    mealSection.insertAdjacentHTML('beforeend', alternativeHtml);
                }
            });
        }
    }

    // Retirer la classe loading
    button.classList.remove('loading');
}