// Fonctions pour la section profil
function initProfil() {
    loadObjectifs();
    loadUserProfile();
    initGraphiques();
    checkObjectifsDeadlines();
    
    // Gestionnaire pour le bouton "Ajouter un objectif"
    const addObjectifBtn = document.querySelector('.add-objectif-btn');
    if (addObjectifBtn) {
        addObjectifBtn.addEventListener('click', showAddObjectifModal);
    }

    // Gestionnaire pour le bouton de modification du profil
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showEditProfileModal);
    }

    // Vérifier les deadlines toutes les heures
    setInterval(checkObjectifsDeadlines, 3600000);
}

// Charger le profil utilisateur
function loadUserProfile() {
    const profileData = JSON.parse(localStorage.getItem('levelup_profile') || '{}');
    const defaultProfile = {
        nom: 'Utilisateur',
        age: '',
        poids: '',
        taille: '',
        objectifPrincipal: '',
        avatar: 'default-avatar.png'
    };

    const profile = { ...defaultProfile, ...profileData };
    updateProfileUI(profile);
}

// Mettre à jour l'interface du profil
function updateProfileUI(profile) {
    const profileSection = document.querySelector('.profile-info');
    if (profileSection) {
        profileSection.innerHTML = `
            <div class="profile-header">
                <img src="${profile.avatar}" alt="Avatar" class="profile-avatar">
                <div class="profile-details">
                    <h3>${profile.nom}</h3>
                    <p>${profile.age} ans</p>
                    <p>${profile.taille} cm | ${profile.poids} kg</p>
                    <p>Objectif: ${profile.objectifPrincipal}</p>
                </div>
                <button class="edit-profile-btn">
                    <i class="fas fa-user-edit"></i>
                </button>
            </div>
        `;
    }
}

// Afficher la modale de modification du profil
function showEditProfileModal() {
    const profileData = JSON.parse(localStorage.getItem('levelup_profile') || '{}');
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Modifier mon profil</h3>
            <form id="profileForm" class="profile-form">
                <div class="form-group">
                    <label for="profileNom">Nom complet</label>
                    <input type="text" id="profileNom" name="nom" value="${profileData.nom || ''}" required>
                </div>
                <div class="form-group">
                    <label for="profileAge">Âge</label>
                    <input type="number" id="profileAge" name="age" value="${profileData.age || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="profilePoids">Poids (kg)</label>
                        <input type="number" id="profilePoids" name="poids" step="0.1" value="${profileData.poids || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="profileTaille">Taille (cm)</label>
                        <input type="number" id="profileTaille" name="taille" value="${profileData.taille || ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="profileObjectif">Objectif principal</label>
                    <select id="profileObjectif" name="objectifPrincipal" required>
                        <option value="perte_poids" ${profileData.objectifPrincipal === 'perte_poids' ? 'selected' : ''}>Perte de poids</option>
                        <option value="muscle" ${profileData.objectifPrincipal === 'muscle' ? 'selected' : ''}>Prise de muscle</option>
                        <option value="endurance" ${profileData.objectifPrincipal === 'endurance' ? 'selected' : ''}>Amélioration de l'endurance</option>
                        <option value="force" ${profileData.objectifPrincipal === 'force' ? 'selected' : ''}>Gain en force</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="profileAvatar">Photo de profil</label>
                    <input type="file" id="profileAvatar" name="avatar" accept="image/*">
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Enregistrer</button>
                    <button type="button" class="close-modal">Annuler</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    const form = modal.querySelector('#profileForm');
    form.addEventListener('submit', async (e) => {
            e.preventDefault();
        const formData = new FormData(form);
        const avatarFile = formData.get('avatar');
        
        // Gérer l'upload de l'avatar
        if (avatarFile.size > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                formData.set('avatar', e.target.result);
                saveProfile(Object.fromEntries(formData));
            };
            reader.readAsDataURL(avatarFile);
        } else {
            formData.set('avatar', profileData.avatar || 'default-avatar.png');
            saveProfile(Object.fromEntries(formData));
        }

        modal.querySelector('.close-modal').click();
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
}

// Sauvegarder le profil
function saveProfile(profileData) {
    localStorage.setItem('levelup_profile', JSON.stringify(profileData));
    updateProfileUI(profileData);
}

// Initialiser les graphiques
function initGraphiques() {
    const objectifs = JSON.parse(localStorage.getItem('levelup_objectifs') || '[]');
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: objectifs.map(obj => new Date(obj.date).toLocaleDateString()),
            datasets: [{
                label: 'Progression des objectifs',
                data: objectifs.map(obj => obj.progress),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Vérifier les deadlines des objectifs
function checkObjectifsDeadlines() {
    const objectifs = JSON.parse(localStorage.getItem('levelup_objectifs') || '[]');
    const today = new Date();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    objectifs.forEach(objectif => {
        const deadline = new Date(objectif.date);
        const timeLeft = deadline - today;

        if (timeLeft > 0 && timeLeft <= sevenDays) {
            showNotification(
                'Objectif à échéance proche',
                `Votre objectif "${objectif.type}" arrive à échéance dans ${Math.ceil(timeLeft / (24 * 60 * 60 * 1000))} jours.`
            );
        }
    });
}

// Afficher une notification
function showNotification(title, message) {
    // Vérifier si les notifications sont supportées et autorisées
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    // Afficher aussi une notification dans l'interface
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
            <button class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('visible'), 10);

    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('visible');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.querySelector('.close-notification').click();
        }
    }, 5000);
}

