import React from 'react'
import PropTypes from 'prop-types'
import { format, isBefore } from 'date-fns'
import cx from 'classnames'

import { withStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
	root: {
		borderRadius: 4,
		overflow: 'hidden',
		width: theme.spacing(8),
	},
	month: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		fontWeight: 800,
		height: theme.spacing(2.5),
		lineHeight: `${theme.spacing(2.5)}px`,
	},
	monthPast: {
		backgroundColor: theme.palette.grey[400],
	},
	divider: {
		borderBottom: `1px dotted ${theme.palette.divider}`,
		margin: `0 ${theme.spacing()}px`,
	},
	date: {
		fontWeight: 800,
	},
	day: {
		fontWeight: 600,
	},
})

const DateSignifier = ({ classes, date }) =>
	date instanceof Date && !isNaN(date) ? (
		<Paper className={classes.root}>
			<Grid container direction="column">
				<Grid item>
					<Typography
						className={cx(classes.month, {
							[classes.monthPast]: isBefore(date, new Date()),
						})}
						align="center"
						display="block"
						variant="caption"
					>
						{format(date, 'MMM')}
					</Typography>
				</Grid>
				<Grid item>
					<Typography
						className={classes.date}
						align="center"
						display="block"
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
						display="block"
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
