// Exemple de configuration Firebase - NE PAS METTRE DE VRAIES CLÉS ICI
const firebaseConfig = {
    apiKey: "VOTRE_CLE_API",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "votre-messaging-id",
    appId: "votre-app-id"
};

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Initialisation explicite de Firestore
const db = firebase.firestore();

// Export pour utilisation dans d'autres fichiers
window.db = db; 