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
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					alignItems: 'center',
					borderRadius: 8,
					marginBottom: 4,
					marginTop: 4,
				},
				flexContainer: {
					position: 'relative',
					zIndex: 1,
				},
				indicator: {
					borderRadius: 8,
					height: '100%',
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					minHeight: 36,
					paddingBottom: 0,
					paddingTop: 0,
					textTransform: 'capitalize',
				},
			},
		},
		MuiTabScrollButton: {
			styleOverrides: {
				root: {
					minHeight: 40,
				},
			},
		},
	},

	// Custom values
	maxPageWidth: 1344,
}

export default baseTheme
