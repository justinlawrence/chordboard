import { createTheme } from '@mui/material/styles'

const baseDarkTheme = createTheme({
	palette: { mode: 'dark' },
})

export const darkTheme = {
	palette: {
		...baseDarkTheme.palette,
		background: {
			...baseDarkTheme.palette.background,
			hero: '#2a2a2a',
		},
		primary: {
			main: '#007FFF', //fab
			contrastText: '#fff',
		},
		secondary: {
			main: '#32343c', //nav was 283149 then fff then 283149
			contrastText: '#fff', //was fff then 000
		},
	},

	// Custom values
	maxPageWidth: 1344,

	heroBackgroundColor: '#f0f4fc', //hero was #dbedf3m then f5f5f5
	heroContrastText: '#000',
}