// Initialiser les barres de progression des objectifs
function initObjectifsProgress() {
    const objectifs = document.querySelectorAll('.objectif-item');
    objectifs.forEach(objectif => {
        const progress = Math.floor(Math.random() * 100); // Simulation de progression
        const progressBar = objectif.querySelector('.progress-fill');
        const progressText = objectif.querySelector('.progress');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    });
}

// Afficher la modale d'ajout d'objectif
function showAddObjectifModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Ajouter un nouvel objectif</h3>
            <form id="objectifForm" class="objectif-form">
                <div class="form-group">
                    <label for="objectifType">Type d'objectif</label>
                    <select id="objectifType" name="objectifType" required>
                        <option value="poids">Perte de poids</option>
                        <option value="muscle">Prise de muscle</option>
                        <option value="cardio">Cardio</option>
                        <option value="force">Force</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="objectifValeur">Valeur cible</label>
                    <input type="number" id="objectifValeur" name="objectifValeur" required>
            </div>
                <div class="form-group">
                    <label for="objectifDate">Date limite</label>
                    <input type="date" id="objectifDate" name="objectifDate" required>
            </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Ajouter</button>
                    <button type="button" class="close-modal">Annuler</button>
            </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    const form = modal.querySelector('#objectifForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        addNewObjectif(formData);
        modal.querySelector('.close-modal').click();
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
}

// Initialisation des objectifs
function initObjectifs() {
    loadObjectifs();
    
    // Gestionnaire pour le bouton "Ajouter un objectif"
    const addObjectifBtn = document.querySelector('.add-objectif-btn');
    if (addObjectifBtn) {
        addObjectifBtn.addEventListener('click', showAddObjectifModal);
    }
}

// Sauvegarder les objectifs dans le localStorage
function saveObjectifs() {
    const objectifs = [];
    document.querySelectorAll('.objectif-item').forEach(objectif => {
        if (!objectif.classList.contains('add-objectif-btn')) {
            objectifs.push({
                type: objectif.dataset.type,
                valeur: objectif.dataset.valeur,
                date: objectif.dataset.date,
                progress: parseInt(objectif.querySelector('.progress').textContent)
            });
        }
    });
    localStorage.setItem('levelup_objectifs', JSON.stringify(objectifs));
}

// Charger les objectifs depuis le localStorage
function loadObjectifs() {
    const objectifs = JSON.parse(localStorage.getItem('levelup_objectifs') || '[]');
    const objectifsList = document.querySelector('.objectifs-list');
    
    // Vider la liste sauf le bouton d'ajout
    const addButton = objectifsList.querySelector('.add-objectif-btn');
    objectifsList.innerHTML = '';
    objectifsList.appendChild(addButton);

    // Recréer les objectifs
    objectifs.forEach(objectif => {
        const formData = new FormData();
        formData.append('objectifType', objectif.type);
        formData.append('objectifValeur', objectif.valeur);
        formData.append('objectifDate', objectif.date);
        addNewObjectif(formData, objectif.progress);
    });
}

