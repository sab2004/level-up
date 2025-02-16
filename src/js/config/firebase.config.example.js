// Configuration Firebase - EXEMPLE
// Renommez ce fichier en firebase.config.js et remplacez les valeurs par vos propres configurations
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "votre-messaging-id",
    appId: "votre-app-id"
};

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Initialisation de Firestore
const db = firebase.firestore();

// Export pour utilisation dans d'autres fichiers
window.db = db; 