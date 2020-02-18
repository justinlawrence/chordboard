import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { lowerCase, reverse, sortBy } from 'lodash'
import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import DateSignifier from './DateSignifier'
import Hero from './Hero'

import { Magnify as MagnifyIcon } from 'mdi-material-ui'

const styles = theme => ({
	shrinkCell: {
		maxWidth: 0,
	},
	tableRow: {
		cursor: 'pointer',
	},
})

class Sets extends PureComponent {
	static propTypes = {
		classes: PropTypes.object,
		// Redux props
		changeRoute: PropTypes.func.isRequired,
	}

	state = {
		searchText: '',
	}

	componentDidMount() {
		//Set the page title to make it easier to locate
		document.title = 'Setlists'
	}

	filterSets = set => {
		return (
			lowerCase(set.title).includes(lowerCase(this.state.searchText)) ||
			lowerCase(set.author).includes(lowerCase(this.state.searchText)) ||
			lowerCase(set.venue).includes(lowerCase(this.state.searchText))
		)
	}

	handleSearchChange = event => {
		this.setState({
			searchText: event.target.value,
		})
	}

	handleTableRowClick = setId => () =>
		this.props.changeRoute(`/sets/${setId}`)

	render() {
		const { classes, setCurrentSetId, sets = [] } = this.props
		const { searchText } = this.state

		return (
			<div>
				<Hero>
					<ContentLimiter>
						<Grid
							container
							alignItems="center"
							justify="space-between"
						>
							<Grid item>
								<Typography variant="h4">Sets</Typography>
							</Grid>
							<Grid item>
								<Grid container alignItems="center" spacing={2}>
									<Grid item>
										<TextField
											onChange={this.handleSearchChange}
											placeholder="Titles, authors, venues"
											value={searchText}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<MagnifyIcon />
													</InputAdornment>
												),
											}}
										/>
									</Grid>
									<Grid item>
										<Button
											to="/sets/new"
											component={Link}
											color="primary"
											variant="contained"
										>
											New set
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</ContentLimiter>
				</Hero>
				<ContentLimiter>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>Set</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{reverse(
								sortBy(sets.filter(this.filterSets), 'setDate')
							).map(set => (
								<TableRow
									className={classes.tableRow}
									onClick={this.handleTableRowClick(set.id)}
									hover
									key={set.id}
								>
									<TableCell className={classes.shrinkCell}>
										{set.setDate && (
											<DateSignifier date={set.setDate} />
										)}
									</TableCell>

									<TableCell>
										<Typography variant="h6">
											{set.title}
										</Typography>
										<Typography>
											{set.author}
											{set.venue ? ' @ ' + set.venue : ''}
										</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ContentLimiter>
			</div>
		)
	}
}

export default connect(
	null,
	actions
)(withStyles(styles)(Sets))
