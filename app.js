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
    localStorage.removeItem('levelup_profile');
    localStorage.removeItem('levelup_objectifs');
    localStorage.removeItem('levelup_stats');
    localStorage.removeItem('levelup_history');
    localStorage.removeItem('levelup_favorite_exercices');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('weightHistory');
    
    alert('Vous avez été déconnecté avec succès.');
    window.location.href = 'index.html';
}

// Fonctions d'analyse du profil
function updateProfileAnalysis() {
    const profile = JSON.parse(localStorage.getItem('levelup_profile'));
    if (!profile || !profile.informationsGenerales) {
        console.error('Profil non trouvé');
        return;
    }

    const {
        poids,
        taille,
        age,
        sexe
    } = profile.informationsGenerales;

    // Calcul et mise à jour de l'IMC
    const imc = calculerIMC(poids, taille);
    const imcElement = document.getElementById('bmi-value');
    const imcInterpretationElement = document.getElementById('bmi-interpretation');
    if (imcElement) imcElement.textContent = imc.toFixed(1);
    if (imcInterpretationElement) imcInterpretationElement.textContent = interpreterIMC(imc);

    // Calcul et mise à jour du métabolisme de base
    const bmr = calculerMetabolismeBase(poids, taille, age, sexe);
    const bmrElement = document.getElementById('bmr-value');
    if (bmrElement) bmrElement.textContent = Math.round(bmr);

    // Calcul et mise à jour de la dépense énergétique
    const tdee = calculerDepenseEnergetique(bmr, profile.habitudesVie.niveauActivite);
    const tdeeElement = document.getElementById('tdee-value');
    if (tdeeElement) tdeeElement.textContent = Math.round(tdee);

    // Mise à jour des objectifs de poids
    const currentWeightElement = document.getElementById('current-weight');
    const targetWeightElement = document.getElementById('target-weight');
    const weightProgressElement = document.getElementById('weight-progress');

    if (currentWeightElement) currentWeightElement.textContent = `${poids} kg`;

    const objectifPoids = calculerObjectifPoids(profile);
    if (targetWeightElement) targetWeightElement.textContent = `${objectifPoids.poidsIdeal.toFixed(1)} kg`;
    if (weightProgressElement) weightProgressElement.textContent = objectifPoids.message;

    // Générer et afficher les recommandations
    const recommendationsElement = document.getElementById('profile-recommendations');
    if (recommendationsElement) {
        const recommendations = genererRecommandations(profile, imc, tdee);
        recommendationsElement.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <i class="fas fa-check"></i>
                <p>${rec}</p>
            </div>
        `).join('');
    }
}

function calculerIMC(poids, taille) {
    const tailleEnMetres = taille / 100;
    return poids / (tailleEnMetres * tailleEnMetres);
}

function interpreterIMC(imc) {
    if (imc < 18.5) return "Insuffisance pondérale";
    if (imc < 25) return "Poids normal";
    if (imc < 30) return "Surpoids";
    return "Obésité";
}

function calculerMetabolismeBase(poids, taille, age, sexe) {
    // Formule de Mifflin-St Jeor
    const mb = 10 * poids + 6.25 * taille - 5 * age;
    return sexe === 'homme' ? mb + 5 : mb - 161;
}

function calculerDepenseEnergetique(bmr, niveauActivite) {
    const coefficients = {
        'sedentaire': 1.2,
        'leger': 1.375,
        'modere': 1.55,
        'actif': 1.725,
        'tres_actif': 1.9
    };
    return bmr * (coefficients[niveauActivite] || 1.2);
}

function genererRecommandations(profile, imc, tdee) {
    const recommendations = [];
    const objectifs = profile.objectifsFitness.objectifsPrincipaux;
    const experience = profile.objectifsFitness.experience;
    const regime = profile.regimeAlimentaire.type;
    const niveauActivite = profile.habitudesVie.niveauActivite;

    // Recommandations basées sur l'IMC
    if (imc < 18.5) {
        recommendations.push("Augmentez progressivement votre apport calorique pour atteindre un poids santé");
        recommendations.push("Concentrez-vous sur des exercices de résistance pour développer la masse musculaire");
    } else if (imc >= 25 && imc < 30) {
        recommendations.push("Un léger déficit calorique de 300-500 calories est recommandé");
        recommendations.push("Privilégiez les exercices cardio-vasculaires combinés à la musculation");
    } else if (imc >= 30) {
        recommendations.push("Consultez un professionnel de santé pour un suivi personnalisé de votre perte de poids");
        recommendations.push("Commencez par des activités à faible impact comme la marche et la natation");
    }

    // Recommandations basées sur les objectifs
    if (objectifs.includes('prise_de_muscle')) {
        recommendations.push(`Visez un apport de ${Math.round(tdee + 300)} calories par jour`);
        recommendations.push("Consommez 1.6-2.2g de protéines par kg de poids corporel");
        recommendations.push("Privilégiez les exercices composés : squats, développé couché, soulevé de terre");
    } else if (objectifs.includes('perte_poids')) {
        recommendations.push(`Limitez votre apport à ${Math.round(tdee - 500)} calories par jour`);
        recommendations.push("Maintenez un apport protéique élevé pour préserver la masse musculaire");
        recommendations.push("Intégrez des séances HIIT pour maximiser la dépense calorique");
    }

    // Recommandations basées sur l'expérience
    if (experience === 'debutant') {
        recommendations.push("Concentrez-vous sur la maîtrise des mouvements de base");
        recommendations.push("Commencez avec 2-3 séances par semaine");
        recommendations.push("Privilégiez des séries de 12-15 répétitions pour apprendre la technique");
    } else if (experience === 'intermediaire') {
        recommendations.push("Variez vos routines d'entraînement toutes les 4-6 semaines");
        recommendations.push("Augmentez progressivement l'intensité de vos séances");
    } else if (experience === 'avance') {
        recommendations.push("Incorporez des techniques avancées comme les séries descendantes");
        recommendations.push("Planifiez des cycles de progression sur 8-12 semaines");
    }

    // Recommandations basées sur le niveau d'activité
    if (niveauActivite === 'sedentaire') {
        recommendations.push("Augmentez progressivement votre activité physique quotidienne");
        recommendations.push("Visez 7000-8000 pas par jour pour commencer");
    } else if (niveauActivite === 'tres_actif') {
        recommendations.push("Assurez-vous d'avoir une récupération adéquate entre les séances");
        recommendations.push("Surveillez les signes de surentraînement");
    }

    // Recommandations nutritionnelles selon le régime
    if (regime === 'vegetarien') {
        recommendations.push("Combinez différentes sources de protéines végétales");
        recommendations.push("Surveillez votre apport en vitamine B12 et en fer");
        recommendations.push("Privilégiez les légumineuses et les produits à base de soja");
    } else if (regime === 'vegan') {
        recommendations.push("Supplémentez en vitamine B12");
        recommendations.push("Assurez-vous d'avoir des sources complètes de protéines végétales");
        recommendations.push("Surveillez vos apports en calcium et en vitamine D");
    }

    // Limiter à 5 recommandations maximum pour ne pas surcharger l'interface
    return recommendations.slice(0, 5);
}

// Amélioration de la fonction de calcul d'objectif de poids
function calculerObjectifPoids(profile) {
    const { poids, taille, sexe } = profile.informationsGenerales;
    const imc = calculerIMC(poids, taille);
    const objectifs = profile.objectifsFitness.objectifsPrincipaux;
    const experience = profile.objectifsFitness.experience;

    let poidsIdeal = 0;
    let message = "";
    let vitesse = "";

    // Calcul du poids idéal selon la formule de Lorentz
    const poidsIdealBase = taille - 100 - ((taille - 150) / (sexe === 'homme' ? 4 : 2));

    if (objectifs.includes('prise_de_muscle')) {
        poidsIdeal = poidsIdealBase * 1.1; // +10% pour la prise de muscle
        const difference = Math.abs(poidsIdeal - poids);
        
        if (poids < poidsIdeal) {
            vitesse = experience === 'debutant' ? '0.5-1 kg par mois'
                   : experience === 'intermediaire' ? '0.3-0.7 kg par mois'
                   : '0.2-0.5 kg par mois';
            message = `Objectif : prendre ${difference.toFixed(1)} kg de masse musculaire (${vitesse})`;
        } else {
            message = "Poids optimal pour la prise de muscle";
        }
    } else if (objectifs.includes('perte_poids')) {
        poidsIdeal = poidsIdealBase * 0.95; // -5% pour la définition
        const difference = Math.abs(poids - poidsIdeal);
        
        if (poids > poidsIdeal) {
            vitesse = imc >= 30 ? '1-1.5 kg par semaine'
                   : imc >= 25 ? '0.5-1 kg par semaine'
                   : '0.3-0.5 kg par semaine';
            message = `Objectif : perdre ${difference.toFixed(1)} kg (${vitesse})`;
        } else {
            message = "Poids cible atteint";
        }
    } else {
        poidsIdeal = poidsIdealBase;
        const difference = Math.abs(poids - poidsIdeal);
        
        if (difference > 2) {
            message = `Ajustement recommandé : ${poids > poidsIdeal ? '-' : '+'}${difference.toFixed(1)} kg`;
        } else {
            message = "Poids dans la zone optimale";
        }
    }

    return { poidsIdeal, message };
}

// Initialisation du tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('dashboard.html')) {
        updateProfileAnalysis();
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