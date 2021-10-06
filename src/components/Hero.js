import React from 'react'
import { styled } from '@material-ui/core/styles'
import cx from 'classnames'

import Grid from '@mui/material/Grid'

const PREFIX = 'Hero'

const classes = {
	root: `${PREFIX}-root`,
}

const Root = styled('div')(({ theme }) => ({
	[`&.${classes.root}`]: theme.mixins.gutters({
		backgroundColor: theme.palette.background.hero,
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
	}),
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
