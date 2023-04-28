import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material/styles'

import baseTheme from './theme-base'

export const lightTheme = createTheme(
	deepmerge(baseTheme, {
		palette: {
			background: {
				hero: '#f5f5f5',
			},
			secondary: {
				main: '#fff', //nav was 283149 then fff then d283149
				contrastText: '#000', //was fff then 000
			},
		},
	})
)
