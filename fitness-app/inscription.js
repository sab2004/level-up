document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = new FormData(form);
        const userData = {
            nom: formData.get('nom'),
            email: formData.get('email'),
            age: parseInt(formData.get('age')),
            sexe: formData.get('sexe'),
            poids: parseFloat(formData.get('poids')),
            taille: parseInt(formData.get('taille')),
            objectifPrincipal: formData.get('objectifPrincipal'),
            niveauActivite: formData.get('niveauActivite'),
            frequenceEntrainement: formData.get('frequenceEntrainement'),
            dateInscription: new Date().toISOString()
        };

        // Sauvegarde temporaire des données dans le localStorage
        localStorage.setItem('levelup_profile', JSON.stringify(userData));

        // Message de succès
        alert('Inscription réussie ! Vous allez être redirigé vers votre tableau de bord.');
        
        // Redirection vers le dashboard
        window.location.href = 'dashboard.html';
    });
}); 