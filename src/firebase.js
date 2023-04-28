import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

import semver from 'semver'
import { browserName, browserVersion } from 'react-device-detect'

// Initialize Firebase.
const firebaseApp = initializeApp({
	apiKey: 'AIzaSyAjZmRaQ30-wo5J6kAiSuMn9_8r-63xxlA',
	authDomain: 'chordboard-209821.firebaseapp.com',
	databaseURL: 'https://chordboard-209821.firebaseio.com',
	projectId: 'chordboard-209821',
	storageBucket: 'chordboard-209821.appspot.com',
	messagingSenderId: '839278764423',
})

if (process.env.NODE_ENV === 'development') {
	window.firebase = firebaseApp
}

export const auth = getAuth(firebaseApp)
export const firestore = getFirestore(firebaseApp)
// Deprecated
export const db = firestore

const unsupportedPersistence =
	browserName === 'Mobile Safari' &&
	semver.satisfies(semver.valid(semver.coerce(browserVersion)), '<=9.0.0')
if (!unsupportedPersistence) {
	enableIndexedDbPersistence(firestore).catch(err => {
		if (err.code === 'failed-precondition') {
			console.error(
				'Multiple tabs open, persistence can only be enabled in one tab at a a time.'
			)
		} else if (err.code === 'unimplemented') {
			console.error(
				'The current browser does not support all of the features required to enable persistence'
			)
		} else {
			console.error(err)
		}
	})
}
