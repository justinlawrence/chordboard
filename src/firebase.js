import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import semver from 'semver'
import {
	osVersion,
	osName,
	mobileVendor,
	browserName,
	browserVersion,
	engineName,
	engineVersion,
} from 'react-device-detect'

// Initialize Firebase.
firebase.initializeApp({
	apiKey: 'AIzaSyAjZmRaQ30-wo5J6kAiSuMn9_8r-63xxlA',
	authDomain: 'chordboard-209821.firebaseapp.com',
	databaseURL: 'https://chordboard-209821.firebaseio.com',
	projectId: 'chordboard-209821',
	storageBucket: 'chordboard-209821.appspot.com',
	messagingSenderId: '839278764423',
})

if (process.env.NODE_ENV === 'development') {
	window.firebase = firebase
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
// Deprecated
export const db = firestore

const unsupportedPersistence =
	browserName === 'Mobile Safari' &&
	semver.satisfies(semver.valid(semver.coerce(browserVersion)), '>=9.0.0')
if (!unsupportedPersistence) {
	firestore.enablePersistence().catch(err => {
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
