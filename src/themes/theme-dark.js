import { createMuiTheme } from '@material-ui/core/styles'

const baseDarkTheme = createMuiTheme({
	palette: { type: 'dark' },
	typography: { useNextVariants: true },
})

export const darkTheme = {
	typography: {
		useNextVariants: true,
	},
	palette: {
		...baseDarkTheme.palette,
		background: {
			...baseDarkTheme.palette.background,
			hero: '#2a2a2a',
		},
		primary: {
			main: '#F73859', //fab
			contrastText: '#fff',
		},
		secondary: {
			main: '#32343c', //nav was 283149 then fff then 283149
			contrastText: '#fff', //was fff then 000
		},
	},
	spacing: {
		keyline: 64,
	},

	// Custom values
	maxPageWidth: 1344,

	heroBackgroundColor: '#f0f4fc', //hero was #dbedf3m then f5f5f5
	heroContrastText: '#000',
}
