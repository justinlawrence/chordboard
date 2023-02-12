import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import semver from 'semver'
import {
	browserName,
	browserVersion,
} from 'react-device-detect'

// Initialize Firebase.

firebase.initializeApp({
	apiKey: "AIzaSyCztNSkMliKVJy2uLJcxiqLf2zq6eeaBpY",
	authDomain: "cancionero-42fd8.firebaseapp.com",
	projectId: "cancionero-42fd8",
	storageBucket: "cancionero-42fd8.appspot.com",
	messagingSenderId: "792311619625",
	appId: "1:792311619625:web:01459cfead94b3fcd2bc38",
	measurementId: "G-KJLXB5L5K2"
  });
if (process.env.NODE_ENV === 'development') {
	window.firebase = firebase
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
// Deprecated
export const db = firestore

const unsupportedPersistence =
	browserName === 'Mobile Safari' &&
	semver.satisfies(semver.valid(semver.coerce(browserVersion)), '<=9.0.0')
if (!unsupportedPersistence) {
	firestore.enablePersistence({ synchronizeTabs: true }).catch(err => {
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
