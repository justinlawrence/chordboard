import React from 'react';
import PropTypes from 'prop-types';
import { format, isBefore } from 'date-fns'
import cx from 'classnames';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

const styles = theme => ({
	root: {
		borderRadius: 4,
		overflow: 'hidden',
		width: theme.spacing.unit * theme.spacing.unit
	},
	month: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		fontSize: theme.typography.caption.fontSize,
		fontWeight: 800,
		height: theme.spacing.unit * 2.5,
		lineHeight: `${theme.spacing.unit * 2.5}px`,
		textAlign: 'center'
	},
	monthPast: {
		backgroundColor: theme.palette.grey[ 400 ],
	},
	divider: {
		borderBottom: `1px dotted ${theme.palette.divider}`,
		margin: `0 ${theme.spacing.unit}px`
	},
	date: {
		fontSize: theme.typography.headline.fontSize,
		fontWeight: 800,
		textAlign: 'center'
	},
	day: {
		fontSize: theme.typography.caption.fontSize,
		fontWeight: 600,
		textAlign: 'center',
	}
});

const DateSignifier = ( { classes, date } ) => (
	<Paper className={classes.root}>
		<Grid container direction="column">
			<Grid item className={cx(
				classes.month,
				{ [ classes.monthPast ]: isBefore( date, new Date() ) }
			)}>
				{format( date, 'MMM' )}
			</Grid>
			<Grid item className={classes.date}>
				{format( date, 'D' )}
			</Grid>
			<Grid item className={classes.divider}/>
			<Grid item className={classes.day}>
				{format( date, 'ddd' )}
			</Grid>
		</Grid>
	</Paper>
);

DateSignifier.propTypes = {
	classes: PropTypes.object,
	date: PropTypes.string.isRequired
}

export default withStyles( styles )( DateSignifier );