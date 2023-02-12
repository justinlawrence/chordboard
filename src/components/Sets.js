import React, { PureComponent } from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { lowerCase, reverse, sortBy } from 'lodash'
import { Link, withRouter } from 'react-router-dom'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import DateSignifier from './DateSignifier'
import Hero from './Hero'

import { Magnify as MagnifyIcon } from 'mdi-material-ui'

const PREFIX = 'Sets'

const classes = {
	shrinkCell: `${PREFIX}-shrinkCell`,
	tableRow: `${PREFIX}-tableRow`,
}

const Root = styled('div')(({ theme }) => ({
	[`& .${classes.shrinkCell}`]: {
		width: theme.spacing(10),
	},

	[`& .${classes.tableRow}`]: {
		cursor: 'pointer',
	},
}))

class Sets extends PureComponent {
	static propTypes = {
		classes: PropTypes.object,
		history: PropTypes.object,
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
		this.props.history.push(`/sets/${setId}`)

	render() {
		const { sets = [] } = this.props
		const { searchText } = this.state

		return (
			<Root>
				<Hero>
					<ContentLimiter>
						<Grid
							container
							alignItems={'center'}
							justifyContent={'space-between'}
						>
							<Grid item>
								<Typography
									variant={'h4'}
									sx={{ fontWeight: 600 }} //TODO: move this into the global theme
								>
									Cancioneros
								</Typography>
							</Grid>
							<Grid item>
								<Grid
									container
									alignItems={'center'}
									spacing={2}
								>
									<Grid item>
										<TextField
											onChange={this.handleSearchChange}
											placeholder={
												'Titulos, autor, extras'
											}
											value={searchText}
											InputProps={{
												endAdornment: (
													<InputAdornment
														position={'end'}
													>
														<MagnifyIcon />
													</InputAdornment>
												),
											}}
										/>
									</Grid>
									<Grid item>
										<Button
											to={'/sets/new'}
											component={Link}
											color={'primary'}
											variant={'contained'}
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
								<TableCell>Fecha</TableCell>
								<TableCell>Cancionero</TableCell>
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
										<Typography variant={'h6'}>
											{set.title}
										</Typography>
										<Typography variant={'caption'}>
											{set.author}
											{set.venue ? ' @ ' + set.venue : ''}
										</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ContentLimiter>
			</Root>
		)
	}
}

export default connect(null, actions)(withRouter(Sets))
