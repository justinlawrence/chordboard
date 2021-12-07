import * as Sentry from '@sentry/react'

export const loadLocalStorage = key => {
	try {
		return JSON.parse(localStorage.getItem(key))
	} catch (err) {
		Sentry.captureException(err)
		return {}
	}
}

export const saveLocalStorage = (key, value) => {
	try {
		return localStorage.setItem(key, JSON.stringify(value))
	} catch (err) {
		Sentry.captureException(err)
	}
}
