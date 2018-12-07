/* global firebase */

// Initialize Firebase.
firebase.initializeApp({
	apiKey: 'AIzaSyAjZmRaQ30-wo5J6kAiSuMn9_8r-63xxlA',
	authDomain: 'chordboard-209821.firebaseapp.com',
	databaseURL: 'https://chordboard-209821.firebaseio.com',
	projectId: 'chordboard-209821',
	storageBucket: 'chordboard-209821.appspot.com',
	messagingSenderId: '839278764423'
})

export const firestore = firebase.firestore()
export const db = firestore
// Disable deprecated features
firestore.settings({ timestampsInSnapshots: true })

firestore.enablePersistence().catch(err => {
	if (err.code == 'failed-precondition') {
		// Multiple tabs open, persistence can only be enabled
		// in one tab at a a time.
		// ...
	} else if (err.code == 'unimplemented') {
		// The current browser does not support all of the
		// features required to enable persistence
		// ...
	} else {
		console.err(err)
	}
})
