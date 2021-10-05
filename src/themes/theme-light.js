/*

Based on this theme
http://colorhunt.co/c/114174

*/

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

/*

Based on this theme
http://colorhunt.co/c/114174



const defaultTheme = {
	palette: {
		primary: {
			main: '#F73859', //fab
			contrastText: '#fff'
		},
		secondary: {
			main: '#283149', //nav was 283149 then fff
			contrastText: '#fff' //was fff then 000
		}
	},

	// Custom values
	maxPageWidth: 1344,

	heroBackgroundColor: '#dbedf3', //hero was #dbedf3m then f5f5f5
	heroContrastText: '#000'
};
*/

/*

//based on http://colorhunt.co/c/118766

const defaultTheme = {
	palette: {
		primary: {
			main: '#EF7B7B', //fab
			contrastText: '#fff'
		},
		secondary: {
			main: '#C4EADA', //nav
			contrastText: '#000'
		}
	},

	// Custom values
	maxPageWidth: 1344,
	heroBackgroundColor: '#FCF3CA' //hero
};

*/
