import { put, takeLatest } from 'redux-saga/effects'

import {
	FETCH_THEME_REQUEST,
	UPDATE_THEME,
	fetchThemeFailure,
	fetchThemeSuccess,
} from '../actions/'

export function* themeSaga() {
	yield takeLatest( FETCH_THEME_REQUEST, handleFetchThemeRequest )
	yield takeLatest( UPDATE_THEME, handleUpdateTheme )
}

function* handleFetchThemeRequest() {
	try {
		const themeId = localStorage.getItem( 'theme' )
		yield put( fetchThemeSuccess( themeId ) )
	} catch ( err ) {
		yield put( fetchThemeFailure( err ) )
	}
}

function* handleUpdateTheme( { payload: themeId } ) {
	try {
		localStorage.setItem( 'theme', themeId )
	} catch ( err ) {
		return console.error( `ThemeSaga - failed to set theme: ${themeId}`, err )
	}
}
