import { createMuiTheme } from '@material-ui/core/styles'
import isEqual from 'lodash/fp/isEqual'

import { FETCH_THEME_SUCCESS, SET_THEME, UPDATE_THEME } from '../actions'
import {
	darkTheme,
	lightTheme,
} from '../../themes'

const defaultMuiTheme = createMuiTheme( lightTheme )

export const themesOrder = [
	'light',
	'dark',
]

export const themes = {
	dark: { muiTheme: darkTheme, name: 'Dark matter' },
	light: { muiTheme: lightTheme, name: 'Flat white' },
}

const initialState = {
	id: 'light',
	muiTheme: defaultMuiTheme,
	name: themes.light.name,
}

export const theme = ( state = initialState, action ) => {
	switch ( action.type ) {
		case FETCH_THEME_SUCCESS:
		case SET_THEME:
		case UPDATE_THEME: {
			const theme = themes[ action.payload ]
				? themes[ action.payload ]
				: themes.light
			const newTheme = {
				id: theme ? action.payload : 'light',
				muiTheme: createMuiTheme( theme.muiTheme ),
				name: theme.name,
			}
			return isEqual( state, newTheme ) ? state : newTheme
		}

		default:
			return state
	}
}

export const getMuiTheme = state => state.theme.muiTheme
export const getTheme = state => state.theme
export const getThemeId = state => state.theme.id
export const getThemeName = state => state.theme.name
