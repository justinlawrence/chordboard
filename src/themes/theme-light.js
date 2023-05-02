import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material/styles'

import baseTheme from './theme-base'

const paperColor = '#fff'

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

		components: {
			MuiAppBar: {
				styleOverrides: {
					root: {
						borderBottom: '1px solid #eee',
					},
				},
			},
			MuiTabs: {
				styleOverrides: {
					root: {
						backgroundColor: '#eee',
					},
					indicator: {
						backgroundColor: paperColor,

						'&::after': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							boxShadow: '0px 4px 12px 0 rgba(0,0,0,0.16)',
							zIndex: -1,
							borderRadius: 8,
						},
					},
				},
			},
		},
	})
)
