import * as Sentry from '@sentry/react'
import { takeLatest } from 'redux-saga/effects'

import { SET_FONT_SIZE } from '../actions/'

export function* userSaga() {
	yield takeLatest(SET_FONT_SIZE, handleSetFontSize)
}

function* handleSetFontSize({ payload }) {
	try {
		const user = JSON.parse(localStorage.getItem('user')) || {}
		user.fontSize = payload
		localStorage.setItem('user', JSON.stringify(user))
	} catch (err) {
		Sentry.withScope(() => {
			Sentry.captureMessage(
				'Failed to save user font size to localStorage'
			)
			Sentry.captureException(err)
		})
	}
}
