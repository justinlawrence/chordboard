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

		components: {
			MuiAppBar: {
				styleOverrides: {
					root: {
						//borderBottom: '1px solid #333',
					},
				},
			},
			MuiTab: {
				styleOverrides: {
					root: {
						'&.Mui-selected': {
							color: '#fff',
						},
					},
				},
			},
			MuiTabs: {
				styleOverrides: {
					root: {
						backgroundColor: '#333',
					},
					indicator: {
						backgroundColor: 'rgba(255, 255, 255, 0.08)',

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
