// Script d'initialisation des collections Firestore
async function initializeFirestore() {
    try {
        // Collection des exercices
        const exercicesData = {
            musculation: {
                "squat": {
                    nom: "Squat",
                    description: "Exercice polyarticulaire pour les jambes",
                    muscle_principal: "quadriceps",
                    niveau: "debutant",
                    instructions: [
                        "Position de départ debout, pieds écartés largeur d'épaules",
                        "Descendre en pliant les genoux",
                        "Remonter en poussant sur les talons"
                    ],
                    video_url: "",
                    image_url: ""
                }
                // Autres exercices...
            },
            cardio: {
                "hiit": {
                    nom: "HIIT Course",
                    description: "Intervalles de haute intensité",
                    duree: "20min",
                    niveau: "intermediaire",
                    instructions: [
                        "30 secondes sprint",
                        "30 secondes marche",
                        "Répéter 20 fois"
                    ]
                }
            }
        };

        // Collection des programmes
        const programmesData = {
            musculation: {
                debutant: {
                    titre: "Programme Débutant Force",
                    duree: "12 semaines",
                    frequence: "3x par semaine",
                    exercices: [
                        {
                            nom: "Squat",
                            series: 3,
                            repetitions: "12-15"
                        }
                        // Autres exercices...
                    ]
                }
            },
            nutrition: {
                perte_poids: {
                    titre: "Programme Perte de Poids",
                    calories_base: 2000,
                    repartition: {
                        proteines: "40%",
                        glucides: "30%",
                        lipides: "30%"
                    },
                    conseils: [
                        "Privilégier les protéines maigres",
                        "Éviter les sucres raffinés",
                        "Boire beaucoup d'eau"
                    ]
                }
            }
        };

        // Ajout des données dans Firestore
        const batch = db.batch();

        // Exercices
        Object.entries(exercicesData).forEach(([category, exercises]) => {
            Object.entries(exercises).forEach(([id, data]) => {
                const ref = db.collection('exercices').doc(category).collection('exercises').doc(id);
                batch.set(ref, data);
            });
        });

        // Programmes
        Object.entries(programmesData).forEach(([category, programs]) => {
            Object.entries(programs).forEach(([level, data]) => {
                const ref = db.collection('programmes').doc(category).collection(level).doc('default');
                batch.set(ref, data);
            });
        });

        // Exécution du batch
        await batch.commit();
        console.log('Collections initialisées avec succès !');

    } catch (error) {
        console.error('Erreur lors de l\'initialisation :', error);
    }
}

// Exécuter l'initialisation
initializeFirestore(); 