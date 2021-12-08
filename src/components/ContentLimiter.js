import React from 'react'
import { styled } from '@material-ui/core/styles'
import Grid from '@mui/material/Grid'

const PREFIX = 'ContentLimiter'

const classes = {
	root: `${PREFIX}-root`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
	[`&.${classes.root}`]: {
		margin: '0 auto',
		maxWidth: theme.maxPageWidth,
	},
}))

const ContentLimiter = ({ children }) => (
	<StyledGrid container className={classes.root}>
		<Grid item xs={12}>
			{children}
		</Grid>
	</StyledGrid>
)

export default ContentLimiter
