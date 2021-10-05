import { createTheme, adaptV4Theme } from '@mui/material/styles'

const baseTheme = createTheme(
	adaptV4Theme({
		typography: { useNextVariants: true },
	})
)

export const lightTheme = {
	typography: {
		useNextVariants: true,
	},
	palette: {
		...baseTheme.palette,
		background: {
			...baseTheme.palette.background,
			hero: '#f5f5f5',
		},
		primary: {
			main: '#007FFF', //fab
			contrastText: '#fff',
		},
		secondary: {
			main: '#fff', //nav was 283149 then fff then d283149
			contrastText: '#000', //was fff then 000
		},
	},

	// Custom values
	maxPageWidth: 1344,

	heroBackgroundColor: '#f5f5f5', // hero was #dbedf3m then f5f5f5 then '#f0f4fc'
	heroContrastText: '#000',
}
