import { createTheme, adaptV4Theme } from '@mui/material/styles'
import isEqual from 'lodash/fp/isEqual'

import { FETCH_THEME_SUCCESS, SET_THEME, UPDATE_THEME } from '../actions'
import { darkTheme, lightTheme } from '../../themes'

export const themesOrder = ['light', 'dark']

export const themes = {
	dark: {
		id: 'dark',
		muiTheme: createTheme(adaptV4Theme(darkTheme)),
		name: 'Dark matter',
	},
	light: {
		id: 'light',
		muiTheme: createTheme(adaptV4Theme(lightTheme)),
		name: 'Flat white',
	},
}

const initialState = themes.dark

export const theme = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_THEME_SUCCESS:
		case SET_THEME:
		case UPDATE_THEME: {
			const newTheme = theme ? themes[action.payload] : initialState
			return isEqual(state, newTheme) ? state : newTheme
		}

		default:
			return state
	}
}

export const getMuiTheme = state => state.theme.muiTheme
export const getTheme = state => state.theme
export const getThemeId = state => state.theme.id
export const getThemeName = state => state.theme.name
