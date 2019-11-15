import * as Sentry from '@sentry/browser'
import { put, takeLatest } from 'redux-saga/effects'

import {
	FETCH_THEME_REQUEST,
	SET_FONT_SIZE,
	UPDATE_THEME,
	fetchThemeFailure,
	fetchThemeSuccess,
} from '../actions/'

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
