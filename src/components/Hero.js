import React from 'react'
import { styled } from '@mui/material/styles'
import cx from 'classnames'

import Grid from '@mui/material/Grid'

const PREFIX = 'Hero'

const classes = {
	root: `${PREFIX}-root`,
}

const Root = styled('div')(({ theme }) => ({
	[`&.${classes.root}`]: {
		backgroundColor: theme.palette.background.hero,
		padding: theme.spacing(2),

		[theme.breakpoints.up('sm')]: {
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
	},
}))

const Hero = ({ children, className }) => (
	<Root className={cx(classes.root, className)}>
		<Grid container className={classes.container}>
			<Grid item xs={12}>
				{children}
			</Grid>
		</Grid>
	</Root>
)

export default Hero