// Modifier la fonction addNewObjectif pour inclure la progression et la sauvegarde
function addNewObjectif(formData, progress = 0) {
    const objectifsList = document.querySelector('.objectifs-list');
    const newObjectif = document.createElement('div');
    newObjectif.className = 'objectif-item fade-in';
    
    const typeLabel = {
        poids: 'Perte de poids',
        muscle: 'Prise de muscle',
        cardio: 'Cardio',
        force: 'Force'
    };

    // Ajouter les données dans les attributs data-*
    newObjectif.dataset.type = formData.get('objectifType');
    newObjectif.dataset.valeur = formData.get('objectifValeur');
    newObjectif.dataset.date = formData.get('objectifDate');

    newObjectif.innerHTML = `
        <div class="objectif-header">
            <h4>${typeLabel[formData.get('objectifType')]}</h4>
            <span class="progress">${progress}%</span>
            <button class="edit-objectif" title="Modifier">
                <i class="fas fa-edit"></i>
            </button>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p>Objectif: ${formData.get('objectifValeur')} | Date limite: ${formData.get('objectifDate')}</p>
    `;

    // Insérer le nouvel objectif avant le bouton d'ajout
    const addButton = objectifsList.querySelector('.add-objectif-btn');
    objectifsList.insertBefore(newObjectif, addButton);

    // Ajouter le gestionnaire d'événements pour le bouton de modification
    newObjectif.querySelector('.edit-objectif').addEventListener('click', () => {
        showEditObjectifModal(newObjectif, {
            type: formData.get('objectifType'),
            valeur: formData.get('objectifValeur'),
            date: formData.get('objectifDate')
            });
        });

    // Animation d'entrée
    setTimeout(() => newObjectif.classList.add('visible'), 10);

    // Sauvegarder les objectifs
    saveObjectifs();
}

// Afficher la modale de modification d'objectif
function showEditObjectifModal(objectifElement, objectifData) {
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Modifier l'objectif</h3>
            <form id="editObjectifForm" class="objectif-form">
                <div class="form-group">
                    <label for="objectifType">Type d'objectif</label>
                    <select id="objectifType" name="objectifType" required>
                        <option value="poids" ${objectifData.type === 'poids' ? 'selected' : ''}>Perte de poids</option>
                        <option value="muscle" ${objectifData.type === 'muscle' ? 'selected' : ''}>Prise de muscle</option>
                        <option value="cardio" ${objectifData.type === 'cardio' ? 'selected' : ''}>Cardio</option>
                        <option value="force" ${objectifData.type === 'force' ? 'selected' : ''}>Force</option>
                    </select>
            </div>
                <div class="form-group">
                    <label for="objectifValeur">Valeur cible</label>
                    <input type="number" id="objectifValeur" name="objectifValeur" value="${objectifData.valeur}" required>
                </div>
                <div class="form-group">
                    <label for="objectifDate">Date limite</label>
                    <input type="date" id="objectifDate" name="objectifDate" value="${objectifData.date}" required>
                </div>
                <div class="form-group">
                    <label for="objectifProgress">Progression actuelle (%)</label>
                    <input type="number" id="objectifProgress" name="objectifProgress" min="0" max="100" value="${parseInt(objectifElement.querySelector('.progress').textContent)}" required>
            </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Enregistrer</button>
                    <button type="button" class="delete-btn">Supprimer</button>
                    <button type="button" class="close-modal">Annuler</button>
            </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    const form = modal.querySelector('#editObjectifForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        updateObjectif(objectifElement, formData);
        modal.querySelector('.close-modal').click();
    });

    modal.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
            objectifElement.classList.remove('visible');
            setTimeout(() => objectifElement.remove(), 300);
            modal.querySelector('.close-modal').click();
        }
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
}

