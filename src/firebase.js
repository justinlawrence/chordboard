//import firebase from 'firebase';

// Initialize Firebase.
firebase.initializeApp({
    apiKey: "AIzaSyAjZmRaQ30-wo5J6kAiSuMn9_8r-63xxlA",
    authDomain: "chordboard-209821.firebaseapp.com",
    databaseURL: "https://chordboard-209821.firebaseio.com",
    projectId: "chordboard-209821",
    storageBucket: "chordboard-209821.appspot.com",
    messagingSenderId: "839278764423"
});


export const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
