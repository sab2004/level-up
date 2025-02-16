document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Récupération des données du formulaire
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');
            
            console.log('Tentative de création du compte...'); // Log de debug

            // Création du compte utilisateur avec Firebase Auth
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            console.log('Compte créé avec succès, UID:', user.uid); // Log de debug

            // Préparation des données utilisateur pour Firestore
            const userData = {
                uid: user.uid,
                nom: formData.get('nom'),
                email: formData.get('email'),
                age: parseInt(formData.get('age')),
                sexe: formData.get('sexe'),
                poids: parseFloat(formData.get('poids')),
                taille: parseInt(formData.get('taille')),
                objectifPrincipal: formData.get('objectifPrincipal'),
                niveauActivite: formData.get('niveauActivite'),
                frequenceEntrainement: formData.get('frequenceEntrainement'),
                dateInscription: firebase.firestore.FieldValue.serverTimestamp()
            };

            console.log('Données à sauvegarder:', userData); // Log de debug

            // Sauvegarde des données dans Firestore
            try {
                await db.collection('users').doc(user.uid).set(userData);
                console.log('Données sauvegardées avec succès dans Firestore'); // Log de debug
            } catch (firestoreError) {
                console.error('Erreur Firestore:', firestoreError);
                alert('Compte créé mais erreur lors de la sauvegarde des données. Veuillez contacter le support.');
                return;
            }

            // Message de succès
            alert('Inscription réussie ! Vous allez être redirigé vers votre tableau de bord.');
            
            // Redirection vers le dashboard
            window.location.href = '../dashboard/index.html';
            
        } catch (error) {
            console.error('Erreur complète:', error); // Log de debug détaillé
            let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
            
            // Messages d'erreur personnalisés
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Cette adresse email est déjà utilisée.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'L\'adresse email n\'est pas valide.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'L\'inscription par email/mot de passe n\'est pas activée.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
                    break;
            }
            
            alert(errorMessage);
            console.error('Erreur d\'inscription:', error);
        }
    });
}); 