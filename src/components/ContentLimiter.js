import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	root: {
		margin: '0 auto',
		maxWidth: theme.maxPageWidth
	}
});

const ContentLimiter = ({ children, classes }) => (
	<Grid container className={classes.root}>
		<Grid item xs={12}>{children}</Grid>
	</Grid>
);

export default withStyles(styles)(ContentLimiter);