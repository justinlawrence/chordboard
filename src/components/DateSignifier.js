import React from 'react'
import PropTypes from 'prop-types'
import { format, isBefore, parseISO } from 'date-fns'
import cx from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
	root: {
		borderRadius: 4,
		overflow: 'hidden',
		width: theme.spacing.unit * theme.spacing.unit,
	},
	month: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		fontWeight: 800,
		height: theme.spacing.unit * 2.5,
		lineHeight: `${theme.spacing.unit * 2.5}px`,
	},
	monthPast: {
		backgroundColor: theme.palette.grey[400],
	},
	divider: {
		borderBottom: `1px dotted ${theme.palette.divider}`,
		margin: `0 ${theme.spacing.unit}px`,
	},
	date: {
		fontWeight: 800,
	},
	day: {
		fontWeight: 600,
	},
})

const DateSignifier = ({ classes, date }) =>
	date || (date = parseISO(date)) ? (
		<Paper className={classes.root}>
			<Grid container direction="column">
				<Grid item>
					<Typography
						className={cx(classes.month, {
							[classes.monthPast]: isBefore(date, new Date()),
						})}
						align="center"
						variant="caption"
					>
						{format(date, 'MMM')}
					</Typography>
				</Grid>
				<Grid item>
					<Typography
						className={classes.date}
						align="center"
						variant="h5"
					>
						{format(date, 'd')}
					</Typography>
				</Grid>
				<Grid item className={classes.divider} />
				<Grid item>
					<Typography
						className={classes.day}
						align="center"
						variant="caption"
					>
						{format(date, 'EEE')}
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	) : null

DateSignifier.propTypes = {
	classes: PropTypes.object,
	date: PropTypes.any,
}

export default withStyles(styles)(DateSignifier)