// Mettre à jour un objectif existant
function updateObjectif(objectifElement, formData) {
    const typeLabel = {
        poids: 'Perte de poids',
        muscle: 'Prise de muscle',
        cardio: 'Cardio',
        force: 'Force'
    };

    const oldProgress = parseInt(objectifElement.querySelector('.progress').textContent);
    const newProgress = parseInt(formData.get('objectifProgress'));

    // Mettre à jour les attributs data-*
    objectifElement.dataset.type = formData.get('objectifType');
    objectifElement.dataset.valeur = formData.get('objectifValeur');
    objectifElement.dataset.date = formData.get('objectifDate');

    objectifElement.querySelector('h4').textContent = typeLabel[formData.get('objectifType')];
    objectifElement.querySelector('.progress').textContent = `${newProgress}%`;
    objectifElement.querySelector('.progress-fill').style.width = `${newProgress}%`;
    objectifElement.querySelector('p').textContent = `Objectif: ${formData.get('objectifValeur')} | Date limite: ${formData.get('objectifDate')}`;

    // Animation de mise à jour
    objectifElement.classList.add('update-animation');
    setTimeout(() => objectifElement.classList.remove('update-animation'), 500);

    // Mettre à jour l'historique et les statistiques
    addToHistory('goal_progress', `Progression de l'objectif : ${typeLabel[formData.get('objectifType')]}`, {
        old_progress: oldProgress,
        progress: newProgress,
        type: formData.get('objectifType'),
        value: formData.get('objectifValeur')
    });

    // Si l'objectif est atteint (100%)
    if (newProgress === 100 && oldProgress < 100) {
        const stats = loadStats();
        updateStats({
            goals_completed: stats.goals_completed + 1
        });
        showNotification('Objectif atteint !', `Félicitations ! Vous avez atteint votre objectif de ${typeLabel[formData.get('objectifType')]}`);
    }

    // Sauvegarder les objectifs
    saveObjectifs();
}

