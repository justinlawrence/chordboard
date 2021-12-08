import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material/styles'

import baseTheme from './theme-base'

export const darkTheme = createTheme(
	deepmerge(baseTheme, {
		palette: {
			mode: 'dark',
			background: {
				hero: '#2a2a2a',
			},
			secondary: {
				main: '#32343c', //nav was 283149 then fff then 283149
				contrastText: '#fff', //was fff then 000
			},
		},
	})
)
