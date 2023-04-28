const baseTheme = {
	palette: {
		primary: {
			main: '#007FFF',
			contrastText: '#fff',
		},
	},
	typography: {
		fontFamily: 'Poppins, sans-serif',
	},

	components: {
		MuiTab: {
			styleOverrides: {
				root: {
					textTransform: 'capitalize',
				},
			},
		},
	},

	// Custom values
	maxPageWidth: 1344,
}

export default baseTheme