// Afficher les détails d'un entraînement
function showWorkoutDetailsModal(title, details, date) {
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <p class="workout-date">${date}</p>
            </div>
            <div class="workout-details">
                <h4>Détails de la séance</h4>
                <p>${details}</p>
                <div class="workout-stats-details">
                    <div class="stat">
                    <i class="fas fa-fire"></i>
                        <span>450</span>
                        <p>Calories</p>
                </div>
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span>45min</span>
                        <p>Durée</p>
                </div>
                    <div class="stat">
                        <i class="fas fa-heart"></i>
                        <span>145</span>
                        <p>BPM Moy.</p>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="share-workout">
                    <i class="fas fa-share"></i> Partager
                </button>
                <button class="close-modal">Fermer</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    modal.querySelector('.share-workout').addEventListener('click', () => {
        shareWorkout(title, details, date);
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
}

// Partager un entraînement
function shareWorkout(title, details, date) {
    const shareData = {
        title: `Mon entraînement ${title}`,
        text: `J'ai terminé mon entraînement "${title}" le ${date}.\n${details}\nRejoingnez-moi sur Level Up!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .catch(err => console.log('Erreur lors du partage:', err));
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}`;
        window.open(shareUrl, '_blank');
    }
}

// Modifier la fonction de suppression pour inclure la sauvegarde
function deleteObjectif(objectifElement) {
    objectifElement.classList.remove('visible');
    setTimeout(() => {
        objectifElement.remove();
        saveObjectifs();
    }, 300);
}

// Définition des badges disponibles
const BADGES = {
    first_workout: {
        id: 'first_workout',
        name: 'Premier pas',
        description: 'Compléter votre premier entraînement',
        icon: 'fas fa-walking',
        condition: stats => stats.workouts_completed >= 1
    },
    workout_streak: {
        id: 'workout_streak',
        name: 'Sur la lancée',
        description: '5 entraînements en une semaine',
        icon: 'fas fa-fire',
        condition: stats => stats.weekly_workouts >= 5
    },
    calorie_burn: {
        id: 'calorie_burn',
        name: 'Brûleur',
        description: 'Brûler 1000 calories en une semaine',
        icon: 'fas fa-fire-alt',
        condition: stats => stats.weekly_calories >= 1000
    },
    goal_achiever: {
        id: 'goal_achiever',
        name: 'Objectif atteint',
        description: 'Atteindre votre premier objectif',
        icon: 'fas fa-trophy',
        condition: stats => stats.goals_completed >= 1
    }
};

// Initialiser les statistiques détaillées
function initDetailedStats() {
    const stats = loadStats();
    updateStatsUI(stats);
    checkAndAwardBadges(stats);
    loadHistory();
}

// Charger les statistiques
function loadStats() {
    return JSON.parse(localStorage.getItem('levelup_stats') || JSON.stringify({
        calories_burned: 0,
        workouts_completed: 0,
        total_time: 0,
        goals_completed: 0,
        weekly_workouts: 0,
        weekly_calories: 0,
        badges_earned: []
    }));
}

// Mettre à jour les statistiques
function updateStats(newStats) {
    const stats = loadStats();
    const updatedStats = { ...stats, ...newStats };
    localStorage.setItem('levelup_stats', JSON.stringify(updatedStats));
    updateStatsUI(updatedStats);
    checkAndAwardBadges(updatedStats);
    addToHistory('stats_update', 'Mise à jour des statistiques', newStats);
}

// Mettre à jour l'interface des statistiques
function updateStatsUI(stats) {
    document.querySelectorAll('.stat-card').forEach(card => {
        const type = card.querySelector('h4').textContent.toLowerCase();
        const value = card.querySelector('.stat-value');
        const progress = card.querySelector('.stat-progress');

        switch(type) {
            case 'calories brûlées':
                value.textContent = `${stats.calories_burned} kcal`;
                progress.style.setProperty('--progress', `${Math.min(stats.calories_burned / 2000 * 100, 100)}%`);
                break;
            case 'séances complétées':
                value.textContent = stats.workouts_completed;
                progress.style.setProperty('--progress', `${Math.min(stats.workouts_completed / 20 * 100, 100)}%`);
                break;
            case 'temps total':
                value.textContent = `${Math.floor(stats.total_time / 60)}h ${stats.total_time % 60}min`;
                progress.style.setProperty('--progress', `${Math.min(stats.total_time / 1200 * 100, 100)}%`);
                break;
            case 'objectifs atteints':
                value.textContent = stats.goals_completed;
                progress.style.setProperty('--progress', `${Math.min(stats.goals_completed / 10 * 100, 100)}%`);
                break;
        }
    });
}

// Vérifier et attribuer les badges
function checkAndAwardBadges(stats) {
    const badgesGrid = document.querySelector('.badges-grid');
    badgesGrid.innerHTML = '';

    Object.values(BADGES).forEach(badge => {
        const isEarned = stats.badges_earned.includes(badge.id) || badge.condition(stats);
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge-item ${isEarned ? 'earned' : 'locked'}`;
        badgeElement.innerHTML = `
            <i class="${badge.icon} badge-icon"></i>
            <h4 class="badge-name">${badge.name}</h4>
            <p class="badge-description">${badge.description}</p>
        `;

        if (isEarned && !stats.badges_earned.includes(badge.id)) {
            stats.badges_earned.push(badge.id);
            localStorage.setItem('levelup_stats', JSON.stringify(stats));
            showNotification('Nouveau badge débloqué !', `Vous avez obtenu le badge "${badge.name}"`);
            addToHistory('badge_earned', `Badge obtenu : ${badge.name}`, badge);
        }

        badgesGrid.appendChild(badgeElement);
    });
}

// Ajouter un événement à l'historique
function addToHistory(type, title, details) {
    const history = JSON.parse(localStorage.getItem('levelup_history') || '[]');
    history.unshift({
        type,
        title,
        details,
        date: new Date().toISOString()
    });

    // Garder seulement les 50 derniers événements
    if (history.length > 50) history.pop();
    
    localStorage.setItem('levelup_history', JSON.stringify(history));
    updateHistoryUI();
}

// Charger l'historique
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('levelup_history') || '[]');
    updateHistoryUI(history);
}

// Mettre à jour l'interface de l'historique
function updateHistoryUI(history = null) {
    if (!history) {
        history = JSON.parse(localStorage.getItem('levelup_history') || '[]');
    }

    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = '';

    history.forEach(event => {
        const date = new Date(event.date);
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        let icon, details;
        switch(event.type) {
            case 'stats_update':
                icon = 'fas fa-chart-line';
                details = Object.entries(event.details)
                    .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
                    .join(', ');
                break;
            case 'badge_earned':
                icon = 'fas fa-medal';
                details = event.details.description;
                break;
            case 'goal_progress':
                icon = 'fas fa-bullseye';
                details = `Progression: ${event.details.progress}%`;
                break;
            default:
                icon = 'fas fa-info-circle';
                details = JSON.stringify(event.details);
        }

        historyItem.innerHTML = `
            <i class="${icon} history-icon"></i>
            <div class="history-content">
                <h4 class="history-title">${event.title}</h4>
                <p class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
                <p class="history-details">${details}</p>
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}

// Base de données des exercices (à remplacer par une API)
const EXERCICES_DB = {
    pompes: {
        id: 'pompes',
        nom: 'Pompes',
        type: 'musculation',
        muscle: 'pectoraux',
        difficulte: 'intermediaire',
        equipement: 'Aucun',
        thumbnail: 'images/exercices/pompes.jpg',
        video: 'videos/exercices/pompes.mp4',
        description: 'Un exercice classique et efficace pour développer les pectoraux, les épaules et les triceps.',
        instructions: [
            'Placez-vous en position de planche, mains légèrement plus écartées que les épaules',
            'Gardez le corps droit et les abdominaux contractés',
            'Descendez en pliant les coudes jusqu\'à ce que votre poitrine frôle le sol',
            'Remontez en poussant sur vos mains jusqu\'à l\'extension complète des bras'
        ],
        conseils: [
            'Gardez le dos droit tout au long du mouvement',
            'Respirez de manière régulière : inspirez en descendant, expirez en montant',
            'Ne laissez pas vos coudes s\'écarter excessivement du corps'
        ],
        variations: [
            'Pompes sur les genoux pour les débutants',
            'Pompes diamant pour cibler les triceps',
            'Pompes déclinées pour plus de difficulté'
        ]
    },
    // Ajoutez d'autres exercices ici
};

// Initialiser la section exercices
function initExercices() {
    const searchInput = document.getElementById('exerciceSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const muscleFilter = document.getElementById('muscleFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');

    // Charger les exercices initiaux
    loadExercices();

    // Gestionnaire de recherche
    searchInput.addEventListener('input', debounce(() => {
        filterExercices();
    }, 300));

    // Gestionnaire des boutons de filtre
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterExercices();
        });
    });

    // Gestionnaire des filtres de muscle et difficulté
    muscleFilter.addEventListener('change', filterExercices);
    difficultyFilter.addEventListener('change', filterExercices);

    // Charger les favoris
    loadFavorites();
}

// Charger les exercices
function loadExercices(filters = {}) {
    const exercicesGrid = document.querySelector('.exercices-grid');
    exercicesGrid.innerHTML = '';

    Object.values(EXERCICES_DB).forEach(exercice => {
        if (matchFilters(exercice, filters)) {
            const card = createExerciceCard(exercice);
            exercicesGrid.appendChild(card);
        }
    });
}

// Créer une carte d'exercice
function createExerciceCard(exercice) {
    const card = document.createElement('div');
    card.className = 'exercice-card';
    card.innerHTML = `
        <div class="exercice-thumbnail">
            <img src="${exercice.thumbnail}" alt="${exercice.nom}">
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
                </div>
        <div class="exercice-content">
            <h3>${exercice.nom}</h3>
            <div class="exercice-tags">
                <span class="exercice-tag">${exercice.muscle}</span>
                <span class="exercice-tag">${exercice.difficulte}</span>
                <span class="exercice-tag">${exercice.type}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => showExerciceDetails(exercice));
    return card;
}

// Afficher les détails d'un exercice
function showExerciceDetails(exercice) {
    const template = document.getElementById('exerciceModalTemplate');
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    modal.appendChild(template.content.cloneNode(true));

    // Remplir les détails
    const content = modal.querySelector('.modal-content');
    content.querySelector('video source').src = exercice.video;
    content.querySelector('.exercice-title').textContent = exercice.nom;
    content.querySelector('.muscle-group').textContent = exercice.muscle;
    content.querySelector('.difficulty').textContent = exercice.difficulte;
    content.querySelector('.equipment').textContent = exercice.equipement;
    content.querySelector('.exercice-description p').textContent = exercice.description;

    // Remplir les instructions
    const instructionsList = content.querySelector('.exercice-instructions ol');
    exercice.instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });

    // Remplir les conseils
    const tipsList = content.querySelector('.exercice-tips ul');
    exercice.conseils.forEach(conseil => {
        const li = document.createElement('li');
        li.textContent = conseil;
        tipsList.appendChild(li);
    });

    // Remplir les variations
    const variationsList = content.querySelector('.exercice-variations ul');
    exercice.variations.forEach(variation => {
        const li = document.createElement('li');
        li.textContent = variation;
        variationsList.appendChild(li);
    });

    // Gérer les favoris
    const favoriteBtn = content.querySelector('.add-to-favorites');
    const isFavorite = isExerciceFavorite(exercice.id);
    updateFavoriteButton(favoriteBtn, isFavorite);
    
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(exercice.id);
        updateFavoriteButton(favoriteBtn, isExerciceFavorite(exercice.id));
    });

    // Ajouter la modale au DOM
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);

    // Gestionnaire de fermeture
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
}

// Filtrer les exercices
function filterExercices() {
    const searchTerm = document.getElementById('exerciceSearch').value.toLowerCase();
    const activeType = document.querySelector('.filter-btn.active').dataset.filter;
    const selectedMuscle = document.getElementById('muscleFilter').value;
    const selectedDifficulty = document.getElementById('difficultyFilter').value;

    const filters = {
        search: searchTerm,
        type: activeType === 'all' ? null : activeType,
        muscle: selectedMuscle,
        difficulty: selectedDifficulty
    };

    loadExercices(filters);
}

// Vérifier si un exercice correspond aux filtres
function matchFilters(exercice, filters) {
    if (filters.search && !exercice.nom.toLowerCase().includes(filters.search)) {
        return false;
    }
    if (filters.type && exercice.type !== filters.type) {
        return false;
    }
    if (filters.muscle && exercice.muscle !== filters.muscle) {
        return false;
    }
    if (filters.difficulty && exercice.difficulte !== filters.difficulty) {
        return false;
    }
    return true;
}

// Gérer les favoris
function loadFavorites() {
    return JSON.parse(localStorage.getItem('levelup_favorite_exercices') || '[]');
}

function saveFavorites(favorites) {
    localStorage.setItem('levelup_favorite_exercices', JSON.stringify(favorites));
}

function isExerciceFavorite(exerciceId) {
    const favorites = loadFavorites();
    return favorites.includes(exerciceId);
}

function toggleFavorite(exerciceId) {
    const favorites = loadFavorites();
    const index = favorites.indexOf(exerciceId);
    
    if (index === -1) {
        favorites.push(exerciceId);
        showNotification('Exercice ajouté aux favoris', 'L\'exercice a été ajouté à vos favoris.');
    } else {
        favorites.splice(index, 1);
        showNotification('Exercice retiré des favoris', 'L\'exercice a été retiré de vos favoris.');
    }
    
    saveFavorites(favorites);
}

function updateFavoriteButton(button, isFavorite) {
    const icon = button.querySelector('i');
    if (isFavorite) {
        button.classList.add('active');
        icon.className = 'fas fa-heart';
    } else {
        button.classList.remove('active');
        icon.className = 'far fa-heart';
    }
}

// Fonction utilitaire pour debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le profil
    initProfil();
    
    // Initialiser les exercices
    initExercices();
    
    // Gestionnaire pour le bouton de création de profil
    const createProfileBtn = document.querySelector('.create-profile-btn');
    if (createProfileBtn) {
        createProfileBtn.addEventListener('click', showEditProfileModal);
    }

    // Gestionnaire pour les boutons "Commencer"
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const profileSection = document.querySelector('#profil');
            if (profileSection) {
                profileSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Gestionnaire pour le bouton de déconnexion
    const logoutButton = document.querySelector('.btn-connexion');
    if (logoutButton) {
        const isConnected = localStorage.getItem('levelup_profile') || localStorage.getItem('userProfile');
        if (isConnected) {
            logoutButton.textContent = 'Déconnexion';
            logoutButton.href = '#';
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        } else {
            logoutButton.textContent = 'Connexion';
            logoutButton.href = '../connexion.html';
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
    window.location.href = '../index.html';
}

// Gestion de la navigation avec conservation de la session
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn-connexion)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const isConnected = localStorage.getItem('levelup_profile') || localStorage.getItem('userProfile');
            if (isConnected) {
                // Si l'utilisateur est connecté, on modifie les liens pour rester sur le dashboard
                const href = this.getAttribute('href');
                if (href.includes('#')) {
                    e.preventDefault();
                    const section = href.split('#')[1];
                    // Rediriger vers la section appropriée du dashboard
                    const dashboardSection = document.querySelector(`#${section}`);
                    if (dashboardSection) {
                        dashboardSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
}); 