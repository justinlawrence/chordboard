const baseTheme = {
	palette: {
		primary: {
			main: '#007FFF',
			contrastText: '#fff',
		},
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
